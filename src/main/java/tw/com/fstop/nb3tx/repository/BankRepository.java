package tw.com.fstop.nb3tx.repository;

import java.util.List;
import tw.com.fstop.nb3tx.domain.Bank;

public interface BankRepository {
	List<Bank> findAll();
}
