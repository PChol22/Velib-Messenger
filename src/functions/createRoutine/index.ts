import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';
import { dynamoDBWritePolicy, snsSubscribePolicy } from 'src/ressources/policies';
import { tableName, topicArn } from 'src/ressources';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 10,
  iamRoleStatements: [dynamoDBWritePolicy, snsSubscribePolicy],
  environment: { ROUTINES_TABLE_NAME : tableName, SMS_TOPIC_ARN: topicArn },
  events: [
    {
      http: {
        method: 'post',
        path: 'createRoutine',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        cors: {
          origin: '*'
        }
      },
    },
  ],
};

