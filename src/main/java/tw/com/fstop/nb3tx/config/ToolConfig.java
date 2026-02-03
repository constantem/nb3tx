package tw.com.fstop.nb3tx.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ToolConfig {
	
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}
