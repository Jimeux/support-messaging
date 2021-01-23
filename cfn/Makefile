# ECR
deploy-ecr:
	aws cloudformation deploy \
--template-file ./stacks/ecr.yml \
--stack-name SupportRepositories

delete-ecr:
	aws cloudformation delete-stack --stack-name SupportRepositories --force


# Network
deploy-network:
	aws cloudformation deploy \
--template-file ./stacks/network.yml \
--stack-name SupportNetwork

delete-network:
	aws cloudformation delete-stack --stack-name SupportNetwork


# ECS
package-ecs:
	mkdir tmp
	aws cloudformation package \
--template-file ./stacks/ecs/ecs.yml \
--s3-bucket testoid \
--output-template-file ./tmp/ecs.yml || rm -fr tmp

deploy-ecs: package-ecs
	aws cloudformation deploy \
--capabilities CAPABILITY_IAM \
--template-file ./tmp/ecs.yml \
--stack-name SupportECS || true
	rm -fr ./tmp

delete-ecs:
	aws cloudformation delete-stack --stack-name SupportECS


# CodePipeline
package-pipeline:
	mkdir tmp
	aws cloudformation package \
--template-file ./stacks/pipeline/stack.yml \
--s3-bucket testoid \
--output-template-file ./tmp/pipeline.yml || rm -fr ./tmp

deploy-pipeline: package-pipeline
	aws cloudformation deploy \
--capabilities CAPABILITY_IAM \
--template-file ./tmp/pipeline.yml \
--stack-name SupportPipeline \
--parameter-overrides "GitHubUser=${GITHUB_USER}" \
"GitHubRepo=${GITHUB_REPO}" \
"GitHubBranch=master" \
"GitHubToken=${GITHUB_TOKEN}" || true
	rm -fr ./tmp

delete-pipeline:
	aws cloudformation delete-stack --stack-name SupportPipeline
