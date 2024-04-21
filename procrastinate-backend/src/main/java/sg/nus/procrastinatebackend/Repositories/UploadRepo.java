package sg.nus.procrastinatebackend.Repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import sg.nus.procrastinatebackend.Models.Uploads;
import static sg.nus.procrastinatebackend.Repositories.Queries.*;

import java.sql.ResultSet;
import java.util.Optional;

@Repository
public class UploadRepo {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public Boolean insertUpload(Uploads upload){

        try{
            jdbcTemplate.update(SQL_INSERT_UPLOAD, upload.getUploadId(), upload.getContentUrl(), upload.getContentType(),upload.getUsername());
        } catch (Exception ex){
            return false;
        }
        
        return true;
    }

    public Optional<Uploads> getUploadRecord(String uploadId){

        return jdbcTemplate.query(SQL_GET_UPLOAD_BY_ID,
            (ResultSet rs) -> {
                if(!rs.next())
                return Optional.empty();
                    return Optional.of(Uploads.create(rs));
            },uploadId);
    }
    
}
