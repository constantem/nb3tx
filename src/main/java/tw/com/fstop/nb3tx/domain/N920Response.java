package tw.com.fstop.nb3tx.domain;

import java.util.List;

public class N920Response {
    private String code;       // 回傳代碼 (例如 "0000")
    private String message;    // 回傳訊息 (例如 "成功")
    private String count;      // 筆數
    private List<AccountData> accounts; // 帳號列表

    // 內部類別：對應 JSON 裡的 accounts 陣列內容
    public static class AccountData {
        private String acn;    // 帳號 (例如 "050100000001")
        private String bal;    // 餘額 (例如 "10000")

        public String getAcn() { return acn; }
        public void setAcn(String acn) { this.acn = acn; }
        public String getBal() { return bal; }
        public void setBal(String bal) { this.bal = bal; }
    }

    // Getters & Setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getCount() { return count; }
    public void setCount(String count) { this.count = count; }
    public List<AccountData> getAccounts() { return accounts; }
    public void setAccounts(List<AccountData> accounts) { this.accounts = accounts; }
}