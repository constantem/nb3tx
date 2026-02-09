package tw.com.fstop.nb3tx.domain;

import java.util.List;

public class N110Response {
    private String code;
    private String message;

    private String count; 
    private List<BalanceItem> accounts;

    
    private String acn;    
    private String bal;    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCount() { return count; }
    public void setCount(String count) { this.count = count; }

    public List<BalanceItem> getAccounts() { return accounts; }
    public void setAccounts(List<BalanceItem> accounts) { this.accounts = accounts; }

    public String getAcn() { return acn; }
    public void setAcn(String acn) { this.acn = acn; }

    public String getBal() { return bal; }
    public void setBal(String bal) { this.bal = bal; }


    public static class BalanceItem {
        private String acn; 
        private String bal; 

        public String getAcn() { return acn; }
        public void setAcn(String acn) { this.acn = acn; }

        public String getBal() { return bal; }
        public void setBal(String bal) { this.bal = bal; }
    }
}