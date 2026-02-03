package tw.com.fstop.nb3tx.domain;

public class N921Response {
    private String rtCode;    // 回傳代碼 (例如 0000 表示成功)
    private String rtMsg;     // 回傳訊息
    private String bankName;  // 轉入銀行名稱 (從主機查回來的)
    private String acctName;  // 轉入帳戶戶名 (視主機是否有回傳)

    // Getter & Setter
    public String getRtCode() { return rtCode; }
    public void setRtCode(String rtCode) { this.rtCode = rtCode; }
    public String getRtMsg() { return rtMsg; }
    public void setRtMsg(String rtMsg) { this.rtMsg = rtMsg; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
}