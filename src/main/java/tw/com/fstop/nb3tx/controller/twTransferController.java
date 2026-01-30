package tw.com.fstop.nb3tx.controller;

import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/transfer")
public class twTransferController {
	@RequestMapping("/P1-1")
    public String showP1() {
        log.info("進入P1頁");
        return "TW/P1-1"; 
    }
	
	@RequestMapping("/P2")
    public String showP2() {
        log.info("進入P2頁");
        return "TW/P2"; 
    }
	
	@RequestMapping("/P3")
    public String showP3() {
        log.info("進入P3頁");
        return "TW/P3"; 
    }
}
