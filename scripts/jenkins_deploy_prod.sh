#!/usr/bin/env bash
yarn install
npm run build:prod
scp -i ~/.ssh/collinson.pem -r /home/ubuntu/.jenkins/workspace/prod-collinson-customer/dist/* ubuntu@13.54.66.107:~/deploy/collinson-frontend
