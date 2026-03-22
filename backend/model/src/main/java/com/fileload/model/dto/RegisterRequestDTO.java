package com.fileload.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(

        @NotBlank
        @Size(min = 2, max = 100)
        String username,

<<<<<<< HEAD
        @NotBlank
        @Email
        String email,
=======
    @NotBlank
    @Email
    @Pattern(
            regexp = "(?i)^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.com$",
            message = "must be a valid .com email address"
    )
    private String email;
>>>>>>> 168b6e0aa8198bbad5e958147e68c8960be354a5

        @NotBlank
        @Size(min = 6, max = 255)
        String password

) {}