aws cloudformation create-stack \
  --stack-name tiktok-manager-internal \
  --template-body file://s3_cloudfront.yaml \
  --parameters \
    ParameterKey=BucketName,ParameterValue=tiktok-manager-internal \
    ParameterKey=DomainName,ParameterValue=chimera.v01s.com \
    ParameterKey=AcmCertificateArn,ParameterValue=arn:aws:acm:us-east-1:667865420292:certificate/f98e29c1-550c-4b9c-b738-2dd78aa4738b \
  --capabilities CAPABILITY_NAMED_IAM

