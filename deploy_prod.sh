# Get current timestamp in seconds
TIMESTAMP=$(date +%s)
TAG_NAME="prod_${TIMESTAMP}"

echo "Creating git tag: ${TAG_NAME}"
git tag "${TAG_NAME}"

echo "Pushing git tag: ${TAG_NAME}"
git push origin "${TAG_NAME}"

echo Building...
npm run build:prod

echo Deploying...
aws s3 sync build/ s3://tiktok-manager-prod/

echo Invalidating CloudFront cache...
aws cloudfront create-invalidation --distribution-id E2VGTQ0M3R7IYH --paths /index.html --output text
