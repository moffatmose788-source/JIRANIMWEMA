# BOMAENGWE WELFARE — Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → name it `bomaengwe-welfare`
3. Enable Google Analytics (optional)

## 2. Enable Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider

## 3. Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Production mode** (we'll set rules below)
3. Select a region closest to your users (e.g., `europe-west1` for East Africa)

## 4. Configure the App

In the app, go to **Settings → Firebase** tab and paste your Firebase config:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 5. Firestore Security Rules

Copy these rules to **Firestore Database → Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'admin';
    }
    
    function isCommittee() {
      return isAuthenticated() && (getUserRole() == 'admin' || getUserRole() == 'committee');
    }
    
    function isMember() {
      return isAuthenticated() && getUserRole() in ['admin', 'committee', 'member'];
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isCommittee();
      allow create: if isAuthenticated();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Contributions
    match /contributions/{docId} {
      allow read: if isMember();
      allow create, update: if isCommittee();
      allow delete: if isAdmin();
    }
    
    // Loans
    match /loans/{docId} {
      allow read: if isMember();
      allow create: if isMember();
      allow update: if isCommittee();
      allow delete: if isAdmin();
    }
    
    // Welfare requests
    match /welfare/{docId} {
      allow read: if isMember();
      allow create: if isMember();
      allow update: if isCommittee();
      allow delete: if isAdmin();
    }
    
    // Meetings
    match /meetings/{docId} {
      allow read: if isMember();
      allow create, update, delete: if isCommittee();
    }
    
    // Announcements
    match /announcements/{docId} {
      allow read: if isMember();
      allow create, update, delete: if isCommittee();
    }
    
    // Expenses
    match /expenses/{docId} {
      allow read: if isCommittee();
      allow create, update: if isCommittee();
      allow delete: if isAdmin();
    }
    
    // Notifications
    match /notifications/{docId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isCommittee();
      allow update: if isOwner(resource.data.userId);
      allow delete: if isAdmin();
    }
  }
}
```

## 6. Firestore Indexes

Create these composite indexes in **Firestore → Indexes**:

| Collection | Fields | Order |
|---|---|---|
| contributions | memberId ASC, paymentDate DESC | — |
| contributions | year ASC, month ASC | — |
| loans | memberId ASC, createdAt DESC | — |
| welfare | memberId ASC, createdAt DESC | — |
| meetings | date DESC | — |
| announcements | createdAt DESC | — |

## 7. Initial Admin Setup

After deploying, create the first admin user:

1. Register a new account through the app
2. In Firestore Console, find the user document in `/users/{uid}`
3. Manually set `role: "admin"` in the document

## 8. Demo Credentials (Development Only)

| Role | Email | Password |
|---|---|---|
| Admin | admin@bomaengwe.org | demo123 |
| Committee | committee@bomaengwe.org | demo123 |
| Member | member@bomaengwe.org | demo123 |

> **Note:** These demo credentials only work in demo mode (without Firebase). Once Firebase is configured, use real accounts.

## 9. Switching from Demo to Firebase Mode

The app currently uses a demo auth context (`DemoAuthContext.tsx`). To switch to Firebase:

1. Configure Firebase in Settings
2. In `client/src/App.tsx`, change:
   ```tsx
   import { AuthProvider, useAuth } from "./contexts/DemoAuthContext";
   ```
   to:
   ```tsx
   import { AuthProvider, useAuth } from "./contexts/AuthContext";
   ```

## 10. Deployment

To publish the app:
1. Create a checkpoint in the Management UI
2. Click the **Publish** button
3. Configure your custom domain in **Settings → Domains**
