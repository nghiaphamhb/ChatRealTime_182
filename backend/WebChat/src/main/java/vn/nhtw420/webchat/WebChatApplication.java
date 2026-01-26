package vn.nhtw420.webchat;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class WebChatApplication {

    public static void main(String[] args) {
        // Load .env before Spring starts
        loadDotenvToSystemProps();

        SpringApplication.run(WebChatApplication.class, args);
    }

    private static void loadDotenvToSystemProps() {
        // Find the repo root that contains ".env"
        Path envDir = findUpwards(".env");

        Dotenv dotenv = Dotenv.configure()
                .directory(envDir.toString())   // points to folder containing .env
                .filename(".env")
                .ignoreIfMissing()
                .load();

        // Push values into JVM system properties so Spring can read them via ${KEY}
        for (DotenvEntry entry : dotenv.entries()) {
            String key = entry.getKey();
            String value = entry.getValue();

            // Do not override if already provided by real env vars / JVM props
            if (System.getProperty(key) == null) {
                System.setProperty(key, value);
            }
        }
    }

    private static Path findUpwards(String filename) {
        // Start from current working directory
        Path cur = Paths.get("").toAbsolutePath();

        // Walk upwards until we find the file or hit filesystem root
        while (cur != null) {
            Path candidate = cur.resolve(filename);
            if (Files.exists(candidate)) return cur;
            cur = cur.getParent();
        }

        // Fallback: current dir
        return Paths.get("").toAbsolutePath();
    }
}