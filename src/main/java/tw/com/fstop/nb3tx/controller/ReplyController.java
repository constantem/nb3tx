package tw.com.fstop.nb3tx.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tw.com.fstop.nb3tx.domain.Reply;
import tw.com.fstop.nb3tx.repository.ReplyRepository;

@RestController
@RequestMapping("/api/replies")
public class ReplyController {

	@Autowired
	private ReplyRepository repository;
	
    @GetMapping
    public List<Reply> list() {
        return repository.findAll();
    }    
}
