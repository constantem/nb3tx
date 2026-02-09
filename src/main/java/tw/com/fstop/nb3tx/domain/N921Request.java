package tw.com.fstop.nb3tx.domain;

public class N921Request {
    private String bankCode; // 轉入行代碼 (例如 "004")
    private String acn;      // 轉入帳號

    public N921Request() {}
    public N921Request(String bankCode, String acn) {
        this.bankCode = bankCode;
        this.acn = acn;
    }

    public String getBankCode() { return bankCode; }
    public void setBankCode(String bankCode) { this.bankCode = bankCode; }
    public String getAcn() { return acn; }
    public void setAcn(String acn) { this.acn = acn; }
}