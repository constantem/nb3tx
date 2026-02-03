package tw.com.fstop.nb3tx.domain;

import java.util.List;

public class N920Response {
    private String rtCode;          // 回傳代碼 (例如: 0000)
    private String rtMsg;           // 回傳訊息
    private List<AccountData> data; // 帳號資料清單

    // Getter & Setter ...

    public static class AccountData {
        private String acctNo;      // 帳號
        private String acctType;    // 帳號類別 (如: 活期存款)
        private String alias;       // 帳號別名 (自定義名稱)
        private String currency;    // 幣別 (TWD)

        // Getter & Setter ...
    }
}