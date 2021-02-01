# Network
deploy-network:
	aws cloudformation deploy \
--template-file ./stacks/network.yml \
--stack-name SupportNetwork

delete-network:
	aws cloudformation delete-stack --stack-name SupportNetwork


# VPN
deploy-vpn:
	aws cloudformation deploy \
--template-file ./stacks/vpn.yml \
--stack-name SupportVPN \
--capabilities CAPABILITY_IAM

delete-vpn:
	aws cloudformation delete-stack --stack-name SupportVPN


# RDS
deploy-rds:
	aws cloudformation deploy \
--template-file ./stacks/rds.yml \
--stack-name SupportSupportRDS

delete-rds:
	aws cloudformation delete-stack --stack-name SupportSupportRDS


# user-client
deploy-user-client:
	aws --region us-east-1 cloudformation deploy \
--template-file ./stacks/user-client.yml \
--stack-name SupportUserClient \
--parameter-overrides "Subdomain=${CLIENT_DOMAIN}" \
"HostedZoneId=${CLIENT_HOSTED_ZONE_ID}"

delete-user-client:
	aws --region us-east-1 cloudformation delete-stack --stack-name SupportUserClient


# ECR
deploy-ecr:
	aws cloudformation deploy \
--template-file ./stacks/ecr.yml \
--stack-name SupportRepositories

delete-ecr:
	aws cloudformation delete-stack --stack-name SupportRepositories


# ECS
package-ecs:
	mkdir tmp
	aws cloudformation package \
--template-file ./stacks/ecs/ecs.yml \
--s3-bucket testoid \
--output-template-file ./tmp/ecs.yml \
--parameter-overrides "DomainName=${SUPPORT_DOMAIN_NAME}" \
"ClientDomain=${SUPPORT_CLIENT_DOMAIN}" || rm -fr tmp

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
