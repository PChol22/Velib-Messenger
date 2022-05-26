import { handlerPath } from '@libs/handler-resolver';
import { snsPublishPolicy, sqsReceiveMessagePolicy } from 'src/ressources/policies';
import { queueArn, topicArn } from 'src/ressources';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 10,
  iamRoleStatements: [snsPublishPolicy, sqsReceiveMessagePolicy],
  environment: { SMS_TOPIC_ARN: topicArn },
  events: [
    {
      sqs: {
        arn: queueArn,
      },
    },
  ],
};

