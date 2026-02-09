package tw.com.fstop.nb3tx.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public class N920Request {
	@JsonProperty("CUSIDN")
    private String cusidn; // 身分證字號 (對應您提供的資料: "A123456814")

    public N920Request() {}
    public N920Request(String cusidn) {
        this.cusidn = cusidn;
    }

    public String getCusidn() { return cusidn; }
    public void setCusidn(String cusidn) { this.cusidn = cusidn; }
}