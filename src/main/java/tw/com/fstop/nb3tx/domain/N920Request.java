package tw.com.fstop.nb3tx.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public class N920Request {
    
    // 保留 HEAD 的 Jackson 註解與註解說明
    @JsonProperty("CUSIDN")
    private String cusidn; // 身分證字號 (對應您提供的資料: "A123456814")

    // 保留 HEAD 的建構子：利於框架實例化與手動開發
    public N920Request() {}

    public N920Request(String cusidn) {
        this.cusidn = cusidn;
    }

    // 保留 Getter 與 Setter
    public String getCusidn() {
        return cusidn;
    }

    public void setCusidn(String cusidn) {
        this.cusidn = cusidn;
    }
}