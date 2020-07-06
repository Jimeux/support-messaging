## infra
Based on https://github.com/1Strategy/ecs-refarch-continuous-deployment

### Package
```
aws cloudformation package \
--template-file ./infra.yml \
--s3-bucket testoid \
--output-template-file ./tmp/response.yml
```

### Deploy
```
aws cloudformation deploy \
--template-file ./tmp/response.yml \
--stack-name MyStack \
--capabilities CAPABILITY_IAM
--parameter-overrides "GitHubUser=" "GitHubRepo=" "GitHubBranch=" "GitHubToken="
```

### Delete
```
aws cloudformation delete-stack --stack-name MyStack
```
