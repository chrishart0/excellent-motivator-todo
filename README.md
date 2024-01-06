# Python API for Productivity and Fitness Tracker

Miro planning board: https://miro.com/welcomeonboard/ckdnbnhlbVFSWEEydXp2Q0k5YVJHQXc4ZllPNlhQMUpoV1JwSWhXbXg5TG5TQW9NcUwza1RDcTU2ZW9SeHRHYXwzNDU4NzY0NTMwNjI4NjE0MjA5fDI=?share_link_id=175794476292

## Setup and Installation

Copy db.env.example into a new file called db.env and fill in a decent password


### Frontend
```shell
cd frontend

npm install

npm run dev
```


### Backend
```shell
# Create data dir
mkdir -p .data/postgres

# Build the container
make build

make run
```
#### Setup Postgres SQL db
Once the containers are up and running, you can run the initial setup script to create the SQL DB
```shell
make setup-db
```

#### Using PG Admin
If you'd like to get a GUI view for the data in the DB, you may use the pgAdmin container. 

Connect at: <http://localhost:5050/>
* User: admin@admin.com
* Password: root

Using the values in the db.env you created, you may connect to the DB. Remember that pgAdmin is running in a container, so you must use the container name `postgres` as the Host name, not localhost.

### Launch the app!
Visit the GUI and the API
* <localhost:3000/tasks>
* <localhost:8010/docs>

## Testing
Right now the only tests are integration tests on the backend API
```
make test
```

## Overview
This multi-user API offers a comprehensive solution for managing daily tasks, planning activities, logging events, and tracking workouts. It's designed for secure, scalable user sign-ups and data isolation. The backend is built with FastAPI and the frontend with Next.js. The project uses the 3 Musketeers pattern (Docker, Docker Compose, Make) and includes comprehensive testing with Pytest and Playwright.

## Features
1. **To-Do List**: Add, update, delete, and categorize tasks.
2. **Daily / Weekly Planner**: Schedule and view activities.
3. **Workout Log**: Record and retrieve activity logs.
4. **Workout Tracker**: Manage workout routines and track progress.
5. **Authentication**: Secure user authentication and authorization.
6. **Discord Chat**: Daily AI chat via discord build with langchain and OpenAI which checks in on todo list progress, helps to build daily / weekly plan, etc

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


## Usage
(Examples and guides on using the API and frontend, including authentication.)

## Contributing
(Guidelines for contributing to the project.)

## License
(Information about the project's license.)
