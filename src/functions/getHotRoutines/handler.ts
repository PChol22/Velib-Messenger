import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import moment from 'moment-timezone';

interface SMSItem {
  lat: number,
  lon: number,
  email: string,
};

const getHotRoutines = async () => {  
  const client = new DynamoDBClient({});

  const date = new Date();
  const parisDate = moment(date).tz('Europe/Paris');
  const hours = parisDate.hours();
  const minutes = parisDate.minutes() - parisDate.minutes() % 5;

  const queryCommand = new QueryCommand({
    TableName: process.env.ROUTINES_TABLE_NAME,
    ExpressionAttributeValues: {
      ':pk': { S: `routine-${hours}h${minutes}` },
    },
    KeyConditionExpression: 'PK = :pk',
  });

  const query = await client.send(queryCommand);

  const result = query.Items.map(item => unmarshall(item) as SMSItem);

  const sqsClient = new SQSClient({});

  result.forEach(item => {
    const command = new SendMessageCommand({
      QueueUrl: process.env.SMS_QUEUE_URL,
      MessageBody: JSON.stringify({
        lat: item.lat,
        lon: item.lon,
        email: item.email,
      }),
    });
    sqsClient.send(command);
  })
  
  return formatJSONResponse({
    status: 200,
    message: result,
  });
};

export const main = middyfy(getHotRoutines);
