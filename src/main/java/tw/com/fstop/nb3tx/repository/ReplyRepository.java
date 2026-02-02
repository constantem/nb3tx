package tw.com.fstop.nb3tx.repository;

import java.util.List;
import tw.com.fstop.nb3tx.domain.Currency;
import tw.com.fstop.nb3tx.domain.Reply;

public interface ReplyRepository {
	List<Reply> findAll();
}
