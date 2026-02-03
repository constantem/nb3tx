package tw.com.fstop.nb3tx.domain;

public class F007Response {
    private String code;
    private String quoteId;     
    private Double rate;
    private Double convertedAmount;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getQuoteId() { return quoteId; }
    public void setQuoteId(String quoteId) { this.quoteId = quoteId; }
    public Double getRate() { return rate; }
    public void setRate(Double rate) { this.rate = rate; }
    public Double getConvertedAmount() { return convertedAmount; }
    public void setConvertedAmount(Double convertedAmount) { this.convertedAmount = convertedAmount; }
}