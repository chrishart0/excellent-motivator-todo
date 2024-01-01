# Default goal
.DEFAULT_GOAL := help

# Help target
.PHONY: help
help: ## List out all the commands and their usage
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[1m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: build
build: ## Build the docker images
	docker-compose build

.PHONY: up
run up: ## Run the app
	docker-compose up

.PHONY: setupDdb
setupDdb: ## Initial setup of empty DDB on local
	docker-compose exec api python /app/scripts/setup_dynamodb.py

.PHONY: down
down: ## Stop the app
	docker-compose down

.PHONY: restart
restart: ## Restart the app
	docker-compose restart

.PHONY: test
test: ## Run the tests
	docker-compose exec api pytest

.PHONY: logs
logs: ## Show the logs of the app
	docker-compose logs -f

.PHONY: shell
shell: ## Open a shell in the app container
	docker-compose exec api /bin/bash

.PHONY: setup-db
setup-db: ## Setup the database
	docker-compose exec api python3 scripts/setup_postgres_db.py