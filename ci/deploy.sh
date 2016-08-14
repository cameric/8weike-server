#! /bin/bash

# This is the CircleCI script for deploying
# master commit into aws ElasticBeanswalk
# Note that the server name needs to keep sync
# between the production server and the local VM

SHA1=$1
EB_BUCKET=8weike-core
DOCKERRUN_FILE=$SHA1-Dockerrun.aws.json

# RDS Production DB constants
RDS_DB_PROD_NAME=cameric8weike_db_prod
RDS_DB_PROD_HOST=cameric8weike-db.cotvuqysbx1c.us-east-1.rds.amazonaws.com
RDS_DB_PROD_PASSWORD="Yn&}5Dz5tS#'K]$."
RDS_DB_PROD_PORT=3306
RDS_DB_PROD_USER=dbmaster

# Construct production configuration files from
# production environment variables and templates.
construct_prod_configs() {
  sed -e "s/<TAG>/$SHA1/" \
      -e "s/<RDS_DB_PROD_NAME>/$RDS_DB_PROD_NAME/" \
      -e "s/<RDS_DB_PROD_HOST>/$RDS_DB_PROD_HOST/" \
      -e "s/<RDS_DB_PROD_PASSWORD>/$RDS_DB_PROD_PASSWORD/" \
      -e "s/<RDS_DB_PROD_PORT>/$RDS_DB_PROD_PORT/" \
      -e "s/<RDS_DB_PROD_USER>/$RDS_DB_PROD_USER/" \
      < $1 > $2
}

# Set working directory for the script
cd "$(dirname "$0")"

prinf "Start pushing the new image to Docker Hub...\n"
# Push a new version onto docker hub
docker push cameric8weike/8weike-server-prod:$SHA1
printf "Finished pushing to Docker hub\n\n"

printf "Start configuring AWS CLI...\n"
aws --version
aws configure set default.region us-east-1
aws configure set default.output json
printf "Finished configuring awscli\n\n"

# Apply DB migration to production DB
printf "Creating a new snapshot for production database on RDS...\n"
aws rds create-db-snapshot /
    --db-instance-identifier cameric8weike-db /
    --db-snapshot-identifier cameric8weike-db-snapshot-$SHA1
printf "Finished creating prod DB snapshot\n\n"

printf "Applying migrations to prod DB...\n"
construct_prod_configs flyway.prod.conf.tenplate flyway.prod.conf
docker build -t flyway-worker ./db/docker-flyway
docker run --rm -v ./db/schema:/flyway/sql -v ./ci/flyway.prod.conf:/flyway/flyway.conf flyway-worker info
printf "Finished applying DB migrations\n\n"

# Create new Elastic Beanstalk version
printf "Creating a new provisioning file for new Docker image...\n"
construct_prod_configs Dockerrun.aws.json.template $DOCKERRUN_FILE
aws s3 cp $DOCKERRUN_FILE s3://$EB_BUCKET/$DOCKERRUN_FILE
printf "Finished uploading provisioning file to S3\n\n"

printf "Start deploying to ElasticBeanstalk..."
aws elasticbeanstalk create-application-version --application-name 8weike \
  --version-label $SHA1 --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKERRUN_FILE

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment --environment-name 8weike-nSERVER-prod \
    --version-label $SHA1
printf "\n\n"

printf "#######################"
printf "# Finished deployment #"
printf "#######################"
