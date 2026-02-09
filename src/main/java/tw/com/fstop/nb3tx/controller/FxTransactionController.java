package tw.com.fstop.nb3tx.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.List;

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
import org.springframework.web.client.HttpClientErrorException;
import com.fasterxml.jackson.databind.ObjectMapper;

import tw.com.fstop.nb3tx.domain.*;
import tw.com.fstop.nb3tx.repository.*;

@Controller
@RequestMapping("/ForeignExchangeTransfer")
public class FxTransactionController {

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
    
    public static class AccountOption {
        private String value;
        private String text;

        public AccountOption(String value, String text) {
            this.value = value;
            this.text = text;
        }

        public String getValue() { return value; }
        public String getText() { return text; }
    }
    
    private String maskLast4Digits(String account) {
        // 防呆：如果帳號是空的，或是長度不到4碼，就直接回傳原本的，以免報錯
        if (account == null || account.length() <= 4) {
            return account;
        }

        String prefix = account.substring(0, account.length() - 4);
        return prefix + "****";
    }
    
    private String formatAmount(Double amount, String curr) {
        if (amount == null) return "0";     
        if ("TWD".equals(curr)) {
            java.text.DecimalFormat df = new java.text.DecimalFormat("#,###");
            return df.format(amount);
        } else {
            java.text.DecimalFormat df = new java.text.DecimalFormat("#,##0.00");
            return df.format(amount);
        }
    }

 // 1. 進入 P2 (同時呼叫 N920 查台幣 + N510 查外幣 + 準備餘額 JSON)
    @RequestMapping("/init-p2")
    public String initP2(Model model) {
        System.out.println(">>> 進入 P2，準備查詢帳號...");

        List<AccountOption> options = new ArrayList<>();
        
        Map<String, Map<String, Double>> fxBalanceMap = new HashMap<>();

        try {
            System.out.println(">>> 呼叫 N920 (台幣帳號)...");
            N920Request req920 = new N920Request();
            req920.setCusidn("A123456814"); 

            N920Response resp920 = restTemplate.postForObject(n920Url, req920, N920Response.class);
            
            if (resp920 != null && resp920.getAccounts() != null) {
                for (N920Response.AccountItem acct : resp920.getAccounts()) {
                    options.add(new AccountOption(acct.getAcn(), acct.getAcn() + " (台幣)"));
                }
                System.out.println(">>> N920 查詢成功，加入 " + resp920.getAccounts().size() + " 筆");
            }
        } catch (Exception e) {
            System.out.println(">>> N920 查詢失敗: " + e.getMessage());
        }

        try {
            System.out.println(">>> 呼叫 N510 (外幣帳號)...");
            N510Request req510 = new N510Request();
            req510.setCusidn("A123456814"); 

            N510Response resp510 = restTemplate.postForObject(n510Url, req510, N510Response.class);
            
            if (resp510 != null && "0000".equals(resp510.getCode()) && resp510.getAccountList() != null) {
                for (N510Response.AccountInfo acct : resp510.getAccountList()) {
                    options.add(new AccountOption(acct.getAccountNumber(), acct.getAccountNumber() + " (外幣)"));
                    
                    Map<String, Double> balances = new HashMap<>();
                    
                    if (acct.getBalances() != null) {
                        for (N510Response.BalanceInfo b : acct.getBalances()) {
                            balances.put(b.getCurrency(), b.getBalance());
                        }
                    }
                    
                    fxBalanceMap.put(acct.getAccountNumber(), balances);
                }
                System.out.println(">>> N510 查詢成功，加入 " + resp510.getAccountList().size() + " 筆");
            }
        } catch (Exception e) {
            System.out.println(">>> N510 失敗: " + e.getMessage());
            e.printStackTrace();
        }

        model.addAttribute("accountList", options);
        model.addAttribute("transactionForm", new TransactionForm());
        
        try {
            String json = new ObjectMapper().writeValueAsString(fxBalanceMap);
            model.addAttribute("fxBalancesJson", json); 
            System.out.println(">>> 外幣餘額 JSON: " + json);
        } catch (Exception e) {
            System.out.println(">>> JSON 轉換失敗");
            model.addAttribute("fxBalancesJson", "{}");
        }
        
        // 查詢幣別 
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
        String errorCode = "E999";
        
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
            
            // 3. 檢查詢價結果 (先判斷非空，再取 code)
            if (quoteResp != null) {
                String code = quoteResp.getCode();
                if ("0000".equals(code)) {
                    form.setQuoteId(quoteResp.getQuoteId());
                    form.setRate(quoteResp.getRate());
                    
                    String fmtFromAmount = formatAmount(form.getAmount(), form.getFromCurr());
                    String fmtToAmount = formatAmount(quoteResp.getConvertedAmount(), form.getToCurr());
                    String rawQuoteId = quoteResp.getQuoteId();
                    String maskedQuoteId = rawQuoteId;
                    
                    model.addAttribute("displayFromAmount", fmtFromAmount);
                    model.addAttribute("displayToAmount", fmtToAmount);
                    model.addAttribute("maskedQuoteId", maskLast4Digits(quoteResp.getQuoteId()));
                    model.addAttribute("targetAmount", quoteResp.getConvertedAmount());
                    System.out.println(">>> 詢價成功，單號: " + form.getQuoteId());
                    model.addAttribute("form", form);
                    return "ForeignExchangeTransfer/P3";

                } else {
                    errorCode = code;
                    System.out.println(">>> 詢價失敗，API代碼: " + code);
                }
            } else {
            	System.out.println(">>> 錯誤：API 回傳 null");
            	errorCode = "E999";
            }

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.out.println(">>> 捕捉到 API 錯誤回應: " + e.getStatusCode());
            
            try {
                String responseBody = e.getResponseBodyAsString();
                System.out.println("    內容: " + responseBody);

                ObjectMapper mapper = new ObjectMapper(); 
                F007Response errorResp = mapper.readValue(responseBody, F007Response.class);
                
                if (errorResp != null && errorResp.getCode() != null) {
                    errorCode = errorResp.getCode();
                    System.out.println("    成功解析出錯誤代碼: " + errorCode);
                }
            } catch (Exception parseEx) {
                System.out.println("    解析錯誤訊息失敗，維持 E999");
            }

        } catch (Exception e) {
            System.out.println(">>> F007 詢價例外: " + e.getMessage());
            e.printStackTrace();
        }

        String errorMsg = replyRepository.findMessageByCode(errorCode);
        
        if (errorMsg == null || errorMsg.isEmpty()) {
            errorMsg = "交易失敗 (代碼: " + errorCode + ")"; 
        }

        model.addAttribute("errorCode", errorCode);
        model.addAttribute("errorMessage", errorMsg);
        return "ForeignExchangeTransfer/Error";
    }
    
    // 階段二：接收 P3 確認 -> 顯示 P4 (輸入密碼頁)

    @RequestMapping("/step4-auth")
    public String step4Auth(TransactionForm form, Model model) {
        System.out.println(">>> [Step 2] 進入 P4 驗證階段...");
        System.out.println("    單號: " + form.getQuoteId());
        
        String maskedFrom = maskLast4Digits(form.getFromAccount());
        String maskedTo = maskLast4Digits(form.getToAccount());
        String maskedQuote = maskLast4Digits(form.getQuoteId());
        
        model.addAttribute("displayFromAmount", formatAmount(form.getAmount(), form.getFromCurr()));
        model.addAttribute("maskedFromAccount", maskedFrom);
        model.addAttribute("maskedToAccount", maskedTo);
        model.addAttribute("maskedQuoteId", maskedQuote);
        model.addAttribute("form", form);       
        return "ForeignExchangeTransfer/P4";
    }

  //按下 P4「確定」後的動作 (實際交易)
    @RequestMapping("/do-confirm")
    public String doConfirm(TransactionForm form, RedirectAttributes redirectAttributes, Model model) {
        System.out.println(">>> [櫃員] 收到 P3 確認後的資料，準備執行交易...");
        
        String errorCode = "E999"; 
        
        try {
            F574Request tradeReq = new F574Request();
            tradeReq.setQuoteId(form.getQuoteId()); 
            tradeReq.setFromAccount(form.getFromAccount());
            tradeReq.setToAccount(form.getToAccount());   
            tradeReq.setPinnew(form.getPassword()); 

            System.out.println(">>> [Step 2] 呼叫 F574...");
            
            // 呼叫 API
            F574Response tradeResp = restTemplate.postForObject(f574Url, tradeReq, F574Response.class);
            
            // 處理回應 
            if (tradeResp != null) {
                String code = tradeResp.getCode();
                System.out.println(">>> [Step 2] 交易完成！結果代碼: " + code);

                if ("0000".equals(code)) {
                	tradeResp.setFromAccount(maskLast4Digits(form.getFromAccount())); 
                    tradeResp.setToAccount(maskLast4Digits(form.getToAccount()));
                    redirectAttributes.addFlashAttribute("result", tradeResp);
                    return "redirect:/ForeignExchangeTransfer/p5"; 
                } else {
                    errorCode = code;
                }
            }

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.out.println(">>> 交易 API 錯誤: " + e.getStatusCode());
            try {
                String responseBody = e.getResponseBodyAsString();
                System.out.println("    內容: " + responseBody);

                ObjectMapper mapper = new ObjectMapper(); 
                F574Response errorResp = mapper.readValue(responseBody, F574Response.class);
                
                if (errorResp != null && errorResp.getCode() != null) {
                    errorCode = errorResp.getCode();
                    System.out.println("    成功解析出錯誤代碼: " + errorCode);
                }
            } catch (Exception parseEx) {
                System.out.println("    解析 JSON 失敗，使用預設代碼");
            }

        } catch (Exception e) {
            System.out.println(">>> 交易例外: " + e.getMessage());
        }

        String errorMsg = replyRepository.findMessageByCode(errorCode);
        
        if (errorMsg == null || errorMsg.isEmpty()) {
            errorMsg = "交易失敗 (代碼: " + errorCode + ")";
        }

        model.addAttribute("errorCode", errorCode);
        model.addAttribute("errorMessage", errorMsg);
        return "ForeignExchangeTransfer/Error";
    }

    //顯示 P5 畫面
    @GetMapping("/p5")
    public String showP5(Model model) {
        return "ForeignExchangeTransfer/P5";
    }
}