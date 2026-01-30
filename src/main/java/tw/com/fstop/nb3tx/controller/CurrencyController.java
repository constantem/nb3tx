package tw.com.fstop.nb3tx.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import tw.com.fstop.nb3tx.domain.Currency;
import tw.com.fstop.nb3tx.repository.CurrencyRepository;

@RestController
@RequestMapping("/api/currencies")
public class CurrencyController {

    @Autowired
    private CurrencyRepository repository;

    @GetMapping
    public List<Currency> list() {
        return repository.findAll();
    }
}