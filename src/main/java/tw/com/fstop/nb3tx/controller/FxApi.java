package tw.com.fstop.nb3tx.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import tw.com.fstop.nb3tx.domain.N510Request;
import tw.com.fstop.nb3tx.domain.N510Response;

@RestController
@RequestMapping("/api/fx")
public class FxApi {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${remote.central.fx-n510-url}")
    private String url;

    @GetMapping("/n510")
    public N510Response N510() {
        N510Request request = new N510Request();
        request.setCusidn("A123456814"); 

        HttpEntity<N510Request> httpEntity = new HttpEntity<>(request);

        System.out.println(">>> 正在串接模擬中心: " + url);
        ResponseEntity<N510Response> response = restTemplate.exchange(
            url,                
            HttpMethod.POST,   
            httpEntity,        
            N510Response.class  
        );

        return response.getBody();
    }
}