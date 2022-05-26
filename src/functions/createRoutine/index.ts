import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';
import { dynamoDBWritePolicy } from 'src/ressources/policies';
import { tableName } from 'src/ressources';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 10,
  iamRoleStatements: [dynamoDBWritePolicy],
  environment: { ROUTINES_TABLE_NAME : tableName },
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
      },
    },
  ],
};

