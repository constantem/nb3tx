package tw.com.fstop.nb3tx.domain;

import java.util.List;

public class N920Response {
    private String code;
    private String message;
    private String count;
    
    private List<AccountItem> accounts; 

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCount() { return count; }
    public void setCount(String count) { this.count = count; }

    // ★ Getter/Setter 也要改成單層
    public List<AccountItem> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<AccountItem> accounts) {
        this.accounts = accounts;
    }

    public static class AccountItem {
        private String acn;

        public String getAcn() { return acn; }
        public void setAcn(String acn) { this.acn = acn; }
    }
}