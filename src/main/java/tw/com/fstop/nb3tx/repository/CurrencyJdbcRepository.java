package tw.com.fstop.nb3tx.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;
import tw.com.fstop.nb3tx.domain.Currency;

@Slf4j
@Repository
public class CurrencyJdbcRepository implements CurrencyRepository {

    @Autowired
    private DataSource dataSource;

    @Override
    public List<Currency> findAll() {
        String sql = "SELECT code, name FROM currency";
        List<Currency> list = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Currency currency = new Currency();
                currency.setCode(rs.getString("code"));
                currency.setName(rs.getString("name"));
                list.add(currency);
            }
            return list;

        } catch (Exception e) {
            log.error("findAll failed", e);
            throw new RuntimeException(e);
        }
    }
}