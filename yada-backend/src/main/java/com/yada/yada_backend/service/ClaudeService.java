package com.yada.yada_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;

@Service
public class ClaudeService {

    @Value("${claude.api.key}")
    private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public ClaudeService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.anthropic.com")
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader("Content-Type", "application/json")
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public String generateReflection(String answersJson, String moodLabel) {
        String systemPrompt = """
                You speak like a close friend who genuinely listens.
                You never use clinical words like 'validate' or 'process'.
                You never start sentences with 'It sounds like' or 'I hear that'.
                You keep it short and real, 5 to 7 sentences maximum.
                You acknowledge what is hard before anything else.
                You must give them advice some postivie reinforcement and encoragement
                Do not use dashes in your response.
                First empathise, then try to gently help using simple CBT techniques like reframing or noticing thought patterns.
                If that does not fit, just continue to be present with them.
                Never take the generic AI approach.
                Use phrases like: I hear you, I understand you, it is normal to feel like that, you are not alone even if it feels like it.
                Do not use religious or biblical language.
                """;

        String userPrompt = String.format(
            "The user's check-in answers: %s\nTheir overall mood: %s\nWrite a reflection for them.",
            answersJson, moodLabel
        );

        return callClaude(systemPrompt, userPrompt);
    }

    private String callClaude(String systemPrompt, String userPrompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                "model", "claude-sonnet-4-6",
                "max_tokens", 300,
                "system", systemPrompt,
                "messages", List.of(Map.of("role", "user", "content", userPrompt))
            );

            String response = webClient.post()
                    .uri("/v1/messages")
                    .header("x-api-key", apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            Map responseMap = objectMapper.readValue(response, Map.class);
            List content = (List) responseMap.get("content");
            Map firstContent = (Map) content.get(0);
            return (String) firstContent.get("text");

        } catch (Exception e) {
            e.printStackTrace();
            return "Something went wrong: " + e.getMessage();
        }
    }
}