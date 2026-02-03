package tw.com.fstop.nb3tx.domain;

import java.math.BigDecimal;

public class N070Request {
    private String fromAcct;     // 轉出帳號 (n920 取得)
    private String toBankCode;   // 轉入行代碼 (P1-1 輸入/n921 驗證)
    private String toAcct;       // 轉入帳號 (P1-1 輸入)
    private BigDecimal amount;   // 轉帳金額
    private String note;         // 轉帳備註
    private String transPassword; // 交易密碼 (安全驗證用)

    // Getter & Setter ...
}
