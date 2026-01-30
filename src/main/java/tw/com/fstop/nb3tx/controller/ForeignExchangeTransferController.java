package tw.com.fstop.nb3tx.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/ForeignExchangeTransfer") 
public class ForeignExchangeTransferController {

    @RequestMapping("/p1")
    public String showP1() {
        log.info("進入 P1 頁面");
        return "ForeignExchangeTransfer/P1"; 
    }

    @RequestMapping("/p2")
    public String showP2() {
        log.info("進入 P2 頁面");
        return "ForeignExchangeTransfer/P2";
    }

    @RequestMapping("/p3")
    public String showP3() {
        log.info("進入 P3 頁面");
        return "ForeignExchangeTransfer/P3";
    }

    @RequestMapping("/p4")
    public String showP4() {
        log.info("進入 P4 頁面");
        return "ForeignExchangeTransfer/P4";
    }

    @RequestMapping("/p5")
    public String showP5() {
        log.info("進入 P5 頁面");
        return "ForeignExchangeTransfer/P5";
    }
}