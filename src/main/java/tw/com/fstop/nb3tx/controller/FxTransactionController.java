package tw.com.fstop.nb3tx.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import tw.com.fstop.nb3tx.domain.N510Request;
import tw.com.fstop.nb3tx.domain.N510Response;
import tw.com.fstop.nb3tx.domain.F007Request;
import tw.com.fstop.nb3tx.domain.F007Response;
import tw.com.fstop.nb3tx.domain.F574Request;
import tw.com.fstop.nb3tx.domain.F574Response;

@Controller
@RequestMapping("/ForeignExchangeTransfer")
public class FxTransactionController {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${remote.central.fx-n510-url}")
    private String n510Url;

    @Value("${remote.central.fx-f007-url}")
    private String f007Url;

    @Value("${remote.central.fx-f574-url}")
    private String f574Url;

    //功能：呼叫 N510 查詢帳號，把結果帶給 P2 下拉選單
    @GetMapping("/init-p2")
    public String initP2(Model model) {
        System.out.println(">>>進入 P2，呼叫 N510 查詢帳號...");

        N510Request request = new N510Request();
        request.setCusidn("A123456814"); 

        N510Response response = new N510Response();
        try {
            response = restTemplate.postForObject(n510Url, request, N510Response.class);
            System.out.println(">>> N510 成功，取得帳號數: " + 
                (response.getAccountList() != null ? response.getAccountList().size() : 0));
        } catch (Exception e) {
            System.out.println(">>> N510 失敗: " + e.getMessage());
        }

        model.addAttribute("accountData", response);
        return "ForeignExchangeTransfer/P2"; 
    }


    //按下 P4「確定」後的動作
    //功能：先呼叫 F007 (詢價) 拿單號，再呼叫 F574 (交易) 扣款，最後轉址到 P5
    @GetMapping("/do-confirm")
    public String doConfirm(RedirectAttributes redirectAttributes) {
        System.out.println(">>> [櫃員] 開始執行正規交易流程...");

        // Step1：呼叫 F007 取得議價單號 (QuoteID)
        System.out.println(">>> [Step 1] 正在詢價 (F007)...");
        
        String freshQuoteId = ""; 
        Double freshRate = 0.0;   

        try {
            F007Request quoteReq = new F007Request();
            quoteReq.setCusidn("A123456814");
            quoteReq.setFromAccount("050100000001"); 
            quoteReq.setFromCurr("TWD");
            quoteReq.setToCurr("USD");
            quoteReq.setAmount(10.0); 

            F007Response quoteResp = restTemplate.postForObject(f007Url, quoteReq, F007Response.class);
            
            freshQuoteId = quoteResp.getQuoteId();
            freshRate = quoteResp.getRate();
            System.out.println(">>> [Step 1] 詢價成功！拿到單號: " + freshQuoteId + ", 匯率: " + freshRate);

        } catch (Exception e) {
            System.out.println(">>> [Step 1] F007 詢價失敗: " + e.getMessage());
        }

        // Step2：呼叫 F574 執行交易 (使用剛剛的單號)
        System.out.println(">>> [Step 2] 正在執行交易 (F574)...");

        F574Response tradeResp = new F574Response();
        try {
            F574Request tradeReq = new F574Request();
            
            tradeReq.setQuoteId(freshQuoteId); 
            tradeReq.setFromAccount("050100000001"); 
            tradeReq.setToAccount("010111912224");   
            tradeReq.setPinnew("147258");            

            tradeResp = restTemplate.postForObject(f574Url, tradeReq, F574Response.class);
            System.out.println(">>> [Step 2] 交易完成！結果代碼: " + tradeResp.getCode());

        } catch (Exception e) {
            System.out.println(">>> [Step 2] F574 交易失敗: " + e.getMessage());
            tradeResp.setCode("E999");
            tradeResp.setTradeTime("連線失敗");
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