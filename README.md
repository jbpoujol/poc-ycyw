# PoC de Chat Temps Réel (YCYW)

Ce projet est une preuve de concept (PoC) d'une application de chat en temps réel utilisant WebSocket. L'application est composée de deux services principaux :

- **Backend** : Serveur Spring Boot avec WebSocket STOMP utilisant Java 21 (port 8080)
- **Frontend** : Client web avec interface utilisateur simple (port 4200)

**Note importante** : Ce PoC est uniquement destiné à des fins de démonstration et ne comprend pas d'authentification réelle ni de persistance des données (pas de base de données).

## Prérequis

- Docker
- Docker Compose

## Structure du projet

```
poc-ycyw/
├── backend/                  # Code du serveur Spring Boot
│   ├── src/                  # Code source Java
│   ├── pom.xml               # Configuration Maven
│   └── Dockerfile            # Configuration Docker pour le backend
├── frontend/                 # Code du client web
│   ├── src/                  # Code source HTML/JS/CSS
│   ├── nginx/                # Configuration Nginx
│   └── Dockerfile            # Configuration Docker pour le frontend
├── docker-compose.yml        # Configuration Docker Compose
└── README.md                 # Ce fichier
```

## Comment utiliser

### 1. Construction des images Docker

Vous pouvez construire les images Docker pour le frontend et le backend en exécutant :

```bash
# Construction de l'image du backend
docker build -t ycyw-backend ./backend

# Construction de l'image du frontend
docker build -t ycyw-frontend ./frontend
```

### 2. Lancement avec Docker Compose

Pour lancer l'application complète, utilisez Docker Compose :

```bash
docker-compose up
```

Pour lancer l'application en arrière-plan :

```bash
docker-compose up -d
```

Pour reconstruire les images et lancer l'application :

```bash
docker-compose up --build
```

### 3. Accès à l'application

Une fois l'application lancée, vous pouvez y accéder via votre navigateur :

- Frontend : [http://localhost:4200](http://localhost:4200)
- Backend (API WebSocket) : ws://localhost:8080/ws-chat

### 4. Test du chat en temps réel

Pour tester le chat en temps réel :

1. Ouvrez [http://localhost:4200](http://localhost:4200) dans un navigateur
2. Entrez un nom d'utilisateur (par exemple "Alice") et cliquez sur "Rejoindre"
3. Ouvrez un autre onglet ou un autre navigateur et accédez à [http://localhost:4200](http://localhost:4200)
4. Entrez un nom d'utilisateur différent (par exemple "Bob") et cliquez sur "Rejoindre"
5. Envoyez des messages depuis chaque session et observez leur apparition en temps réel dans les deux fenêtres
6. Vous pouvez également observer les notifications lorsqu'un utilisateur rejoint ou quitte le chat

## Fonctionnalités

- Connexion avec un nom d'utilisateur
- Envoi et réception de messages en temps réel
- Notifications de connexion/déconnexion des utilisateurs
- Interface utilisateur simple et intuitive

## Architecture technique

- **Backend** : Spring Boot 3.2.3 avec WebSocket STOMP et Java 21
- **Frontend** : HTML/CSS/JavaScript avec client STOMP
- **Communication** : WebSocket pour la communication en temps réel
- **Conteneurisation** : Docker et Docker Compose

## Fonctionnalités Java 21

Le backend utilise plusieurs fonctionnalités de Java 21 pour améliorer les performances et la qualité du code :

- **Records** : Utilisation des records Java pour le modèle de données (ChatMessage)
- **Virtual Threads** : Configuration de Spring Boot pour utiliser les threads virtuels de Java 21
- **Pattern Matching** : Utilisation du pattern matching pour les types dans les contrôleurs
- **Formatted String Templates** : Utilisation de la méthode `formatted()` pour les chaînes de caractères
- **Enhanced Optional API** : Utilisation des méthodes avancées d'Optional pour une meilleure gestion des valeurs null

## Arrêt de l'application

Pour arrêter l'application, utilisez :

```bash
docker-compose down
```

## Limitations

Ce PoC présente plusieurs limitations, car il s'agit uniquement d'une démonstration :

- Pas d'authentification réelle des utilisateurs
- Pas de persistance des messages (les messages sont perdus lors du redémarrage)
- Pas de chiffrement des communications
- Pas de gestion des salons de discussion multiples
- Pas de fonctionnalités avancées (messages privés, partage de fichiers, etc.)
