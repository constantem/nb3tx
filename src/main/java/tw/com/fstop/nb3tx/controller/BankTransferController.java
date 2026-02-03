package tw.com.fstop.nb3tx.controller;

import java.math.BigDecimal;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import tw.com.fstop.nb3tx.domain.N070Request;
import tw.com.fstop.nb3tx.domain.N070Response;
import tw.com.fstop.nb3tx.domain.N110Request;
import tw.com.fstop.nb3tx.domain.N110Response;
import tw.com.fstop.nb3tx.domain.N920Request;
import tw.com.fstop.nb3tx.domain.N920Response;
import tw.com.fstop.nb3tx.domain.N921Request;
import tw.com.fstop.nb3tx.domain.N921Response;

@Controller
@RequestMapping("/transfer")
public class BankTransferController {

    private final String BASE_URL = "http://localhost:5017/central/api/tw";
    private final RestTemplate restTemplate = new RestTemplate();

    // [第一步] 進入 P1-1 頁面
    @GetMapping("/step1")
    public String showP1_1(Model model) {
        // 呼叫 n920 取得帳號清單
        N920Response n920Res = restTemplate.postForObject(BASE_URL + "/n920", new N920Request("USER_01"), N920Response.class);
        model.addAttribute("accounts", n920Res.getData());
        return "TW/P1-1";
    }

    // [中繼邏輯] P1-1 按下下一步，處理 n110 與 n921
    @PostMapping("/validate")
    public String validateStep1(@RequestParam String fromAcct, 
                                @RequestParam String toBank, 
                                @RequestParam String toAcct,
                                @RequestParam BigDecimal amount, Model model) {
        
        // 1. 呼叫 n110 查餘額
        N110Response n110Res = restTemplate.postForObject(BASE_URL + "/n110", new N110Request(fromAcct), N110Response.class);
        
        // 2. 呼叫 n921 驗證轉入帳號
        N921Response n921Res = restTemplate.postForObject(BASE_URL + "/n921", new N921Request(toBank, toAcct), N921Response.class);

        // 3. 邏輯判斷：餘額不足
        if (n110Res.getAvailable().compareTo(amount) < 0) {
            model.addAttribute("error", "可用餘額不足，目前餘額為：" + n110Res.getAvailable());
            return "TW/P1-1"; // 回原頁面顯示錯誤
        }

        // 4. 將所有資訊封裝，帶往 P2
        model.addAttribute("fromAcct", fromAcct);
        model.addAttribute("toBank", toBank);
        model.addAttribute("toBankName", n921Res.getBankName());
        model.addAttribute("toAcct", toAcct);
        model.addAttribute("amount", amount);
        
        return "TW/P2"; 
    }

    // [最終步驟] P2 按下確定，執行 n070 轉帳
    @PostMapping("/execute")
    public String executeFinal(@ModelAttribute N070Request n070Req, Model model) {
        // 呼叫 n070 轉帳
        N070Response result = restTemplate.postForObject(BASE_URL + "/n070", n070Req, N070Response.class);
        
        model.addAttribute("txResult", result);
        return "TW/P3"; 
    }
}
