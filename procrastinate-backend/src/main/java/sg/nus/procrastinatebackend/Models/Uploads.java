package sg.nus.procrastinatebackend.Models;

import java.sql.ResultSet;
import java.sql.SQLException;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;

public class Uploads {

    private String uploadId;
    private String username;
    private String contentUrl;
    private String contentType;
    private String resultUrl;
    private String result;
    private String mindmapUrl;
    private String topics;

    public String getUploadId() {
        return uploadId;
    }
    public void setUploadId(String uploadId) {
        this.uploadId = uploadId;
    }
    public String getContentUrl() {
        return contentUrl;
    }
    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }
    public String getContentType() {
        return contentType;
    }
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getResultUrl() {
        return resultUrl;
    }
    public void setResultUrl(String resultUrl) {
        this.resultUrl = resultUrl;
    }
    public String getResult() {
        return result;
    }
    public void setResult(String result) {
        this.result = result;
    }
    public String getMindmapUrl() {
        return mindmapUrl;
    }
    public void setMindmapUrl(String mindmapUrl) {
        this.mindmapUrl = mindmapUrl;
    }
    public String getTopics() {
        return topics;
    }
    public void setTopics(String topics) {
        this.topics = topics;
    }

    @Override
    public String toString() {
        return "Uploads [uploadId=" + uploadId + ", username=" + username + ", contentUrl=" + contentUrl
                + ", contentType=" + contentType + ", resultUrl=" + resultUrl + ", result=" + result + ", mindmapUrl="
                + mindmapUrl + "]";
    }
    public JsonObject toJson(String jwtToken){

        JsonObjectBuilder builder = Json.createObjectBuilder()
            .add("token", jwtToken);

        if (uploadId != null) {
            builder.add("uploadId", uploadId);
        }

        if (username != null) {
            builder.add("username", username);
        }

        if (contentUrl != null) {
            builder.add("contentUrl", contentUrl);
        }

        if (contentType != null) {
            builder.add("contentType", contentType);
        }

        return builder.build();
    }

    public static Uploads create(ResultSet rs) throws SQLException{
        Uploads upload = new Uploads();
        upload.setUploadId(rs.getString("upload_id"));
        upload.setContentUrl(rs.getString("content_url"));
        upload.setUsername(rs.getString("username"));

        return upload;
    }
    
}
