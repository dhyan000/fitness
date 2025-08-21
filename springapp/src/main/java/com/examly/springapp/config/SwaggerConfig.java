package com.examly.springapp.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@Configuration
@OpenAPIDefinition(
    info=@Info(
        title="My Springboot API",
        version="1.0",
        description="API documentation for springboot api"
    )
)
public class SwaggerConfig {
    
}
