package tw.com.fstop.nb3tx.domain;

public class F007Request {
    private String cusidn;     
    private String fromAccount; 
    private String fromCurr;   
    private String toCurr;      
    private Double amount;     

    public String getCusidn() { return cusidn; }
    public void setCusidn(String cusidn) { this.cusidn = cusidn; }
    public String getFromAccount() { return fromAccount; }
    public void setFromAccount(String fromAccount) { this.fromAccount = fromAccount; }
    public String getFromCurr() { return fromCurr; }
    public void setFromCurr(String fromCurr) { this.fromCurr = fromCurr; }
    public String getToCurr() { return toCurr; }
    public void setToCurr(String toCurr) { this.toCurr = toCurr; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}