package tw.com.fstop.nb3tx.domain;

public class N070Response {
    private String rtCode;      // 回傳代碼 (0000:成功)
    private String rtMsg;       // 回傳訊息
    private String txId;        // 交易序號 (供 P3 查詢用)
    private String txTime;      // 交易時間
    private String hostCode;    // 主機回應碼

    // Getter & Setter ...
}