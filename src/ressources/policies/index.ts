import { indexArn, queueArn, tableArn, topicArn } from '..';

export const snsPublishPolicy = {
  Effect: 'Allow',
  Resource: [topicArn],
  Action: ['sns:Publish'],
};

export const dynamoDBReadPolicies = {
  Effect: 'Allow',
  Resource: [tableArn],
  Action: ['dynamodb:GetItem', 'dynamodb:Query'],
};

export const dynamoDBReadIndexPolicies = {
  Effect: 'Allow',
  Resource: [indexArn],
  Action: ['dynamodb:GetItem', 'dynamodb:Query'],
};

export const dynamoDBWritePolicy = {
  Effect: 'Allow',
  Resource: [tableArn],
  Action: ['dynamodb:PutItem'],
};

export const dynamoDBDeletePolicy = {
  Effect: 'Allow',
  Resource: [tableArn],
  Action: ['dynamodb:DeleteItem'],
};

export const sqsSendMessagePolicy = {
  Effect: 'Allow',
  Resource: [queueArn],
  Action: ['sqs:SendMessage']
};

export const sqsReceiveMessagePolicy = {
  Effect: 'Allow',
  Resource: [queueArn],
  Action: ['sqs:ReceiveMessage']
};
