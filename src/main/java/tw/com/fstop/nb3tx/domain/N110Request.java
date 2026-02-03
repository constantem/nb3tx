package tw.com.fstop.nb3tx.domain;

public class N110Request {
    private String acctNo; // 欲查詢的台幣帳號

    public N110Request() {}
    public N110Request(String acctNo) {
        this.acctNo = acctNo;
    }

    // Getter & Setter
    public String getAcctNo() { return acctNo; }
    public void setAcctNo(String acctNo) { this.acctNo = acctNo; }
}
