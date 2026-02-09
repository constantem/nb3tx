package tw.com.fstop.nb3tx.domain;

public class N110Request {
    private String cusidn; 
    private String acn;    

    public N110Request() {}
    public N110Request(String acn) {
        this.acn = acn;
    }

    public N110Request(String cusidn, String acn) {
        this.cusidn = cusidn;
        this.acn = acn;
    }

    public String getCusidn() {
        return cusidn;
    }

    public void setCusidn(String cusidn) {
        this.cusidn = cusidn;
    }

    public String getAcn() {
        return acn;
    }

    public void setAcn(String acn) {
        this.acn = acn;
    }
}