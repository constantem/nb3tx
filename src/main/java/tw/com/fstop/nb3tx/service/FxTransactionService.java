package tw.com.fstop.nb3tx.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import tw.com.fstop.nb3tx.domain.*;
import tw.com.fstop.nb3tx.repository.CurrencyRepository;
import tw.com.fstop.nb3tx.repository.ReplyRepository;

@Service
public class FxTransactionService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private CurrencyRepository currencyRepository;
    
    @Autowired
    private ReplyRepository replyRepository;

    @Value("${remote.central.fx-n510-url}")
    private String n510Url;

    @Value("${remote.central.tw-n920-url}")
    private String n920Url;

    @Value("${remote.central.tw-n110-url}")
    private String n110Url;

    @Value("${remote.central.fx-f007-url}")
    private String f007Url;

    @Value("${remote.central.fx-f574-url}")
    private String f574Url;

    // 台幣帳號、外幣餘額查詢 (N920, N510)

    public List<AccountOption> callN920(String cusidn) {
        List<AccountOption> options = new ArrayList<>();
        try {
            System.out.println(">>> [Service] 呼叫 N920 (台幣帳號)...");
            N920Request req920 = new N920Request();
            req920.setCusidn(cusidn);

            N920Response resp920 = restTemplate.postForObject(n920Url, req920, N920Response.class);

            if (resp920 != null && resp920.getAccounts() != null) {
                for (N920Response.AccountData acct : resp920.getAccounts()) {
                    String balance = (acct.getBal() != null) ? " (餘額: " + acct.getBal() + ")" : "";
                    options.add(new AccountOption(acct.getAcn(), acct.getAcn() + " (台幣)" + balance));
                }
                System.out.println(">>> [Service] N920 成功取得 " + resp920.getAccounts().size() + " 筆");
            }
        } catch (Exception e) {
            System.out.println(">>> [Service] N920 失敗: " + e.getMessage());
        }
        return options;
    }

    public static class FxAccountData {
        private List<AccountOption> options = new ArrayList<>();
        private Map<String, Map<String, Double>> balanceMap = new HashMap<>();

        public List<AccountOption> getOptions() { return options; }
        public Map<String, Map<String, Double>> getBalanceMap() { return balanceMap; }
    }

    public FxAccountData callN510(String cusidn) {
        FxAccountData data = new FxAccountData();
        try {
            System.out.println(">>> [Service] 呼叫 N510 (外幣帳號)...");
            N510Request req510 = new N510Request();
            req510.setCusidn(cusidn);

            N510Response resp510 = restTemplate.postForObject(n510Url, req510, N510Response.class);

            if (resp510 != null && "0000".equals(resp510.getCode()) && resp510.getAccountList() != null) {
                for (N510Response.AccountInfo acct : resp510.getAccountList()) {
                    data.options.add(new AccountOption(acct.getAccountNumber(), acct.getAccountNumber() + " (外幣)"));

                    Map<String, Double> balances = new HashMap<>();
                    if (acct.getBalances() != null) {
                        for (N510Response.BalanceInfo b : acct.getBalances()) {
                            balances.put(b.getCurrency(), b.getBalance());
                        }
                    }
                    data.balanceMap.put(acct.getAccountNumber(), balances);
                }
                System.out.println(">>> [Service] N510 成功取得 " + resp510.getAccountList().size() + " 筆");
            }
        } catch (Exception e) {
            System.out.println(">>> [Service] N510 失敗: " + e.getMessage());
        }
        return data;
    }

    public String convertBalanceMapToJson(Map<String, Map<String, Double>> balanceMap) {
        try {
            return new ObjectMapper().writeValueAsString(balanceMap);
        } catch (Exception e) {
            System.out.println(">>> [Service] JSON 轉換失敗");
            return "{}";
        }
    }

    // 台幣餘額查詢 (N110)
    
    public String callN110(String cusidn, String acctNo) {
        try {
            N110Request req = new N110Request();
            req.setCusidn(cusidn);
            req.setAcn(acctNo);

            N110Response resp = restTemplate.postForObject(n110Url, req, N110Response.class);

            if (resp != null && resp.getAccounts() != null && !resp.getAccounts().isEmpty()) {
                return resp.getAccounts().get(0).getBal();
            }
        } catch (Exception e) {
            System.out.println(">>> [Service] N110 失敗: " + e.getMessage());
        }
        return "查詢失敗";
    }

    // 匯率議價 (F007)

    public F007Response callF007(TransactionForm form, String cusidn) throws Exception {
        F007Request quoteReq = new F007Request();
        quoteReq.setCusidn(cusidn);
        quoteReq.setFromAccount(form.getFromAccount());
        quoteReq.setFromCurr(form.getFromCurr());
        quoteReq.setToCurr(form.getToCurr());
        quoteReq.setAmount(form.getAmount());

        return restTemplate.postForObject(f007Url, quoteReq, F007Response.class);
    }

    // 執行交易 (F574)
    public F574Response callF574(TransactionForm form) throws Exception {
        F574Request tradeReq = new F574Request();
        tradeReq.setQuoteId(form.getQuoteId());
        tradeReq.setFromAccount(form.getFromAccount());
        tradeReq.setToAccount(form.getToAccount());
        tradeReq.setPinnew(form.getPassword());

        return restTemplate.postForObject(f574Url, tradeReq, F574Response.class);
    }

    // DB查詢
    
    public Map<String, String> getCurrencyMap() {
        Map<String, String> currencyMap = new LinkedHashMap<>();
        try {
            List<Currency> dbCurrencies = currencyRepository.findAll();
            for (Currency c : dbCurrencies) {
                currencyMap.put(c.getCode(), c.getCode() + " " + c.getName());
            }
        } catch (Exception e) {
            currencyMap.put("TWD", "TWD 新臺幣 (DB離線)");
            currencyMap.put("USD", "USD 美金 (DB離線)");
        }
        return currencyMap;
    }
    
    public String getErrorMessage(String errorCode) {
        String errorMsg = replyRepository.findMessageByCode(errorCode);
        if (errorMsg == null || errorMsg.isEmpty()) {
            return "交易失敗 (代碼: " + errorCode + ")";
        }
        return errorMsg;
    }

    //隱碼與格式化
    public String maskLast4Digits(String account) {
        if (account == null || account.length() <= 4) {
            return account;
        }
        String prefix = account.substring(0, account.length() - 4);
        return prefix + "****";
    }

    public String formatAmount(Double amount, String curr) {
        if (amount == null) return "0";
        if ("TWD".equals(curr)) {
            java.text.DecimalFormat df = new java.text.DecimalFormat("#,###");
            return df.format(amount);
        } else {
            java.text.DecimalFormat df = new java.text.DecimalFormat("#,##0.00");
            return df.format(amount);
        }
    }
    
    //合併帳號
    public List<AccountOption> getAllAccounts(String userId) {
        List<AccountOption> twd = callN920(userId);
        FxAccountData fx = callN510(userId);
        
        List<AccountOption> all = new ArrayList<>(twd);
        all.addAll(fx.getOptions());
        
        return all;
    }

    //統一解析 API 錯誤代碼
    public String parseApiErrorCode(HttpClientErrorException e) {
        try {
            String responseBody = e.getResponseBodyAsString();
            ObjectMapper mapper = new ObjectMapper();

            com.fasterxml.jackson.databind.JsonNode node = mapper.readTree(responseBody);
            
            if (node.has("code")) {
                return node.get("code").asText();
            }
        } catch (Exception ex) {
        }
        return "E999"; 
    }
}