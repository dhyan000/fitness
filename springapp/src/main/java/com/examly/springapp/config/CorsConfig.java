package com.examly.springapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}

// // package com.examly.springapp.config;
// // import org.springframework.context.annotation.Bean;
// // import org.springframework.context.annotation.Configuration;
// // import org.springframework.web.servlet.config.annotation.CorsRegistry;
// // import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
// //    @Configuration
// //    public class CorsConfig {    
// //     @Bean    
// //     public WebMvcConfigurer corsConfigurer() {        
// //         return new WebMvcConfigurer() {            
// //             @Override           
// //              public void addCorsMappings(CorsRegistry registry) {               
// //                  registry.addMapping("/**")                        
// //                  .allowedOrigins("http://localhost:3000")
// //                  .allowedMethods("*")  
// //                  .allowedHeaders("*")       
// //                  .allowCredentials(true);          
// //     }        
// // };    
// // }
// // }
    

// package com.examly.springapp.config;import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;import org.springframework.web.servlet.config.annotation.CorsRegistry;import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
// @Configuration
// public class CorsConfig {    @Bean    public WebMvcConfigurer corsConfigurer() {        return new WebMvcConfigurer() {            @Override            public void addCorsMappings(CorsRegistry registry) {                registry.addMapping("/**")                    .allowedOrigins("http://localhost:8081")                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")                    .allowedHeaders("*")                    .allowCredentials(true);            }        };    }}

// package com.examly.springapp.config;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class CorsConfig {   
//      @Bean   
//       public WebMvcConfigurer corsConfigurer() {        
//         return new WebMvcConfigurer() {           
//              @Override            
//              public void addCorsMappings(CorsRegistry registry) {                
//                 registry.addMapping("/**")                    
//                 .allowedOrigins("https://8081-bdddcfcbedeefbdfabafdacd.premiumproject.examly.io")                    
//                 .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")      
//                               .allowedHeaders("*")                   
//                                .allowCredentials(true);         
//                                }      
//                               };  
//                           }
//                     }