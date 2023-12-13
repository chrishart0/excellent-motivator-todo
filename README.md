# Python API for Productivity and Fitness Tracker

## Overview
This multi-user API offers a comprehensive solution for managing daily tasks, planning activities, logging events, and tracking workouts. It's designed for secure, scalable user sign-ups and data isolation. The backend is built with FastAPI and the frontend with Next.js. The project uses the 3 Musketeers pattern (Docker, Docker Compose, Make) and includes comprehensive testing with Pytest and Playwright.

## Features
1. **To-Do List**: Add, update, delete, and categorize tasks.
2. **Daily / Weekly Planner**: Schedule and view activities.
3. **Log**: Record and retrieve activity logs.
4. **Workout Tracker**: Manage workout routines and track progress.
5. **Authentication**: Secure user authentication and authorization.

## API Specification
### Endpoints
- `/tasks`: Manage tasks.
- `/planner`: Handle planning.
- `/log`: Log activities.
- `/workouts`: Track workouts.
- `/auth`: Handle user authentication and management.

### Methods
- `GET`: Retrieve information.
- `POST`: Create new entries.
- `PUT`: Update existing entries.
- `DELETE`: Remove entries.

## Repository Structure
- `/backend`: Backend API code with FastAPI.
  - `/api`: Core API implementation.
  - `/models`: Data models.
  - `/services`: Business logic.
  - `/utils`: Utility functions.
  - `/tests`: 
    - `/unit`: Unit tests for backend components.
    - `/api`: API tests for endpoint functionality.
- `/frontend`: Frontend user interface with Next.js.
  - `/tests`: 
    - `/unit`: Unit tests for frontend components.
- `/e2e`: End-to-end tests with Playwright.
- `/docs`: API and project documentation.
- `/docker`: Docker configurations.
- `Makefile`: Automation scripts using Make.
- `docker-compose.yml`: Docker Compose setup.
- `README.md`: Project overview and guidelines.

## Testing Strategy
- **Backend Unit Tests**: Test individual components in `/backend/tests/unit`.
- **Frontend Unit Tests**: Test frontend components in `/frontend/tests/unit`.
- **API Tests**: Validate API endpoints in `/backend/tests/api`.
- **End-to-End Tests**: Simulate user interactions in `/e2e`.

## Multi-User
- Implement data isolation for each user to ensure privacy and security.
- Provide scalable sign-up and authentication processes for new users.
- Implement user-specific data access and authorization rules.

## Authentication
- Implement a secure authentication system using JWTs or OAuth.
- Handle user registration, login, and access control

## Hosting on AWS
- Deploy the application on AWS for scalability and reliability.
- Utilize services like EC2, Elastic Beanstalk, and RDS.
- Set up CI/CD pipelines using AWS CodePipeline or similar tools.

## Setup and Installation

```shell
# Create data dir
mkdir -p .data/dynamodb

# Build the container
make build

```

## Usage
(Examples and guides on using the API and frontend, including authentication.)

## Contributing
(Guidelines for contributing to the project.)

## License
(Information about the project's license.)
