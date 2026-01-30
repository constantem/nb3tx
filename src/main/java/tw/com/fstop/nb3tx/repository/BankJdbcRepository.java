package tw.com.fstop.nb3tx.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import tw.com.fstop.nb3tx.domain.Bank;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Repository
public class BankJdbcRepository implements BankRepository {

	@Autowired
    private DataSource dataSource;

    @Override
    public List<Bank> findAll() {
        String sql = "SELECT bank_code, bank_name FROM bank";
        List<Bank> list = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Bank bank = new Bank();
                bank.setCode(rs.getLong("code"));
                bank.setName(rs.getString("name"));
                list.add(bank);
            }
            return list;

        } catch (Exception e) {
            log.error("findAll failed", e);
            throw new RuntimeException(e);
        }
    }
}
