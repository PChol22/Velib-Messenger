import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

interface RoutineItem {
  PK: string,
  SK: string,
  lat: number,
  lon: number,
  email: string,
  schedule: string,
}

const getRoutines = async (event) => {
  const email = event.pathParameters.email;

  const client = new DynamoDBClient({});

  const queryCommand = new QueryCommand({
    TableName: process.env.ROUTINES_TABLE_NAME,
    ExpressionAttributeValues: {
      ':email': { S: email },
    },
    KeyConditionExpression: 'email = :email',
    IndexName: process.env.EMAIL_INDEX,
  });

  const query = await client.send(queryCommand);

  const result = query.Items
    .map(item => unmarshall(item) as RoutineItem)
    .map(({ lat, lon, email, schedule }) => ({
      lat,
      lon,
      email,
      schedule,
    }));
  
  return formatJSONResponse({
    status: 200,
    message: result,
  });
};

export const main = middyfy(getRoutines);
