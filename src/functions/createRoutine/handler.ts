import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SNSClient, SubscribeCommand } from '@aws-sdk/client-sns';
import { marshall } from '@aws-sdk/util-dynamodb';

const createRoutine = async (event: { body: {
  lat: number,
  lon: number,
  hours: number,
  minutes: number,
  email: string,
  schedule: string,
}}) => {  
  const { hours, minutes, lon, lat, email } = event.body;

  const client = new DynamoDBClient({});

  const Item = marshall({
    PK: `routine-${hours}h${minutes}`,
    SK: email,
    lat: lat.toString(),
    lon: lon.toString(),
    email,
    schedule: `${hours}h${minutes}`,
  });

  const putItemCommand = new PutItemCommand({
    Item,
    TableName: process.env.ROUTINES_TABLE_NAME,
  });

  const result = await client.send(putItemCommand);

  const clientSNS = new SNSClient({});
  const subscribeCommand = new SubscribeCommand({
    TopicArn: process.env.SMS_TOPIC_ARN,
    Protocol: 'email',
    Endpoint: email,
    Attributes: {
      FilterPolicy: JSON.stringify({
        email: [
          email
        ],
      }),
    },
  });

  clientSNS.send(subscribeCommand);
  
  return formatJSONResponse({
    status: 200,
    message: result,
  });
};

export const main = middyfy(createRoutine);
