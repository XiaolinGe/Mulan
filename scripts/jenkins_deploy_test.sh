#!/usr/bin/env bash
cd /home/ubuntu/.jenkins/workspace/collinson-frontend-dev
yarn install
npm run build:dev
cp -r /home/ubuntu/.jenkins/workspace/collinson-frontend-dev/dist/* /home/ubuntu/deploy/collinson-frontend/
