
docker-build:
	docker build -t user-service .
	docker tag user-service:latest ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/user-service:latest
	docker push ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/user-service:latest
