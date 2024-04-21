package sg.nus.procrastinatebackend.Controllers;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import sg.nus.procrastinatebackend.Models.Uploads;
import sg.nus.procrastinatebackend.Services.DataProcessorService;
import sg.nus.procrastinatebackend.Services.UploadService;
import sg.nus.procrastinatebackend.Services.s3UploadService;

@RestController
@RequestMapping("/api")

public class ProcrastinateController {

    @Autowired
    s3UploadService s3UploadSvc;

    @Autowired
    UploadService uploadSvc;

    @Autowired
    DataProcessorService dataSvc;

    Logger logger = Logger.getLogger(ProcrastinateController.class.getName());

    @PostMapping("/speechToText")
    @PreAuthorize("hasRole('USER') or hasRole('PREMIUM') or hasRole('ADMIN')")
    public ResponseEntity<String>speechToText(
            @RequestPart String username,
            @RequestPart String email,
            @RequestPart MultipartFile audioFile,
            @RequestHeader("Authorization") String jwtToken){

        logger.log(Level.INFO, "From procrastinate controller (speech to text api) >>>");
        logger.log(Level.INFO, "Username > " + username);
        logger.log(Level.INFO, "Email > " + email);
        logger.info(jwtToken);

        Uploads upload = s3UploadSvc.uploadToS3(username, audioFile);
        uploadSvc.saveUpload(upload);

        jwtToken = jwtToken.substring(7);

        upload = dataSvc.processSpeechToText(upload, jwtToken);

        logger.info("RESULT TIME >>>>>>>>>>>>");
        logger.info(upload.getResult());

        JsonObject jsonObject = Json.createObjectBuilder()
                .add("result",upload.getResult())
                .add("result_url",upload.getResultUrl())
                .add("username",upload.getUsername())
                .add("uploadId", upload.getUploadId())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(jsonObject.toString());

    }

    @PostMapping("/createSummary")
    @PreAuthorize("hasRole('USER') or hasRole('PREMIUM') or hasRole('ADMIN')")
    public ResponseEntity<String>createSummary(
            @RequestPart String username,
            @RequestPart(required = false) MultipartFile file, 
            @RequestPart(required = false) String file_url,
            @RequestPart String email,
            @RequestPart(required = false) String uploadId,
            @RequestHeader("Authorization") String jwtToken){

        logger.log(Level.INFO, "From procrastinate controller (Summary api) >>>");
        jwtToken = jwtToken.substring(7);

        Uploads upload = new Uploads();
        upload.setUsername(username);

        if(file_url != null){
            logger.info("Create summary came with file url");
            upload.setContentUrl(file_url);
            upload.setUploadId(uploadId);
        }
        else{
            logger.info("Create summary came with a text file");
            upload = s3UploadSvc.uploadToS3(username, file);
            uploadSvc.saveUpload(upload);
        }

 
        upload = dataSvc.createSummary(upload, jwtToken);
        logger.info("Result from /createSummary >>>>>");
        logger.info(upload.getResult());

        JsonObject jsonObject = Json.createObjectBuilder()
                .add("result",upload.getResult())
                .add("result_url",upload.getResultUrl())
                .add("username",upload.getUsername())
                .add("uploadId", upload.getUploadId())
                .build();
        
        logger.info("End of create Summary");

        return ResponseEntity.status(HttpStatus.OK).body(jsonObject.toString());

    }

    @PostMapping("/createMindmap")
    @PreAuthorize("hasRole('USER') or hasRole('PREMIUM') or hasRole('ADMIN')")
    public ResponseEntity<String>createMindMap(
        @RequestPart (required = false) MultipartFile textFile,
        @RequestPart (required = false) String uploadId,
        @RequestPart String username,
        @RequestHeader("Authorization") String jwtToken){

        logger.info("Start of create mindmap >>>");
        jwtToken = jwtToken.substring(7);

        Uploads upload = new Uploads();

        if(textFile != null){
            logger.info("User performed straight from upload to mindmap");
            upload = s3UploadSvc.uploadToS3(username, textFile);
            uploadSvc.saveUpload(upload); 
        }
        else if (uploadId != null){
            logger.info("User performs create mindmap after an upload");
            upload = uploadSvc.getUploadbyId(uploadId);
        }
        else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file or uploadId received");
        }

        logger.info(upload.toString());

        try {
            upload = dataSvc.createMindmap(upload, jwtToken);
            logger.info("Result from create mindmap >>>>");
            logger.info(upload.getMindmapUrl());
        } catch (Exception e) {
            logger.info("Data processor failed at createMindmap");
        }
        logger.info(upload.toString());

        JsonObject jsonObject = Json.createObjectBuilder()
                .add("result_url",upload.getMindmapUrl())
                .add("username",upload.getUsername())
                .add("uploadId", upload.getUploadId())
                .build();
        
        logger.info("End of create mindmap");

        return ResponseEntity.status(HttpStatus.OK).body(jsonObject.toString());

    }
}
