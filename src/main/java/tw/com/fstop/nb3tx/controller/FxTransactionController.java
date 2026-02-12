package tw.com.fstop.nb3tx.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.databind.ObjectMapper;

import tw.com.fstop.nb3tx.domain.*;
import tw.com.fstop.nb3tx.service.FxTransactionService;
import tw.com.fstop.nb3tx.service.FxTransactionService.FxAccountData; 

@Controller
@RequestMapping("/ForeignExchangeTransfer")
public class FxTransactionController {

    @Autowired
    private FxTransactionService fxService;

    // 準備頁面基礎資料 (帳號、餘額、幣別)
    private void prepareP2CommonData(Model model) {
        String userId = "A123456814"; 

        model.addAttribute("accountList", fxService.getAllAccounts(userId));

        FxAccountData fxData = fxService.callN510(userId);
        model.addAttribute("fxBalancesJson", fxService.convertBalanceMapToJson(fxData.getBalanceMap()));

        model.addAttribute("currencyList", fxService.getCurrencyMap());
    }

    // 進入初始頁面 (P2)
    @RequestMapping("/init-p2")
    public String initP2(Model model) {
        prepareP2CommonData(model);
        model.addAttribute("transactionForm", new TransactionForm());
        return "ForeignExchangeTransfer/P2";
    }
    
    // 返回上一步 (重繪 P2)
    @RequestMapping("/back-p2")
    public String backp2(TransactionForm form, Model model) {
        prepareP2CommonData(model);
        model.addAttribute("transactionForm", form);
        return "ForeignExchangeTransfer/P2";
    }

    // AJAX 查詢台幣餘額 (N110)
    @ResponseBody 
    @RequestMapping("/query-balance")
    public String queryBalance(@RequestParam("acctNo") String acctNo) {
        return fxService.callN110("A123456814", acctNo);
    }    
    
    // 取得匯率與確認 (F007)
    @RequestMapping("/step3-confirm")
    public String step3Confirm(TransactionForm form, Model model) {
        String errorCode = "E999";
        
        try {
            F007Response quoteResp = fxService.callF007(form, "A123456814");
            
            if (quoteResp != null && "0000".equals(quoteResp.getCode())) {
                form.setQuoteId(quoteResp.getQuoteId());
                form.setRate(quoteResp.getRate());
                
                model.addAttribute("displayFromAmount", fxService.formatAmount(form.getAmount(), form.getFromCurr()));
                model.addAttribute("displayToAmount", fxService.formatAmount(quoteResp.getConvertedAmount(), form.getToCurr()));
                
                model.addAttribute("displayRate", String.format("%.2f", quoteResp.getRate()));
                
                model.addAttribute("maskedQuoteId", fxService.maskLast4Digits(quoteResp.getQuoteId()));
                model.addAttribute("targetAmount", quoteResp.getConvertedAmount());
                
                model.addAttribute("form", form);
                return "ForeignExchangeTransfer/P3";
            } else {
                errorCode = (quoteResp != null) ? quoteResp.getCode() : "E999";
            }

        } catch (HttpClientErrorException e) {
        	errorCode = fxService.parseApiErrorCode(e);
        }
        catch (Exception e) { 
            e.printStackTrace();
            errorCode = "E999";
        }

        model.addAttribute("errorCode", errorCode);
        model.addAttribute("errorMessage", fxService.getErrorMessage(errorCode));
        return "ForeignExchangeTransfer/Error";
    }

    // 顯示再次確認頁 (輸入密碼)
    @RequestMapping("/step4-auth")
    public String step4Auth(TransactionForm form, Model model) {
        model.addAttribute("displayFromAmount", fxService.formatAmount(form.getAmount(), form.getFromCurr()));
        model.addAttribute("maskedFromAccount", fxService.maskLast4Digits(form.getFromAccount()));
        model.addAttribute("maskedToAccount", fxService.maskLast4Digits(form.getToAccount()));
        model.addAttribute("maskedQuoteId", fxService.maskLast4Digits(form.getQuoteId()));
        
        model.addAttribute("displayRate", String.format("%.2f", form.getRate()));
        
        model.addAttribute("form", form);       
        return "ForeignExchangeTransfer/P4";
    }

    // 執行交易 (F574)
    @RequestMapping("/do-confirm")
    public String doConfirm(TransactionForm form, RedirectAttributes redirectAttributes, Model model) {
        String errorCode = "E999"; 
        
        try {
            F574Response tradeResp = fxService.callF574(form);

            if (tradeResp != null && "0000".equals(tradeResp.getCode())) {
                redirectAttributes.addFlashAttribute("maskedFromAccount", fxService.maskLast4Digits(form.getFromAccount()));
                redirectAttributes.addFlashAttribute("maskedToAccount", fxService.maskLast4Digits(form.getToAccount()));
                redirectAttributes.addFlashAttribute("fromCurr", form.getFromCurr());
                redirectAttributes.addFlashAttribute("toCurr", form.getToCurr());
                
                redirectAttributes.addFlashAttribute("displayFromAmount", fxService.formatAmount(form.getAmount(), form.getFromCurr()));
                
                if (tradeResp.getToAmount() != null) {
                    redirectAttributes.addFlashAttribute("displayToAmount", fxService.formatAmount(tradeResp.getToAmount(), form.getToCurr()));
                }
                
                if (tradeResp.getAvailableBalance() != null) {
                    redirectAttributes.addFlashAttribute("displayAvailableBalance", fxService.formatAmount(tradeResp.getAvailableBalance(), form.getFromCurr()));
                }
                
                redirectAttributes.addFlashAttribute("result", tradeResp);
                if (tradeResp.getRate() != null) {
                     redirectAttributes.addFlashAttribute("displayRate", String.format("%.2f", tradeResp.getRate()));
                }

                return "redirect:/ForeignExchangeTransfer/p5";
            } else {
                errorCode = (tradeResp != null) ? tradeResp.getCode() : "E999";
            }

        } catch (HttpClientErrorException e) {
        	errorCode = fxService.parseApiErrorCode(e);
        }
        catch (Exception e) { 
            e.printStackTrace();
            errorCode = "E999";
        }

        model.addAttribute("errorCode", errorCode);
        model.addAttribute("errorMessage", fxService.getErrorMessage(errorCode));
        return "ForeignExchangeTransfer/Error";
    }

    // 顯示結果頁
    @GetMapping("/p5")
    public String showP5(Model model) {
        return "ForeignExchangeTransfer/P5";
    }
}