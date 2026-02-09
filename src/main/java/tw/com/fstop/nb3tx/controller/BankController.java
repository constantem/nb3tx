package tw.com.fstop.nb3tx.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import tw.com.fstop.nb3tx.domain.Bank;
import tw.com.fstop.nb3tx.repository.BankRepository;


@RestController
@RequestMapping("/api/banks")
public class BankController {
	@Autowired
    private BankRepository repository;

    @GetMapping
    public List<Bank> list() {
        return repository.findAll();
    }
}
