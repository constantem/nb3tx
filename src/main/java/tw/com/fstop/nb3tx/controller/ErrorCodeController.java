package tw.com.fstop.nb3tx.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tw.com.fstop.nb3tx.domain.ErrorCode;
import tw.com.fstop.nb3tx.repository.ErrorCodeRepository;

@RestController
@RequestMapping("/api/errors")
public class ErrorCodeController {

	@Autowired
	private ErrorCodeRepository repository;
	
    @GetMapping
    public List<ErrorCode> list() {
        return repository.findAll();
    }    
}
