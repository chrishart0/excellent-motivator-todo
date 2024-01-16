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

_run-api: ## Run api locally instead of in docker
	uvicorn main:app --host 0.0.0.0 --port 8010 --reload

.PHONY: down
down: ## Stop the app
	docker-compose down

.PHONY: restart
restart: down up ## Restart the app

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
	echo "Database setup"

.PHONY: wipe-db
wipe-db: ## Wipe the database
	sudo rm -rf .data/postgres
	mkdir .data/postgres
	echo "Database wiped"

restart-db: ## Restart the database
	docker-compose restart postgres
	sleep 5

.PHONY: view-db
view-db: ## View the database
	@docker-compose exec api bash -c 'export PGPASSWORD=$$POSTGRES_PASSWORD && \
	psql -U $$POSTGRES_USER -h $$POSTGRES_HOST -d $$POSTGRES_DB -c "SELECT * FROM todo_items LIMIT 10;"'

	# PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USER -h $POSTGRES_HOST -d $POSTGRES_DB -c "ALTER TABLE todo_items ADD COLUMN due_date DATE;"


.PHONE: recreate-db
recreate-db: wipe-db restart-db setup-db view-db ## Recreate the database
	