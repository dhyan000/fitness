package com.examly.springapp.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {      
    @Override      
    public void addCorsMappings(CorsRegistry registry) {            
        registry.addMapping("/**") // Allow all endpoints
                // Add the URL where your React app is running locally            
                .allowedOrigins("http://localhost:8081", "https://8081-bdddcfcbedeefbdfabafdacd.premiumproject.examly.io")      
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")                     
                .allowedHeaders("*")                     
                .allowCredentials(true);      
    }
}