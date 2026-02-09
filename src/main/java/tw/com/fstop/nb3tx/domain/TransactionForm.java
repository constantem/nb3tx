package tw.com.fstop.nb3tx.domain;

public class TransactionForm {
    private String fromAccount; 
    private String toAccount;   
    private Double amount;      
    private String fromCurr;
    private String toCurr;
    
    private String quoteId; 
    private Double rate;   
    private String password; 

    public String getFromAccount() { return fromAccount; }
    public void setFromAccount(String fromAccount) { this.fromAccount = fromAccount; }

    public String getToAccount() { return toAccount; }
    public void setToAccount(String toAccount) { this.toAccount = toAccount; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }


    public String getFromCurr() { return fromCurr; }
    public void setFromCurr(String fromCurr) { this.fromCurr = fromCurr; }

    public String getToCurr() { return toCurr; }
    public void setToCurr(String toCurr) { this.toCurr = toCurr; }

    public String getQuoteId() { return quoteId; }
    public void setQuoteId(String quoteId) { this.quoteId = quoteId; }

    public Double getRate() { return rate; }
    public void setRate(Double rate) { this.rate = rate; }
}