# SWIITCH - An all in one platform for your Organization

 _This is a full-stack collaboration tool built with React, Node.js, Express.js, and PostgreSQL. The application allows users to join organizations, create and manage departments, assign tasks, send private and group messages, and more._

## Features
- User authentication and authorization
- Organization and department management
- Task assignment and tracking
- Private and group messaging
- Invitation system for adding users to organizations

## Technologies Used
- Backend: Node.js, Express.js
- Database: PostgreSQL (with Prisma ORM)
- Authentication: JSON Web Tokens (JWT)
- Real-time Communication: Socket.IO


## Getting Started

### Prerequisites

[Node.js](https://nodejs.org/) v14 or later

PostgreSQL database

(Optional) Docker and Docker Compose for containerization

Installation

1. Clone the repository:
   git clone https://github.com/dsparrowm/switch.git

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a .env file at the root of the project
    Update the .env file with your PostgreSQL database connection details and other required variables.
    Look at the _.env.example_ file for the environment variables needed

4. Run database migrations:
    ```sh
    npx prisma migrate dev
    ```

5. Start the development server:
    ```sh
    npm run dev
    ```

    The server will start running at (http://localhost:3001).

Docker Setup
If you prefer to run the application using Docker and Docker Compose, follow these steps:

1. Build the Docker images:
    ```sh
    docker-compose build
    ```

2. Start the containers:
    ```sh
    docker-compose up
    ```

Acknowledgments
- [Prisma](www.prisma.io) - For the powerful ORM and database tooling
- [Socket.IO]() - For real-time communication capabilities
- [bcrypt]() - For password hashing and comparison
- [jsonwebtoken]() - For JWT authentication