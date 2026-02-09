package tw.com.fstop.nb3tx.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.*;

@Controller
@RequestMapping("/TwdTransfer")
public class TwdTransactionController {

    @Autowired
    private RestTemplate restTemplate;

    // 確保 application.properties 設定正確
    @Value("${remote.central.tw-n920-url}") private String n920Url;
    @Value("${remote.central.tw-n921-url}") private String n921Url;
    @Value("${remote.central.tw-n110-url}") private String n110Url;
    @Value("${remote.central.tw-n070-url}") private String n070Url;

    private final String TEST_CUSIDN = "A123456814";

    /**
     * [步驟 1] 初始化 P1-1
     * 需求：N920 -> N110(查餘額) -> N921
     */
    @GetMapping("/init-p1")
    public String initP1(Model model) {
        System.out.println("\n==========================================");
        System.out.println(">>> [Step 1] 進入 init-p1");
        System.out.println("==========================================");

        // 避免連線卡死的設定
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000);
        factory.setReadTimeout(3000);
        RestTemplate customRestTemplate = new RestTemplate(factory);

        Map<String, String> request = new HashMap<>();
        request.put("cusidn", TEST_CUSIDN);

        // ---------------------------------------------------
        // 1. N920 (轉出帳號列表)
        // ---------------------------------------------------
        List<Map<String, Object>> myAccounts = new ArrayList<>();
        try {
            System.out.println(">>> [API呼叫] 正在呼叫 N920...");
            Map<String, Object> n920Res = customRestTemplate.postForObject(n920Url, request, Map.class);
            if (n920Res != null && n920Res.containsKey("accounts")) {
                myAccounts = (List<Map<String, Object>>) n920Res.get("accounts");
            }
            // ★ 印出 N920 結果
            System.out.println(">>> [API回應] N920 轉出帳號列表: " + myAccounts);
        } catch (Exception e) {
            System.err.println("N920 Error: " + e.getMessage());
        }

        // ---------------------------------------------------
        // 2. N110 (針對每個帳號查餘額)
        // ---------------------------------------------------
        if (myAccounts != null) {
            System.out.println(">>> [API呼叫] 開始批次呼叫 N110 查餘額...");
            for (Map<String, Object> acc : myAccounts) {
                String acn = (String) acc.get("acn");
                try {
                    Map<String, String> n110Req = new HashMap<>();
                    n110Req.put("cusidn", TEST_CUSIDN);
                    n110Req.put("acn", acn);
                    
                    Map<String, Object> n110Res = customRestTemplate.postForObject(n110Url, n110Req, Map.class);
                    System.out.println("    [原始回傳] 帳號 " + acn + " 的 N110 結果: " + n110Res);
                    Object balanceObj = "0"; // 預設值
                    
                    if (n110Res != null && n110Res.containsKey("accounts")) {
                        // 1. 先取出 accounts 列表
                        List<Map<String, Object>> accountList = (List<Map<String, Object>>) n110Res.get("accounts");
                        
                        // 2. 確保列表有資料，然後取出第一筆
                        if (accountList != null && !accountList.isEmpty()) {
                            Map<String, Object> firstAccount = accountList.get(0);
                            
                            // 3. 從第一筆資料中取出 bal (同時檢查大小寫)
                            if (firstAccount.containsKey("bal")) {
                                balanceObj = firstAccount.get("bal");
                            } else if (firstAccount.containsKey("BAL")) {
                                balanceObj = firstAccount.get("BAL");
                            }
                        }
                    }
                    // ★★★ 修正結束 ★★★

                    // 將抓到的餘額存回 acc
                    acc.put("bal", balanceObj);
                    System.out.println("    -> 帳號: " + acn + " | 餘額: " + balanceObj);

                } catch (Exception e) {
                    acc.put("bal", "查詢失敗");
                    System.err.println("    -> 帳號: " + acn + " 查詢失敗");
                }
            }
        }
        model.addAttribute("myAccounts", myAccounts);

        // ---------------------------------------------------
        // 3. N921 (約定帳號)
        // ---------------------------------------------------
        List<Map<String, Object>> agreedAccounts = new ArrayList<>();
        try {
            System.out.println(">>> [API呼叫] 正在呼叫 N921...");
            Map<String, Object> n921Res = customRestTemplate.postForObject(n921Url, request, Map.class);
            if (n921Res != null && n921Res.containsKey("accounts")) {
                agreedAccounts = (List<Map<String, Object>>) n921Res.get("accounts");
            }
            // ★ 印出 N921 結果
            System.out.println(">>> [API回應] N921 約定帳號列表: " + agreedAccounts);
        } catch (Exception e) {
            System.err.println("N921 Error: " + e.getMessage());
        }
        model.addAttribute("agreedAccounts", agreedAccounts);

        System.out.println(">>> [P1-1] 資料準備完成，轉發至 JSP");
        return "TW/P1-1";
    }

    /**
     * [步驟 2] 前往 P2 確認頁
     * 需求：同步 P1 資料
     */
    @PostMapping("/go-to-p2")
    public String goToP2(@RequestParam("fromAcct") String fromAcct, 
                         @RequestParam("toBank") String toBank, 
                         @RequestParam("toAcct") String toAcct,
                         @RequestParam("amount") String amount,
                         Model model) {
        
        System.out.println("\n==========================================");
        System.out.println(">>> [Step 2] P1 -> P2 資料傳遞與確認");
        System.out.println("==========================================");
        
        // ★ 印出 P1 傳來的 Form Data
        System.out.println(">>> [前端傳入] 接收到的參數如下：");
        System.out.println("    1. 轉出帳號 (fromAcct): " + fromAcct);
        System.out.println("    2. 轉入銀行 (toBank)  : " + toBank);
        System.out.println("    3. 轉入帳號 (toAcct)  : " + toAcct);
        System.out.println("    4. 轉帳金額 (amount)  : " + amount);

        // 將接收到的資料再次放入 Model
        model.addAttribute("fromAcct", fromAcct);
        model.addAttribute("toBank", toBank);
        model.addAttribute("toAcct", toAcct);
        model.addAttribute("amount", amount);

        System.out.println(">>> [P2] 資料已存入 Model，準備顯示確認頁");
        return "TW/P2";
    }

    /**
     * [步驟 3] 執行 N070 並跳轉 P3
     * 需求：寫入密碼，執行交易，顯示結果
     */
    @PostMapping("/do-transfer")
    public String doTransfer(@RequestParam("fromAcct") String outacn,
                             @RequestParam("toBankCode") String inbnk,
                             @RequestParam("toAcct") String inacn,
                             @RequestParam("amount") String amount,
                             @RequestParam("pinnew") String pinnew,
                             RedirectAttributes redirectAttributes) {
        
        System.out.println("\n==========================================");
        System.out.println(">>> [Step 3] P2 -> 執行交易 (呼叫 N070)");
        System.out.println("==========================================");
        
        // ★ 印出 P2 傳來的參數
        System.out.println(">>> [前端傳入] 最終交易參數：");
        System.out.println("    轉出帳號: " + outacn);
        System.out.println("    轉入銀行: " + inbnk);
        System.out.println("    轉入帳號: " + inacn);
        System.out.println("    交易金額: " + amount);
        System.out.println("    交易密碼: " + pinnew);

        // N070 請求參數
        Map<String, String> n070Req = new HashMap<>();
        n070Req.put("outacn", outacn);
        n070Req.put("inbnk", inbnk);
        n070Req.put("inacn", inacn);
        n070Req.put("amount", amount);
        n070Req.put("pinnew", pinnew);

        Map<String, Object> tradeResp = new HashMap<>();
        try {
            // 呼叫模擬中心
            System.out.println(">>> [API呼叫] 發送 N070 電文: " + n070Req);
            tradeResp = restTemplate.postForObject(n070Url, n070Req, Map.class);
            
            // ★ 印出 N070 結果
            System.out.println(">>> [API回應] N070 交易結果: " + tradeResp);
        } catch (Exception e) {
            System.err.println("N070 Error: " + e.getMessage());
            tradeResp.put("message", "連線失敗: " + e.getMessage());
        }

        // 使用 FlashAttribute 將結果帶到 P3
        redirectAttributes.addFlashAttribute("txResult", tradeResp);
        
        System.out.println(">>> [P3] 導向結果頁面...");
        return "redirect:/TwdTransfer/p3"; 
    }

    @GetMapping("/p3")
    public String showP3() {
        return "TW/P3";
    }
}