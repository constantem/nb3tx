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
import tw.com.fstop.nb3tx.domain.Reply;

@Slf4j
@Repository
public class ReplyJdbcRepository implements ReplyRepository {

    @Autowired
    private DataSource dataSource;

    @Override
    public List<Reply> findAll() {
        String sql = "SELECT code, message FROM reply";
        List<Reply> list = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Reply reply = new Reply();
                reply.setCode(rs.getString("code"));
                reply.setMessage(rs.getString("message"));
                list.add(reply);
            }
            return list;

        } catch (Exception e) {
            log.error("findAll failed", e);
            throw new RuntimeException(e);
        }
    }
    
    @Override
    public String findMessageByCode(String code) {
        String sql = "SELECT message FROM reply WHERE code = ?";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, code);
            
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("message"); 
                }
            }
        } catch (Exception e) {
            log.error("findMessageByCode failed: " + code, e);
        }
        
        return "未知錯誤代碼"; 
    }

}
