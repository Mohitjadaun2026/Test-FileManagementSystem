package com.fileload.api.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.apache.catalina.connector.Connector;

@Configuration
public class HttpAndHttpsConfig {

    @Value("${server.port:8080}")
    private int httpsPort;

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> servletContainerCustomizer() {
        return factory -> {
            Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
            connector.setScheme("http");
            connector.setPort(8082); // HTTP port
            connector.setSecure(false);
            factory.addAdditionalTomcatConnectors(connector);
        };
    }
}
