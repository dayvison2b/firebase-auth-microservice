FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the source code and test files
COPY src/ src/
COPY tests/ tests/
COPY jest.config.js ./
COPY ./.env ./
COPY ./firebaseServiceAccountKey.json ./firebaseServiceAccountKey.json

# Command to run the tests
CMD ["npm", "start"]