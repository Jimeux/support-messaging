## infra
Based on https://github.com/1Strategy/ecs-refarch-continuous-deployment

### Validate

```
aws cloudformation validate-template \
--template-body file://infra/infra.yaml
```

## ECR

### Login
```
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com
```

### Tag & Push
```
docker tag user-service:latest ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/user-service:latest

docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/user-service:latest
```
