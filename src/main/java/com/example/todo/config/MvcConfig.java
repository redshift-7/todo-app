package com.example.todo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableWebMvc
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    public static final String STATIC_RESOURCES_LOCATION = "frontend/build/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("frontend/build/static/");
        registry.addResourceHandler("/*.js")
                .addResourceLocations(STATIC_RESOURCES_LOCATION);
        registry.addResourceHandler("/*.json")
                .addResourceLocations(STATIC_RESOURCES_LOCATION);
        registry.addResourceHandler("/*.ico")
                .addResourceLocations(STATIC_RESOURCES_LOCATION);
        registry.addResourceHandler("/index.html")
                .addResourceLocations("frontend/index.html");
    }
}
