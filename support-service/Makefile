build:
	go build -o out/support-service main.go
run:
	go run main.go
deploy:
	aws codepipeline start-pipeline-execution --name SupportPipeline--support-service


db-create:
	docker exec -i ${SUPPORT_DB_CONTAINER} mysql -e "DROP DATABASE IF EXISTS ${SUPPORT_DB_NAME};"
	docker exec -i ${SUPPORT_DB_CONTAINER} mysql -e "CREATE DATABASE ${SUPPORT_DB_NAME} DEFAULT COLLATE utf8mb4_general_ci;"
db-migrate: goose
	@goose -dir db/migrations mysql "${SUPPORT_DB_STRING}" up
db-revert: goose
	@goose -dir db/migrations mysql "${SUPPORT_DB_STRING}" down
db-status: goose
	@goose -dir db/migrations mysql "${SUPPORT_DB_STRING}" status
db-seed:
	go run -mod readonly db/seed/seed.go


.PHONY: goose
goose:
	@[ -z "$(shell command -v goose)" ] && go get -u github.com/pressly/goose/cmd/goose || true
