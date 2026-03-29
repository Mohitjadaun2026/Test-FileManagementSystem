package com.fileload.api.controller;

import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;
import com.fileload.api.security.JwtUtil;
import com.fileload.dao.repository.UserAccountRepository;
import com.fileload.model.dto.*;
import com.fileload.model.entity.UserAccount;
import com.fileload.service.PasswordResetService;
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
    private final PasswordResetService passwordResetService;

    public AuthController(UserAccountRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          PasswordResetService passwordResetService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordResetService = passwordResetService;
    }

    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    @Operation(summary = "Register user")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        logger.info("Register API called for email: {} and username: {}", request.getEmail(), request.getUsername());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        UserAccount user = new UserAccount();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(toAuthResponse(user, token));
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {

        String login = request.getLogin().trim();

        UserAccount user = userRepository.findByEmailOrUsername(login, login)
                .orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(login, request.getPassword())
            );
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(toAuthResponse(user, token));
    }

    // ---------------- FORGOT PASSWORD ----------------
    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset")
    public ResponseEntity<ResetPasswordResponseDTO> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request) {

        try {
            passwordResetService.requestPasswordReset(request.getEmail());

            return ResponseEntity.ok(
                    new ResetPasswordResponseDTO(true, "Password reset link sent to your email")
            );

        } catch (Exception e) {
            return ResponseEntity.ok(
                    new ResetPasswordResponseDTO(true,
                            "If an account exists, a reset link has been sent")
            );
        }
    }

    // ---------------- VALIDATE TOKEN ----------------
    @GetMapping("/validate-reset-token/{token}")
    public ResponseEntity<ResetPasswordResponseDTO> validateResetToken(@PathVariable String token) {

        boolean isValid = passwordResetService.validateResetToken(token);

        if (isValid) {
            return ResponseEntity.ok(new ResetPasswordResponseDTO(true, "Valid token"));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResetPasswordResponseDTO(false, "Invalid or expired token"));
    }

    // ---------------- RESET PASSWORD ----------------
    @PostMapping("/reset-password")
    public ResponseEntity<ResetPasswordResponseDTO> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO request) {

        try {
            passwordResetService.resetPassword(
                    request.getToken(),
                    request.getNewPassword()
            );

            return ResponseEntity.ok(
                    new ResetPasswordResponseDTO(true, "Password reset successful")
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResetPasswordResponseDTO(false, e.getMessage()));
        }
    }

    // ---------------- GOOGLE LOGIN ----------------
    @GetMapping("/oauth2/google")
    public void googleOauthLogin(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }

    // ---------------- PROFILE UPLOAD ----------------
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

    // ---------------- HELPER ----------------
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