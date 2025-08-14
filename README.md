# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Overall Overview of deployment


# Secure Chat Application

## Project Overview

This is a *secure, end-to-end encrypted chat application* built with modern web technologies. The application provides WhatsApp-like group chat functionality with strong cryptographic security, ensuring that only intended recipients can read messages.

## Key Features

### End-to-End Encryption
- *RSA-OAEP 2048-bit encryption* for all messages
- *Public key cryptography* ensures only recipients can decrypt messages
- Messages are encrypted for every user in the group
- Private keys never leave the user's device

### Advanced Key Management
- Automatic RSA key pair generation on user registration
- Public keys stored in Firebase Firestore for encryption
- Private keys securely stored in browser localStorage
- Key persistence across browser sessions

###  Group Chat Functionality
- Real-time group messaging
- All users can read all messages (when properly encrypted)
- Warning system for users missing encryption keys
- Firebase Authentication for secure user management

### 🛡 Security Architecture
- *Zero-knowledge architecture*: Server cannot read message content
- Messages stored as encrypted ciphertexts in Firestore
- Each message encrypted separately for each group member
- Robust error handling for encryption/decryption failures

## Technology Stack

### Frontend
- *React* with hooks for state management
- *Tailwind CSS* for modern, responsive UI
- *Web Crypto API* for client-side encryption

### Backend & Database
- *Firebase Authentication* for user management
- *Cloud Firestore* for real-time message storage
- *Firebase Hosting* ready for deployment

### Cryptography
- *RSA-OAEP* with SHA-256 for asymmetric encryption
- *JWK (JSON Web Key)* format for key storage
- *Base64 encoding* for binary data storage

## How It Works

1. *User Registration*: Users sign up via Firebase Auth
2. *Key Generation*: App generates RSA key pair automatically
3. *Key Storage*: Public key → Firestore, Private key → localStorage
4. *Message Encryption*: Each message encrypted for all group members
5. *Real-time Sync*: Firebase provides instant message delivery
6. *Decryption*: Each user decrypts with their private key

## Security Benefits

- *Forward Secrecy*: New keys can be generated per session
- *Multi-recipient Encryption*: Messages encrypted for entire group
- *Client-side Encryption*: Server never sees plaintext
- *Authentication*: Only registered users can participate
- *Tamper Detection*: Invalid ciphertexts fail gracefully

## Use Cases

- *Private Team Communication*
- *Secure Business Messaging*
- *Confidential Group Discussions*
- *Privacy-focused Social Chat*
- *Educational Cryptography Demonstration*

This project demonstrates enterprise-grade security practices while maintaining a user-friendly chat experience similar to popular messaging apps, but with guaranteed end-to-end encryption.