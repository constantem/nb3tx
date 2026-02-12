package tw.com.fstop.nb3tx.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import tw.com.fstop.nb3tx.service.TwdTransferService; // 引用 Service

import java.util.Map;

@Controller
@RequestMapping("/TwdTransfer")
public class TwdTransactionController {

    @Autowired
    private TwdTransferService transferService; // ★ 只注入 Service

    @GetMapping("/init-p1")
    public String initP1(Model model) {
        // 呼叫 Service 取得所有需要的資料
        Map<String, Object> data = transferService.prepareInitData();
        
        // 將資料放入 Model
        model.addAllAttributes(data);
        
        return "TW/P1-1";
    }

    @PostMapping("/go-to-p2")
    public String goToP2(@RequestParam("fromAcct") String fromAcct, 
                         @RequestParam("toBank") String toBankCode, 
                         @RequestParam("toAcct") String toAcct,
                         @RequestParam("amount") String amount,
                         Model model) {
        
        // 呼叫 Service 查詢銀行名稱
        String bankName = transferService.findBankNameByCode(toBankCode);
        
        // 若輸入有帶名稱(如004-台銀)，Service 內部已處理，這裡只需傳回乾淨的代碼
        if (toBankCode.length() > 3 && toBankCode.contains("-")) {
            toBankCode = toBankCode.split("-")[0];
        }

        model.addAttribute("fromAcct", fromAcct);
        model.addAttribute("toBank", toBankCode);
        model.addAttribute("toBankName", bankName);
        model.addAttribute("toAcct", toAcct);
        model.addAttribute("amount", amount);

        return "TW/P2";
    }

    @PostMapping("/do-transfer")
    public String doTransfer(@RequestParam("fromAcct") String outacn,
                             @RequestParam("toBankCode") String inbnk,
                             @RequestParam("toAcct") String inacn,
                             @RequestParam("amount") String amount,
                             @RequestParam("pinnew") String pinnew,
                             Model model,
                             RedirectAttributes redirectAttributes) {

        // 呼叫 Service 執行交易
        Map<String, Object> result = transferService.executeTransfer(outacn, inbnk, inacn, amount, pinnew);

        boolean isSuccess = (boolean) result.get("isSuccess");

        if (isSuccess) {
            // 成功 -> P3
            redirectAttributes.addFlashAttribute("txResult", result);
            return "redirect:/TwdTransfer/p3";
        } else {
            // 失敗 -> ErrorPage
            model.addAttribute("errorCode", result.get("code"));
            model.addAttribute("errorMessage", result.get("errorMessage"));
            return "TW/ErrorPage";
        }
    }

    @GetMapping("/p3")
    public String showP3() {
        return "TW/P3";
    }
}