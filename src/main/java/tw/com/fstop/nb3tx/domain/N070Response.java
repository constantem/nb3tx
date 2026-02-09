package tw.com.fstop.nb3tx.domain;

public class N070Response {
    private String code;       // "0000" 代表成功
    private String message;
    private String txId;       // 交易序號 (P3 顯示用)
    private String tradeTime;  // 交易時間

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getTxId() { return txId; }
    public void setTxId(String txId) { this.txId = txId; }
    public String getTradeTime() { return tradeTime; }
    public void setTradeTime(String tradeTime) { this.tradeTime = tradeTime; }
}