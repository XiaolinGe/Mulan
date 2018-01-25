#!/usr/bin/env bash
yarn install
npm run build:dev
scp -i ~/.ssh/AWS.pem -r dist/* ubuntu@54.206.89.112:~/deploy/collinson-frontend
