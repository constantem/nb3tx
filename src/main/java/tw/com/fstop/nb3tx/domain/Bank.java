package tw.com.fstop.nb3tx.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor  
@AllArgsConstructor
@Getter            
@Setter
public class Bank {
	
	@JsonProperty("銀行代碼")
	private String code; 
	@JsonProperty("銀行名稱")
	private String name;
	
	// --- Getters & Setters (必須要有) ---
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
