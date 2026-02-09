package tw.com.fstop.nb3tx.domain;

public class N110Response {
    private String code;
    private String message;
    private String acn;    // 帳號
    private String bal;    // 餘額 (注意：部分 API 可能回傳 BigDecimal，此處依 N920 格式設為 String)

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getAcn() { return acn; }
    public void setAcn(String acn) { this.acn = acn; }
    public String getBal() { return bal; }
    public void setBal(String bal) { this.bal = bal; }
}