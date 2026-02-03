package tw.com.fstop.nb3tx.domain;

public class F574Request {
    private String quoteId;     
    private String fromAccount; 
    private String toAccount;   
    private String pinnew;      
    

    public String getQuoteId() { return quoteId; }
    public void setQuoteId(String quoteId) { this.quoteId = quoteId; }
    public String getFromAccount() { return fromAccount; }
    public void setFromAccount(String fromAccount) { this.fromAccount = fromAccount; }
    public String getToAccount() { return toAccount; }
    public void setToAccount(String toAccount) { this.toAccount = toAccount; }
    public String getPinnew() { return pinnew; }
    public void setPinnew(String pinnew) { this.pinnew = pinnew; }
}