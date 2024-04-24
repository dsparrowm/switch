# Docker Setup for Swiich API

This document provides instructions for setting up and running the API for Swiich using Docker and Docker Compose.

## Prerequisites
- Docker
- Docker Compose

## Getting Started

1. Clone the repository
```sh
git clone https://github.com/dsparrowm/switch.git
```
2. Navigate to the project directory
```sh
dave/switch
```
3. Build the Docker images
```sh
docker-compose build
```
4. Start the container
```sh
docker-compose up
```
This command will start the Docker containers for the backend service.

5. Access the application
Once the containers are running, you can access the application at http://localhost:3001.

# Docker Compose Configuration
The Docker Compose configuration for this project is defined in the compose.yml file. Here's a breakdown of the services and their configurations:

## Backend Service
- Service Name: api
- Build Context: ./
- Ports: 3001:3001
- Environment Variables: Loaded from the .env file in the ./ directory
- Docker Compose Watch Mode:
     - Watches for changes in package.json and package-lock.json files and rebuilds the container and image if there are any changes.
     - Watches for changes in the ./ directory and syncs the changes with the container in real-time.

## Database service
- service name: db
- ports: 5432:5432
- Environment Variables: Loaded from the .env file in the ./ directory

## Volumes
The Docker Compose configuration defines a volume named "postgres-data" that can be used to persist data if necessary.

## Troubleshooting
If you encounter any issues while running the Docker containers, you can check the logs using the following command:
```sh
docker-compose logs -f
```
This will display the logs for all the running containers and help you identify and resolve any issues.

## Additional Resources
[Docker Documentation](https://docs.docker.com/language/nodejs/)  
[Docker Compose Documentation](https://docs.docker.com/compose/)