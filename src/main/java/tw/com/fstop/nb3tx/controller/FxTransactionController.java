package tw.com.fstop.nb3tx.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import tw.com.fstop.nb3tx.domain.*;

@Controller
@RequestMapping("/ForeignExchangeTransfer")
public class FxTransactionController {

    @Autowired
    private RestTemplate restTemplate;

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

 // 1. 進入 P2 (呼叫 N920 查帳號)
    @RequestMapping("/init-p2")
    public String initP2(Model model) {
        System.out.println(">>> 進入 P2，呼叫 N920...");

        try {
            N920Request req = new N920Request();
            req.setCusidn("A123456814"); 

            N920Response resp = restTemplate.postForObject(n920Url, req, N920Response.class);
            
            if (resp != null && resp.getAccounts() != null && !resp.getAccounts().isEmpty()) {
                model.addAttribute("accountList", resp.getAccounts());
                System.out.println(">>> N920 查詢成功");
            }

        } catch (Exception e) {
            System.out.println(">>> N920 查詢失敗: " + e.getMessage());
            e.printStackTrace(); 
        }

        model.addAttribute("transactionForm", new TransactionForm());
        
        Map<String, String> currencyMap = new LinkedHashMap<>();
        currencyMap.put("TWD", "TWD 新臺幣");
        currencyMap.put("USD", "USD 美金");
        currencyMap.put("CAD", "CAD 加拿大幣");
        currencyMap.put("HKD", "HKD 港幣");
        currencyMap.put("GBP", "GBP 英鎊");
        currencyMap.put("JPY", "JPY 日圓");
        
        model.addAttribute("currencyList", currencyMap);
        
        return "ForeignExchangeTransfer/P2";
    }

    // 2. AJAX 查餘額 (呼叫 N110)
    @ResponseBody 
    @RequestMapping("/query-balance")
    public String queryBalance(@RequestParam("acctNo") String acctNo) {
        System.out.println(">>> 收到查餘額請求，帳號：" + acctNo);
        
        try {
            N110Request req = new N110Request();
            req.setCusidn("A123456814"); 
            req.setAcn(acctNo);

            N110Response resp = restTemplate.postForObject(n110Url, req, N110Response.class);
            
            if (resp != null && resp.getAccounts() != null && !resp.getAccounts().isEmpty()) {
                String balance = resp.getAccounts().get(0).getBal();
                System.out.println(">>> N110 查詢成功，餘額：" + balance);
                return balance;
            }
        } catch (Exception e) {
            System.out.println(">>> N110 查詢失敗: " + e.getMessage());
        }
        
        return "查詢失敗";
    }    
    
    //階段一：接收 P2 資料 -> 呼叫 F007 詢價 -> 顯示 P3 確認頁
    @RequestMapping("/step3-confirm")
    public String step3Confirm(TransactionForm form, Model model) {
        System.out.println(">>> [Step 1] 進入 P3 確認階段...");
        System.out.println("    使用者選擇轉出: " + form.getFromAccount() + " (" + form.getFromCurr() + ")");
        System.out.println("    使用者選擇轉入: " + form.getToAccount() + " (" + form.getToCurr() + ")");

        try {
            // 1. 準備 F007 請求
            F007Request quoteReq = new F007Request();
            quoteReq.setCusidn("A123456814");
            
            // 從 form 拿資料
            quoteReq.setFromAccount(form.getFromAccount());
            quoteReq.setFromCurr(form.getFromCurr()); 
            quoteReq.setToCurr(form.getToCurr());    
            quoteReq.setAmount(form.getAmount());

            // 2. 呼叫 F007
            F007Response quoteResp = restTemplate.postForObject(f007Url, quoteReq, F007Response.class);
            
            // 3. 把詢價結果 (匯率、單號) 塞回 form，準備傳給下一頁
            form.setQuoteId(quoteResp.getQuoteId());
            form.setRate(quoteResp.getRate());
            
            System.out.println(">>> 詢價成功，匯率: " + form.getRate());

        } catch (Exception e) {
            System.out.println(">>> F007 詢價失敗: " + e.getMessage());
        }

        // 4. 把填滿資料的 form 傳給 P3.jsp 顯示
        model.addAttribute("form", form);
        
        return "ForeignExchangeTransfer/P3"; 
    }
    
    // 階段二：接收 P3 確認 -> 顯示 P4 (輸入密碼頁)

    @RequestMapping("/step4-auth")
    public String step4Auth(TransactionForm form, Model model) {
        System.out.println(">>> [Step 2] 進入 P4 驗證階段...");
        System.out.println("    單號: " + form.getQuoteId());
        
        // 把資料原封不動傳給 P4 顯示
        model.addAttribute("form", form);
        
        return "ForeignExchangeTransfer/P4";
    }


  //按下 P4「確定」後的動作 (實際交易)
    @RequestMapping("/do-confirm")
    public String doConfirm(TransactionForm form, RedirectAttributes redirectAttributes) {
        System.out.println(">>> [櫃員] 收到 P3 確認後的資料，準備執行交易...");
        
        // 拿 form 裡面的 quoteId (單號)
        String quoteId = form.getQuoteId();
        System.out.println("    使用單號: " + quoteId);

        F574Response tradeResp = new F574Response();
        
        // 只有拿到單號才做交易
        if (quoteId != null && !quoteId.isEmpty()) {
            try {
                F574Request tradeReq = new F574Request();
                
                // 1. 設定單號
                tradeReq.setQuoteId(quoteId); 
                
                // 2. 設定帳號 (從 form 拿)
                tradeReq.setFromAccount(form.getFromAccount());
                tradeReq.setToAccount(form.getToAccount());   
                
                // 3. 密碼 
                tradeReq.setPinnew(form.getPassword()); 

                // 4. 呼叫 F574 交易
                System.out.println(">>> [Step 2] 呼叫 F574...");
                tradeResp = restTemplate.postForObject(f574Url, tradeReq, F574Response.class);
                
                if (tradeResp != null) {
                    tradeResp.setFromAccount(form.getFromAccount()); 
                    tradeResp.setToAccount(form.getToAccount());
                    tradeResp.setRate(form.getRate());
                    
                }
                System.out.println(">>> [Step 2] 交易完成！結果代碼: " + tradeResp.getCode());

            } catch (Exception e) {
                System.out.println(">>> [Step 2] F574 交易失敗: " + e.getMessage());
                tradeResp.setCode("E999");
            }
        } else {
             System.out.println(">>> 錯誤：沒有收到單號！");
             tradeResp.setCode("E002");
        }

        // Step3：轉址 (Redirect)
        redirectAttributes.addFlashAttribute("result", tradeResp);
        
        return "redirect:/ForeignExchangeTransfer/p5"; 
    }

    //顯示 P5 畫面
    @GetMapping("/p5")
    public String showP5(Model model) {
        return "ForeignExchangeTransfer/P5";
    }
}