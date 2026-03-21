package com.fileload.api.security;

import com.fileload.model.entity.UserAccount;
import com.fileload.dao.repository.UserAccountRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserAccountRepository userRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Check if user exists, if not create new user
        UserAccount user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserAccount newUser = new UserAccount();
                    newUser.setEmail(email);
                    newUser.setUsername(name != null ? name : email);
                    newUser.setPassword(""); // OAuth2 users don't have password
                    newUser.setRole("USER");
                    return userRepository.save(newUser);
                });

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        // Redirect to frontend callback with token + user details for local session bootstrap.
        String redirectUrl = UriComponentsBuilder.fromHttpUrl("http://localhost:4200/oauth/callback")
                .queryParam("token", token)
                .queryParam("email", user.getEmail())
                .queryParam("username", user.getUsername())
                .queryParam("id", user.getId())
                .queryParam("role", user.getRole())
                .build()
                .toUriString();
        response.sendRedirect(redirectUrl);
    }
}


