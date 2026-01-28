package vn.nhtw420.webchat.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "supabase")
public class SupabaseConfig {
    private String url;
    private String key;
    private String bucketName;
}
