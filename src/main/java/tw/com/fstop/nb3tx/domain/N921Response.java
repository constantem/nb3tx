package tw.com.fstop.nb3tx.domain;

public class N921Response {
    private String code;
    private String message;
    private String bankName; // 回傳銀行名稱 (例如 "臺灣銀行")
    
    // 如果 API 有回傳戶名，可加上 private String acnName;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
}