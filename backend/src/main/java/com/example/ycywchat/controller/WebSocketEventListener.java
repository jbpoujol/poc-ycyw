package com.example.ycywchat.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

@Component
@Slf4j
public class WebSocketEventListener {

    public WebSocketEventListener() {
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        log.info("Nouvelle connexion WebSocket établie");
    }
    
    // Nous ne gérons plus les événements de déconnexion automatiquement
    // Les déconnexions seront gérées explicitement par le client via le ChatController
}
