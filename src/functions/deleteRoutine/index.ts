import { handlerPath } from '@libs/handler-resolver';
import { dynamoDBDeletePolicy } from 'src/ressources/policies';
import { tableName } from 'src/ressources';
import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 10,
  iamRoleStatements: [dynamoDBDeletePolicy],
  environment: {
    ROUTINES_TABLE_NAME : tableName,
  },
  events: [
    {
      http: {
        method: 'delete',
        path: 'deleteRoutine',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};

