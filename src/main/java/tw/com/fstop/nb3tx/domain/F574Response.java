package tw.com.fstop.nb3tx.domain;

public class F574Response {
    private String code;           
    private String tradeTime;       
    private String fromAccount;   
    private Double fromAmount;    
    private String fromCurr;        
    private String toAccount;      
    private Double toAmount;       
    private String toCurr;         
    private Double rate;           
    private Double availableBalance;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getTradeTime() { return tradeTime; }
    public void setTradeTime(String tradeTime) { this.tradeTime = tradeTime; }
    public String getFromAccount() { return fromAccount; }
    public void setFromAccount(String fromAccount) { this.fromAccount = fromAccount; }
    public Double getFromAmount() { return fromAmount; }
    public void setFromAmount(Double fromAmount) { this.fromAmount = fromAmount; }
    public String getFromCurr() { return fromCurr; }
    public void setFromCurr(String fromCurr) { this.fromCurr = fromCurr; }
    public String getToAccount() { return toAccount; }
    public void setToAccount(String toAccount) { this.toAccount = toAccount; }
    public Double getToAmount() { return toAmount; }
    public void setToAmount(Double toAmount) { this.toAmount = toAmount; }
    public String getToCurr() { return toCurr; }
    public void setToCurr(String toCurr) { this.toCurr = toCurr; }
    public Double getRate() { return rate; }
    public void setRate(Double rate) { this.rate = rate; }
    public Double getAvailableBalance() { return availableBalance; }
    public void setAvailableBalance(Double availableBalance) { this.availableBalance = availableBalance; }
}