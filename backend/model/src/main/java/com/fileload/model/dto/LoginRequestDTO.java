package com.fileload.model.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(

<<<<<<< HEAD
        @NotBlank
        @Email
        String email,

        @NotBlank
        String password
=======
    @NotBlank
    @JsonAlias("email")
    private String login;

    @NotBlank
    private String password;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
>>>>>>> 168b6e0aa8198bbad5e958147e68c8960be354a5

) {}