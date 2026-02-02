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
public class Currency {
	
	@JsonProperty("幣別代碼")
    private String code; 
	
	@JsonProperty("幣別名稱(中文)")
    private String name;
}
