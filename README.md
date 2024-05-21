# Firebase Auth Microservice

## Description
This project is a stateless and lightweight microservice designed to handle user authentication within Firebase projects. It provides endpoints for user registration and authentication. Built using Node.js, it integrates seamlessly with Firebase Authentication and can be easily deployed as a Docker container.

## Features
- User registration with name, email, and password.
- Seamless integration with Firebase Authentication.
- Dockerized for easy deployment and scalability.
- OpenAPI (Swagger) documentation for easy reference and testing.

## Prerequisites
- Node.js installed on your machine.
- Docker installed on your machine (optional).

### Firebase SDK
* The microservice requires the Firebase Admin SDK service account key `(firebaseServiceAccountKey.json)` for authentication with Firebase.

`Note:` Ensure that you have proper security measures in place when deploying the microservice in production environments.

## Installation
1. Clone the repository:
   ```bash
   git clone <https://github.com/dayvison2b/firebase-auth-microservice.git>
   ```

2. Navigate to the project directory:
   ```bash
   cd tinder-auth-microservice
   ```
   
1. Install dependencies:
   ```bash
   npm install
   ```

## Configuration
1. Create a Firebase project and enable Firebase Authentication.
2. Download the Firebase Admin SDK service account key and save it as `firebaseServiceAccountKey.json` in the project root directory.
3. Create a `.env` file in the project root directory and add the following environment variables:
    ```makefile
    PORT=5000
    ```

## Usage
1. Start the microservice:
    ```bash
    npm start
    ```

## Docker usage
1. Build the Docker image:
    ```bash
    docker-compose build
    ```bash
2. Run the Docker container:
    ```bash
    docker-compose up
    ```

## Swagger Documentation
* Access the Swagger documentation by navigating to `http://localhost:5000/api-docs`.