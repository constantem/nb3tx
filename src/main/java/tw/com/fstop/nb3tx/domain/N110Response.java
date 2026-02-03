package tw.com.fstop.nb3tx.domain;

import java.math.BigDecimal;

public class N110Response {
    private String rtCode;        // 回傳代碼 (0000:成功)
    private String rtMsg;         // 回傳訊息
    private String acctNo;        // 帳號
    private BigDecimal balance;    // 帳面餘額
    private BigDecimal available;  // 可用餘額
    private String currency;      // 幣別 (TWD)

    // Getter & Setter ...
}