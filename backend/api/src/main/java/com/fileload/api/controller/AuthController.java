package com.fileload.api.controller;

import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;
import com.fileload.api.security.JwtUtil;
import com.fileload.dao.repository.UserAccountRepository;
import com.fileload.model.dto.AuthResponseDTO;
import com.fileload.model.dto.LoginRequestDTO;
import com.fileload.model.dto.RegisterRequestDTO;
import com.fileload.model.entity.UserAccount;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserAccountRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserAccountRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    @Operation(summary = "Register user")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        logger.info("Register API called for email: {} and username: {}", request.getEmail(), request.getUsername());
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed: Email already exists - {}", request.getEmail());
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            logger.warn("Registration failed: Username already exists - {}", request.getUsername());
            throw new IllegalArgumentException("Username already exists");
        }

        UserAccount user = new UserAccount();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user = userRepository.save(user);

        logger.info("User registered successfully: {}", user.getEmail());

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(toAuthResponse(user, token));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        logger.info("Login API called for login: {}", request.getLogin());
        String login = request.getLogin().trim();
        UserAccount user = userRepository.findByEmailOrUsername(login, login)
                .orElse(null);
        if (user == null) {
            logger.warn("Login failed: user not found for login: {}", login);
            // Do not reveal if user exists
            throw new IllegalArgumentException("Invalid credentials");
        }
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (user.getAccountLockedUntil() != null && user.getAccountLockedUntil().isAfter(now)) {
            long minutesLeft = java.time.Duration.between(now, user.getAccountLockedUntil()).toMinutes();
            logger.warn("Account locked for user: {} until {}", login, user.getAccountLockedUntil());
            throw new IllegalArgumentException("Account locked due to too many failed login attempts. Try again in " + minutesLeft + " minute(s).");
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(login, request.getPassword())
            );
        } catch (org.springframework.security.core.AuthenticationException ex) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);
            if (attempts >= 5) {
                user.setAccountLockedUntil(now.plusMinutes(30));
                logger.warn("User {} locked out until {} after {} failed attempts", login, user.getAccountLockedUntil(), attempts);
            }
            userRepository.save(user);
            throw new IllegalArgumentException(attempts >= 5 ?
                "Account locked due to too many failed login attempts. Try again in 30 minutes." :
                "Invalid credentials. " + (5 - attempts) + " attempt(s) left before lockout.");
        }
        // Successful login: reset attempts and lockout
        user.setFailedLoginAttempts(0);
        user.setAccountLockedUntil(null);
        userRepository.save(user);
        logger.info("User login successful: {}", user.getEmail());
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(toAuthResponse(user, token));
    }

    @GetMapping("/oauth2/google")
    @Operation(summary = "Start Google OAuth2 login")
    public void googleOauthLogin(HttpServletResponse response) throws IOException {
        logger.info("Google OAuth2 login initiated");
        response.sendRedirect("/oauth2/authorization/google");
    }

    @PostMapping("/upload-profile")
    public ResponseEntity<java.util.Map<String, String>> uploadProfile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId
    ) throws Exception {

        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        java.nio.file.Path path = java.nio.file.Paths.get("uploads/" + filename);
        java.nio.file.Files.createDirectories(path.getParent());
        java.nio.file.Files.write(path, file.getBytes());

        user.setProfileImage("/uploads/" + filename);
        userRepository.save(user);

        return ResponseEntity.ok(java.util.Map.of("profileImage", user.getProfileImage()));
    }

    @GetMapping("/profile")
    public ResponseEntity<AuthResponseDTO> getProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        UserAccount user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(toAuthResponse(user, token));
    }

    private AuthResponseDTO toAuthResponse(UserAccount user, String token) {
        AuthResponseDTO dto = new AuthResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setToken(token);
        dto.setProfileImage(user.getProfileImage());
        return dto;
    }
}

