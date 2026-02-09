package tw.com.fstop.nb3tx.controller;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/client")
public class CentralClientApi {

    @Autowired
    private RestTemplate restTemplate;

    // 引入環境變數
    @Value("${remote.api.central-url}")
    private String baseUrl;

    @GetMapping("/sync-n921")
    public ResponseEntity<Object> syncByGet() { // 改回傳 ResponseEntity<Object>
        
        String url = baseUrl + "n921"; 

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 準備 JSON Body
        String jsonBody = "{\"cusidn\":\"A123456814\"}";
        HttpEntity<String> requestEntity = new HttpEntity<>(jsonBody, headers);

        // 關鍵修改：將 String.class 改為 Object.class
        ResponseEntity<Object> response = restTemplate.exchange(
            url,
            HttpMethod.POST, 
            requestEntity,
            Object.class  // 這樣 Spring 會自動解析成 JSON 格式，不會有轉義字元
        );

        // 直接回傳整個 ResponseEntity，保留原始的 Status Code 和 Body
        return response;
    }
}
