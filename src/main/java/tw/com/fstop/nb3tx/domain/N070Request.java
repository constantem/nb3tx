package tw.com.fstop.nb3tx.domain;

import java.math.BigDecimal;

public class N070Request {
    private String fromAcct;   // 轉出帳號 (對應 Controller 的變數)
    private String toBankCode; // 轉入行代碼
    private String toAcct;     // 轉入帳號
    private BigDecimal amount; // 轉帳金額 (建議使用 BigDecimal 處理金額)
    private String note;       // 備註 (選填)

    public String getFromAcct() { return fromAcct; }
    public void setFromAcct(String fromAcct) { this.fromAcct = fromAcct; }
    public String getToBankCode() { return toBankCode; }
    public void setToBankCode(String toBankCode) { this.toBankCode = toBankCode; }
    public String getToAcct() { return toAcct; }
    public void setToAcct(String toAcct) { this.toAcct = toAcct; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}