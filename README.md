# 🦖 Workout Tracker

Workout Tracker est une application web permettant de **créer, suivre et consulter ses séances de musculation**.

Le projet a été développé dans le cadre de ma formation de développeur web, avec l'objectif de mettre en pratique le développement **front-end et back-end**, la gestion des données, l'authentification et la conception d'une API.

---

## 🚀 Fonctionnalités

### 👤 Authentification

- Inscription
- Connexion
- Déconnexion
- Protection des routes privées
- Gestion de session avec JWT
- Accès au profil utilisateur

### 🏋️ Gestion des séances

- Création d'une séance à partir d'un programme
- Suivi d'une séance en cours
- Gestion des exercices
- Enregistrement des séries
- Gestion des répétitions et des charges
- Validation des exercices
- Passage automatique à l'exercice suivant
- Annulation d'une séance
- Finalisation automatique d'une séance

### 📊 Suivi des performances

- Récupération des performances précédentes
- Préremplissage des répétitions et charges
- Conservation des séries réalisées
- Historique des séances

### 📱 Interface

- Interface responsive
- Navigation desktop
- Menu burger sur mobile
- Profil utilisateur
- Interface adaptée au suivi d'une séance depuis un écran mobile

---

## 🛠️ Technologies utilisées

### Front-end

- Vue.js
- JavaScript
- HTML
- CSS
- Vue Router
- Font Awesome

### Back-end

- Strapi
- Node.js
- API REST

### Base de données

- PostgreSQL

### Outils

- Git
- GitHub
- Postman
- VS Code

---

## 🏗️ Architecture du projet

Le projet est organisé autour d'une architecture séparant le **front-end** et le **back-end**.

```text
Workout Tracker
│
├── Front-end
│   └── Vue.js
│
└── Back-end
    ├── Strapi
    └── PostgreSQL
```

Le modèle de données principal suit cette logique :

```text
User
 ↓
Program
 ↓
WorkoutTemplate
 ↓
ProgramExercise
 ↓
Workout
 ↓
WorkoutExercise
 ↓
Set
```

---

## 🔐 Authentification

L'application utilise l'authentification de Strapi avec des **JWT**.

Les routes nécessitant une authentification sont protégées côté front-end.

Le token utilisateur est également utilisé pour authentifier les requêtes envoyées à l'API.

---

## 🔄 Fonctionnement d'une séance

Le fonctionnement général d'une séance est le suivant :

```text
Choisir une séance
       ↓
Créer la séance
       ↓
Charger les exercices
       ↓
Réaliser une série
       ↓
Enregistrer la série
       ↓
Passer à l'exercice suivant
       ↓
Terminer le dernier exercice
       ↓
Terminer la séance
```

Une séance possède différents états :

```text
in_progress
completed
cancelled
```

---

## 📚 Modèle de données

Les principales relations sont organisées de la manière suivante :

```text
User
 │
 └── Program
      │
      └── WorkoutTemplate
           │
           └── ProgramExercise
                │
                └── Workout
                     │
                     └── WorkoutExercise
                          │
                          └── Set
```

Les exercices peuvent également être associés à différents muscles avec un rôle :

- `PRIMARY`
- `SECONDARY`

---

## 🎯 Objectifs du projet

Ce projet me permet de travailler notamment sur :

- la conception d'une application full-stack ;
- la création et la consommation d'une API REST ;
- la gestion d'une base de données relationnelle ;
- l'authentification utilisateur ;
- la gestion des routes protégées ;
- la gestion d'état avec Vue.js ;
- la conception d'une interface responsive ;
- la gestion des erreurs ;
- la validation des données ;
- la séparation front-end / back-end ;
- la conception d'un modèle de données cohérent.

---

## 🔮 Évolutions prévues

Plusieurs fonctionnalités sont encore prévues pour faire évoluer l'application :

- Modification du mot de passe
- Amélioration de l'historique des séances
- Affichage des objectifs prévus pour chaque séance
- Gestion des séries supplémentaires
- Amélioration du suivi des performances
- Améliorations UI/UX
- Tests plus complets de l'application

---

## 📌 Statut du projet

🚧 **Projet en cours de développement**

Le cœur de l'application est fonctionnel et plusieurs parcours utilisateur ont déjà été validés.

De nouvelles fonctionnalités et améliorations sont progressivement ajoutées.

---

## 👨‍💻 Auteur

**Maxime Kassam**

Développeur Web et Web Mobile en formation.

🔗 Portfolio :
https://kassam-maxime-portfolio.netlify.app

🔗 GitHub :
https://github.com/maximekassam-ui
