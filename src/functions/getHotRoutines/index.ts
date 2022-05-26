import { handlerPath } from '@libs/handler-resolver';
import { dynamoDBReadPolicies, sqsSendMessagePolicy } from 'src/ressources/policies';
import { queueUrl, tableName } from 'src/ressources';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 10,
  iamRoleStatements: [dynamoDBReadPolicies, sqsSendMessagePolicy],
  environment: {
    ROUTINES_TABLE_NAME : tableName,
    SMS_QUEUE_URL: queueUrl,
  },
  events: [
    {
      schedule: 'cron(*/5 * * * ? *)'
    },
  ],
};

