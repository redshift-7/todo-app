package com.example.todo.payload.response;


import java.util.List;


public record JwtResponse(String accessToken, String type, Long id, String username, String email, List<String> roles) {
    public JwtResponse {
        type = "Bearer";
    }
}
