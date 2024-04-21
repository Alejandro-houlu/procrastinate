package sg.nus.procrastinatebackend.Services;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.logging.Logger;

import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import sg.nus.procrastinatebackend.Models.Uploads;
import sg.nus.procrastinatebackend.dto.JwtResponse;

@Service
public class DataProcessorService {

    Logger logger = Logger.getLogger(DataProcessorService.class.getName());
    private String apiUrl = "http://localhost:8000/api";

    @SuppressWarnings("null")
    public void sendJwtToDataprocesser(JwtResponse jwtResp){
        String url = UriComponentsBuilder.fromUriString(apiUrl)
                     .path("/authToken")
                     .toUriString();
        logger.info("Sending JWT to data processor >>>");
        logger.info(jwtResp.getToken());

        JsonObject jsonObject = Json.createObjectBuilder()
            .add("token",jwtResp.getToken())
            .add("id",jwtResp.getUsername())
            .build();

        RequestEntity<String> req = RequestEntity
            .post(url)
            .body(jsonObject.toString());
        logger.info(req.toString());

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> resp = restTemplate.exchange(req, String.class);

        // JsonObject respBodyJsonObject = createJsonObj(resp);

        logger.info("Response form data processor >>>");
        logger.info("JT token: " + resp.getBody().toString());
    }
    

    @SuppressWarnings("null")
    public Uploads processSpeechToText(Uploads upload, String jwtToken){

        String url = UriComponentsBuilder.fromUriString(apiUrl)
            .path("/speechToText")
            .toUriString();

        JsonObject uploadJson = upload.toJson(jwtToken);
        
        logger.info("From Data service >>>");
        logger.info("url to Django app: " + url);
        logger.info(uploadJson.toString());

        RequestEntity<String> req = RequestEntity
                .post(url)
                .body(uploadJson.toString());
        logger.info(req.toString());
        
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> resp = restTemplate.exchange(req, String.class);

        JsonObject respBodyJsonObject = createJsonObj(resp);

        upload.setResultUrl(respBodyJsonObject.getString("result_url"));
        upload.setResult(respBodyJsonObject.getString("result"));
        upload.setUsername(respBodyJsonObject.getString("username"));
        upload.setUploadId(respBodyJsonObject.getString("uploadId"));

        return upload;
    }

    public Uploads createSummary(Uploads upload, String jwtToken){
        String url = UriComponentsBuilder.fromUriString(apiUrl)
            .path("/createSummary")
            .toUriString();
        
        JsonObject uploadJson = upload.toJson(jwtToken);

        logger.info("From Data service (create summary)");
        logger.info("Url: " + url);

        RequestEntity<String> req = RequestEntity
                .post(url)
                .body(uploadJson.toString());
        logger.info(req.toString());
        
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> resp = restTemplate.exchange(req, String.class);

        JsonObject respBodyJsonObject = createJsonObj(resp);

        upload.setResultUrl(respBodyJsonObject.getString("result_url"));
        upload.setResult(respBodyJsonObject.getString("result"));
        upload.setUsername(respBodyJsonObject.getString("username"));
        upload.setUploadId(respBodyJsonObject.getString("uploadId"));
        
        return upload;
        
    }

    @SuppressWarnings("null")
    public Uploads createMindmap(Uploads upload, String jwtToken){
        String url = generateReqUrl("/createKnowledgeGraph");
        JsonObject uploadJson = upload.toJson(jwtToken);
        logger.info("From Data service (create mindmap )");
        logger.info("Url: " + url);
        logger.info(uploadJson.toString());
        JsonObject resp = null;

        try {
            resp = callApi(uploadJson, url);
        } catch (Exception e) {
            logger.info("DataProcessorService >>> createMindMap failed");
        }
        logger.info(upload.toString());
        upload.setMindmapUrl(resp.getString("knowledge_graph_url"));

        return upload;
    }

    public JsonObject callApi(JsonObject body, String url){

        RequestEntity<String> req = RequestEntity
                .post(url)
                .body(body.toString());
        logger.info(req.toString());
        
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> resp = restTemplate.exchange(req, String.class);

        JsonObject respBodyJsonObject = createJsonObj(resp);

        return respBodyJsonObject;
    }

    public String generateReqUrl(String path){
        String url = UriComponentsBuilder.fromUriString(apiUrl)
            .path(path)
            .toUriString();
        return url;
    }


    public JsonObject createJsonObj(ResponseEntity<String> resp) {

    JsonObject result = null;

    try(@SuppressWarnings("null")
    InputStream file = new ByteArrayInputStream(resp.getBody().getBytes())){
        JsonReader reader = Json.createReader(file);
        result = reader.readObject();
    } catch (IOException ex){
        ex.printStackTrace();
    }

    JsonObject responseBody = result;

    return responseBody;

    }

    
}
