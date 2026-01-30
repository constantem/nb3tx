package tw.com.fstop.nb3tx.repository;

import java.util.List;

import tw.com.fstop.nb3tx.domain.Currency;

public interface CurrencyRepository {
	List<Currency> findAll();
}
