import { App, Stack } from '@aws-cdk/core';
import { Topic } from '@aws-cdk/aws-sns';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Queue } from '@aws-cdk/aws-sqs';

import { CloudFormationTemplate } from '../libs/configHelper/cloudformation';
import { PARTITION_KEY, SORT_KEY, SECONDARY_PARTITION_KEY, SECONDARY_SORT_KEY, EMAIL_INDEX } from './dynamoDB';

const app = new App();
const stack = new Stack(app);

const topic = new Topic(stack, 'SMS-TOPIC', {
    displayName: 'Velib SMS Topic',
});

const table = new Table(stack, 'SCHEDULE-TABLE', {
  partitionKey: { name: PARTITION_KEY, type: AttributeType.STRING },
  sortKey: { name: SORT_KEY, type: AttributeType.STRING },
});

table.addGlobalSecondaryIndex({
  indexName: EMAIL_INDEX,
  partitionKey: { name: SECONDARY_PARTITION_KEY, type: AttributeType.STRING },
  sortKey: { name: SECONDARY_SORT_KEY, type: AttributeType.STRING },
});

const queue = new Queue(stack, 'SMS-QUEUE', {
});

export const topicArn = stack.resolve(topic.topicArn);
export const topicName = stack.resolve(topic.topicName);

export const tableArn = stack.resolve(table.tableArn);
export const tableName = stack.resolve(table.tableName);
export const indexArn = stack.resolve(`${table.tableArn}/index/${EMAIL_INDEX}`)

export const queueArn = stack.resolve(queue.queueArn);
export const queueName = stack.resolve(queue.queueName);
export const queueUrl = stack.resolve(queue.queueName);

export const resources = app.synth().getStackByName(stack.stackName)
  .template as CloudFormationTemplate;
