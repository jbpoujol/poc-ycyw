package com.example.ycywchat.controller;

import com.example.ycywchat.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Optional;
import java.util.logging.Logger;

@Controller
public class ChatController {
    private static final Logger logger = Logger.getLogger(ChatController.class.getName());

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        // Utilisation du pattern matching pour les types (Java 21)
        if (chatMessage.type() == ChatMessage.MessageType.CHAT) {
            logger.info("Message reçu de %s: %s".formatted(chatMessage.sender(), chatMessage.content()));
        }
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, 
                               SimpMessageHeaderAccessor headerAccessor) {
        // Utilisation d'Optional pour une meilleure gestion des valeurs null (Java 21)
        Optional.ofNullable(headerAccessor.getSessionAttributes())
                .ifPresentOrElse(
                    sessionAttrs -> {
                        sessionAttrs.put("username", chatMessage.sender());
                        logger.info("Utilisateur connecté: %s".formatted(chatMessage.sender()));
                    },
                    () -> logger.warning("Warning: Session attributes are null for user %s".formatted(chatMessage.sender()))
                );
        return chatMessage;
    }
}
