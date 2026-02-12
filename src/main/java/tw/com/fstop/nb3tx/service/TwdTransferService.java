package tw.com.fstop.nb3tx.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tw.com.fstop.nb3tx.domain.Bank;
import tw.com.fstop.nb3tx.repository.BankRepository;
import tw.com.fstop.nb3tx.repository.ReplyRepository;

import java.util.*;

@Service
public class TwdTransferService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private BankRepository bankRepository;

    @Autowired
    private ReplyRepository replyRepository;

    // 注入設定檔網址
    @Value("${remote.central.tw-n920-url}") private String n920Url;
    @Value("${remote.central.tw-n921-url}") private String n921Url;
    @Value("${remote.central.tw-n110-url}") private String n110Url;
    @Value("${remote.central.tw-n070-url}") private String n070Url;

    private final String TEST_CUSIDN = "A123456814";

    /**
     * P1 初始資料準備：取得轉出帳號、餘額、約定帳號、銀行列表
     */
    public Map<String, Object> prepareInitData() {
        Map<String, Object> result = new HashMap<>();
        Map<String, String> request = new HashMap<>();
        request.put("cusidn", TEST_CUSIDN);

        // 1. N920 + N110 (帳號與餘額)
        List<Map<String, Object>> myAccounts = new ArrayList<>();
        try {
            Map<String, Object> n920Res = restTemplate.postForObject(n920Url, request, Map.class);
            if (n920Res != null && n920Res.containsKey("accounts")) {
                myAccounts = (List<Map<String, Object>>) n920Res.get("accounts");
                
                // 批次查餘額
                for (Map<String, Object> acc : myAccounts) {
                    String acn = (String) acc.get("acn");
                    fetchBalance(acn, acc);
                }
            }
        } catch (Exception e) {
            System.err.println("N920/N110 Service Error: " + e.getMessage());
        }
        result.put("myAccounts", myAccounts);

        // 2. N921 (約定帳號) + 補銀行名稱
        List<Map<String, Object>> agreedAccounts = new ArrayList<>();
        try {
            Map<String, Object> n921Res = restTemplate.postForObject(n921Url, request, Map.class);
            if (n921Res != null && n921Res.containsKey("accounts")) {
                agreedAccounts = (List<Map<String, Object>>) n921Res.get("accounts");
            }
        } catch (Exception e) {
            System.err.println("N921 Service Error: " + e.getMessage());
        }
        
        // 3. DB (所有銀行)
        List<Bank> allBanks = new ArrayList<>();
        try {
            allBanks = bankRepository.findAll();
            // 幫約定帳號補上名稱
            fillBankNames(agreedAccounts, allBanks);
        } catch (Exception e) {
            System.err.println("Bank DB Service Error: " + e.getMessage());
        }
        
        result.put("agreedAccounts", agreedAccounts);
        result.put("allBanks", allBanks);

        return result;
    }

    /**
     * P2 查詢單一銀行名稱
     */
    public String findBankNameByCode(String code) {
        if (code == null) return "";
        // 處理格式 (例如 004-台銀 -> 004)
        String cleanCode = code.length() > 3 && code.contains("-") ? code.split("-")[0] : code;
        
        try {
            return bankRepository.findAll().stream()
                    .filter(b -> b.getCode().equals(cleanCode))
                    .map(Bank::getName)
                    .findFirst()
                    .orElse("未知銀行");
        } catch (Exception e) {
            return "查詢失敗";
        }
    }

    /**
     * P3 執行交易 (回傳 Map 包含結果或錯誤資訊)
     */
    public Map<String, Object> executeTransfer(String outacn, String inbnk, String inacn, String amount, String pinnew) {
        Map<String, String> n070Req = new HashMap<>();
        n070Req.put("outacn", outacn);
        n070Req.put("inbnk", inbnk);
        n070Req.put("inacn", inacn);
        n070Req.put("amount", amount);
        n070Req.put("pinnew", pinnew);

        try {
            System.out.println(">>> [Service] 發送 N070: " + n070Req);
            Map<String, Object> tradeResp = restTemplate.postForObject(n070Url, n070Req, Map.class);
            
            String code = (String) tradeResp.get("code");
            
            if ("0000".equals(code)) {
                // 成功：補上轉入銀行名稱
                tradeResp.put("bankName", findBankNameByCode((String) tradeResp.get("inbnk")));
                tradeResp.put("isSuccess", true);
            } else {
                // 失敗：查錯誤訊息
                String errMsg = replyRepository.findMessageByCode(code);
                tradeResp.put("isSuccess", false);
                tradeResp.put("errorMessage", errMsg);
            }
            return tradeResp;

        } catch (Exception e) {
            Map<String, Object> errorResp = new HashMap<>();
            errorResp.put("isSuccess", false);
            errorResp.put("code", "E999");
            errorResp.put("errorMessage", "系統連線失敗 (" + e.getMessage() + ")");
            return errorResp;
        }
    }

    // --- Private Helper Methods ---

    private void fetchBalance(String acn, Map<String, Object> acc) {
        try {
            Map<String, String> req = new HashMap<>();
            req.put("cusidn", TEST_CUSIDN);
            req.put("acn", acn);
            Map<String, Object> res = restTemplate.postForObject(n110Url, req, Map.class);
            
            Object bal = "0";
            if (res != null && res.containsKey("accounts")) {
                List<Map<String, Object>> list = (List<Map<String, Object>>) res.get("accounts");
                if (!list.isEmpty()) {
                    Map<String, Object> first = list.get(0);
                    bal = first.getOrDefault("bal", first.getOrDefault("BAL", "0"));
                }
            }
            acc.put("bal", bal);
        } catch (Exception e) {
            acc.put("bal", "查詢失敗");
        }
    }

    private void fillBankNames(List<Map<String, Object>> agreedAccounts, List<Bank> allBanks) {
        if (agreedAccounts == null) return;
        for (Map<String, Object> acc : agreedAccounts) {
            String code = (String) acc.get("bnkcod");
            String name = allBanks.stream()
                    .filter(b -> b.getCode().equals(code))
                    .map(Bank::getName)
                    .findFirst()
                    .orElse("未知銀行");
            acc.put("bnkName", name);
        }
    }
}