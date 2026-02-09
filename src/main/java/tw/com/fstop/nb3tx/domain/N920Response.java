package tw.com.fstop.nb3tx.domain;

import java.util.List;

public class N920Response {
    private String code;       
    private String message;   
    private String count;     
    private List<AccountData> accounts; 

    public static class AccountData {
        private String acn;    
        private String bal;    

        public String getAcn() { return acn; }
        public void setAcn(String acn) { this.acn = acn; }
        public String getBal() { return bal; }
        public void setBal(String bal) { this.bal = bal; }
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCount() { return count; }
    public void setCount(String count) { this.count = count; }

    public List<AccountData> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<AccountData> accounts) {
        this.accounts = accounts;
    }
}