import type { AWS } from '@serverless/typescript';
import { resources } from './src/ressources';
import {
  computeStationsAndSendMessage,
  createRoutine,
  getHotRoutines,
  getRoutines,
  deleteRoutine
} from 'src/functions';

const serverlessConfiguration: AWS = {
  service: 'velib-messenger',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-iam-roles-per-function'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    profile: 'velib-admin',
    region: 'eu-west-1'
  },
  functions: {
    computeStationsAndSendMessage,
    createRoutine,
    getHotRoutines,
    getRoutines,
    deleteRoutine
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources,
};

module.exports = serverlessConfiguration;
