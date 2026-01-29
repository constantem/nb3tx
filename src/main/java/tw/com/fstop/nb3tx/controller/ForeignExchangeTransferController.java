package tw.com.fstop.nb3tx.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/ForeignExchangeTransfer") // 定義基礎路徑
public class ForeignExchangeTransferController {

    // 顯示 P1.jsp
    @RequestMapping("/p1")
    public String showP1() {
        log.info("進入 P1 頁面");
        return "ForeignExchangeTransfer/P1"; // 對應到 /WEB-INF/jsp/ForeignExchangeTransfer/P1.jsp
    }

    // 顯示 P2.jsp
    @RequestMapping("/p2")
    public String showP2() {
        log.info("進入 P2 頁面");
        return "ForeignExchangeTransfer/P2";
    }

    // 顯示 P3.jsp
    @RequestMapping("/p3")
    public String showP3() {
        log.info("進入 P3 頁面");
        return "ForeignExchangeTransfer/P3";
    }

    // 顯示 P4.jsp
    @RequestMapping("/p4")
    public String showP4() {
        log.info("進入 P4 頁面");
        return "ForeignExchangeTransfer/P4";
    }

    // 顯示 P5.jsp
    @RequestMapping("/p5")
    public String showP5() {
        log.info("進入 P5 頁面");
        return "ForeignExchangeTransfer/P5";
    }
}