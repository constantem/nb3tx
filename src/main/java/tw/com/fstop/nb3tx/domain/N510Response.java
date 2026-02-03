package tw.com.fstop.nb3tx.domain;
import java.util.List;

public class N510Response {
    private String code;
    private List<AccountInfo> accountList; 

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public List<AccountInfo> getAccountList() { return accountList; }
    public void setAccountList(List<AccountInfo> accountList) { this.accountList = accountList; }

    public static class AccountInfo {
        private String accountNumber;
        private List<BalanceInfo> balances;

        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
        public List<BalanceInfo> getBalances() { return balances; }
        public void setBalances(List<BalanceInfo> balances) { this.balances = balances; }
    }

    public static class BalanceInfo {
        private String currency;
        private Double balance;

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public Double getBalance() { return balance; }
        public void setBalance(Double balance) { this.balance = balance; }
    }
}