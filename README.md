# User Management System API

A RESTful API for managing users, addresses, and posts built with Node.js, TypeScript, Express, and SQLite with Sequelize ORM.

## Live Demo

Access the deployed API at [https://user-mgt-sys-el0o.onrender.com](https://user-mgt-sys-el0o.onrender.com)

## Postman Collection

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/11191710/2sAYdkGogb)

## Features

- RESTful API endpoints for users, addresses, and posts
- TypeScript for type safety and better developer experience
- Sequelize ORM for database interactions
- SQLite database for development and testing
- Winston logger for logging
- Robust error handling and validation
- Comprehensive test suite

## Tech Stack

- Node.js
- TypeScript
- Express.js
- SQLite
- Sequelize ORM
- Winston Logger
- Express Validator

## API Endpoints

### User Endpoints

- `GET /users` - Returns a paginated list of users
- `GET /users/count` - Returns the total number of users
- `GET /users/{id}` - Returns details of a specific user, including their address
- `POST /users` - Creates a new user

### Address Endpoints

- `GET /addresses?userId={userId}` - Returns the address associated with a user
- `POST /addresses` - Creates an address for a user
- `PATCH /addresses/{userID}` - Modifies the address associated with a user

### Post Endpoints

- `GET /posts?userId={userId}` - Returns all posts for a specific user
- `POST /posts` - Creates a new post for a user
- `DELETE /posts/{id}` - Deletes a post by its ID

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/johnayinde/user-management-system.git
   cd user-management-system
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory:

   ```
   NODE_ENV=development
   PORT=3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running in Production

```bash
npm start
# or
yarn start
```

## Running Tests

Run all tests:

```bash
npm test
# or
yarn test
```

Run specific test suites:

```bash
npm run test:user
npm run test:address
npm run test:post
# or
yarn test:user
yarn test:address
yarn test:post
```

Generate test coverage:

```bash
npm run test:coverage
# or
yarn test:coverage
```
