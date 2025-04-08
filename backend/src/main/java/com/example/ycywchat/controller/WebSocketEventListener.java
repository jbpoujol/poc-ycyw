package com.example.ycywchat.controller;

import com.example.ycywchat.model.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Optional;

@Component
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    public WebSocketEventListener(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        log.info("Nouvelle connexion WebSocket établie");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        
        // Utilisation d'Optional pour une meilleure gestion des valeurs null (Java 21)
        Optional.ofNullable(headerAccessor.getSessionAttributes())
            .flatMap(sessionAttrs -> Optional.ofNullable((String) sessionAttrs.get("username")))
            .ifPresent(username -> {
                log.info("Utilisateur déconnecté : {}", username);
                
                // Création d'un message avec le constructeur compact (Java 21)
                ChatMessage chatMessage = new ChatMessage(username, null, ChatMessage.MessageType.LEAVE);
                
                messagingTemplate.convertAndSend("/topic/public", chatMessage);
            });
    }
}
