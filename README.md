# Projet de Semaine - Application de Réservation de Films avec NestJS et ReactJS

## Description

## Ce projet consiste en la création d'une API backend avec NestJS pour gérer l'authentification des utilisateurs, la consultation de films via l'API TMDB, ainsi que la gestion des réservations. Un frontend est également développé avec ReactJS et TailwindCSS pour permettre aux utilisateurs de se connecter, consulter les films, et effectuer des réservations.

## Prérequis

- Node.js
- NestJS
- ReactJS
- TailwindCSS
- MongoDB (ou toute autre base de données compatible avec Mongoose)
- API TMDB pour l'accès aux films

## Installation

### Backend (NestJS)

1. Clone le repository :
   ```bash
   git clone <https://github.com/DiagM/MoviieBooker.git>
   cd <nestjs-movie>
   ```
2. Installe les dépendances :

```bash
   npm install
```

3. Configure les variables d'environnement:

renommer .env.exemple en .env et mettre ses propres variables.

4. Lancer l'API :

```bash
   npm run start
```

### Frontend (ReactJS)

1. Clone le repository :
   git clone <https://github.com/DiagM/MoviieBooker.git>
   cd <movie-booking-app>

2. Installe les dépendances :

```bash
   npm install
```

3. Lancer le serveur de développement :

```bash
   npm start
```

### Fonctionnalités:

Authentification : Inscription et connexion avec JWT pour sécuriser les routes.

Gestion des films : Consultation des films via l'API TMDB avec filtrage et pagination.

Réservations : Réserver un créneau pour un film, vérifier la disponibilité (créneaux non chevauchants), annuler une réservation.

Swagger : Documentation des API pour faciliter les tests et l'intégration.

### Tests

pour lancer les test en backend:

```bash
npx jest reservation
```

### Déploiement

### Conclusion

Ce projet offre une gestion complète des réservations de films, incluant la sécurisation des routes avec JWT et une interface utilisateur claire et moderne avec ReactJS et TailwindCSS. Grâce à la documentation Swagger, les utilisateurs et développeurs peuvent interagir facilement avec l'API.
