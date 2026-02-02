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
public class Reply {
	
	@JsonProperty("錯誤代碼")
	private String code;
	
	@JsonProperty("錯誤訊息")
	private String message;
}
