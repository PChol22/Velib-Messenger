import { handlerPath } from '@libs/handler-resolver';
import { dynamoDBReadIndexPolicies, dynamoDBReadPolicies } from 'src/ressources/policies';
import { tableName } from 'src/ressources';
import { EMAIL_INDEX } from 'src/ressources/dynamoDB';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 10,
  iamRoleStatements: [dynamoDBReadPolicies, dynamoDBReadIndexPolicies],
  environment: {
    ROUTINES_TABLE_NAME : tableName,
    EMAIL_INDEX,
  },
  events: [
    {
      http: {
        method: 'get',
        path: 'routines/{email}',
        request: {},
      },
    },
  ],
};

