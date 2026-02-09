package tw.com.fstop.nb3tx.domain;

public class N110Request {
    private String acn; // 欲查詢的帳號

    public N110Request() {}
    public N110Request(String acn) {
        this.acn = acn;
    }

    public String getAcn() { return acn; }
    public void setAcn(String acn) { this.acn = acn; }
}