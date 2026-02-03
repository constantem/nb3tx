package tw.com.fstop.nb3tx.domain;

public class N921Request {
    private String bankCode;  // 轉入行代碼
    private String acctNo;    // 轉入帳號

    // 建構子 (Constructor)
    public N921Request() {}
    public N921Request(String bankCode, String acctNo) {
        this.bankCode = bankCode;
        this.acctNo = acctNo;
    }

    // Getter & Setter
    public String getBankCode() { return bankCode; }
    public void setBankCode(String bankCode) { this.bankCode = bankCode; }
    public String getAcctNo() { return acctNo; }
    public void setAcctNo(String acctNo) { this.acctNo = acctNo; }
}
