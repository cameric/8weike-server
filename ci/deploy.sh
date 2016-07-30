#! /bin/bash

# This is the CircleCI script for deploying
# master commit into aws ElasticBeanswalk
# Note that the server name needs to keep sync
# between the production server and the local VM

SHA1=$1
EB_BUCKET=8weike-core
DOCKERRUN_FILE=$SHA1-Dockerrun.aws.json

# Set working directory for the script
cd "$(dirname "$0")"

# Push a new version onto docker hub
docker push cameric8weike/8weike-server-prod:$SHA1

# Create new Elastic Beanstalk version
sed "s/<TAG>/$SHA1/" < Dockerrun.aws.json.template > $DOCKERRUN_FILE
aws s3 cp $DOCKERRUN_FILE s3://$EB_BUCKET/$DOCKERRUN_FILE

aws elasticbeanstalk create-application-version --application-name 8weike \
  --version-label $SHA1 --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKERRUN_FILE

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment --environment-name 8weike-nSERVER-prod \
    --version-label $SHA1
