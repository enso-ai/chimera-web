echo Building...
npm run build:staging

echo Deploying...
aws s3 sync build/ s3://tiktok-manager-internal/

echo Invalidating CloudFront cache...
aws cloudfront create-invalidation --distribution-id E2ZFYHAEC9G6VM --paths /index.html --output text
