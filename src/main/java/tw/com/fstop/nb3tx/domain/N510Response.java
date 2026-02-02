package tw.com.fstop.nb3tx.domain;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAlias;

public class N510Response {
    private String code;

    @JsonAlias("accounts") 
    @JsonProperty("accountList")
    private List<Account> accountList;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public List<Account> getAccountList() { return accountList; }
    public void setAccountList(List<Account> accountList) { this.accountList = accountList; }

    public static class Account {

        @JsonAlias("acn")
        @JsonProperty("accountNumber")
        private String accountNumber; 
        
        private List<Balance> balances;

        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
        
        public List<Balance> getBalances() { return balances; }
        public void setBalances(List<Balance> balances) { this.balances = balances; }
    }

    public static class Balance {
        private String currency;
        private Double balance;

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public Double getBalance() { return balance; }
        public void setBalance(Double balance) { this.balance = balance; }
    }
}