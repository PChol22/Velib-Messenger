import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const deleteRoutine = async (event: { body: { email: string, schedule: string } }) => {
  const { schedule, email } = event.body;

  const client = new DynamoDBClient({});

  const deleteCommand = new DeleteItemCommand({
    TableName: process.env.ROUTINES_TABLE_NAME,
    Key: marshall({
      PK: `routine-${schedule}`,
      SK: email,
    })
  });

  await client.send(deleteCommand);
  
  return formatJSONResponse({
    status: 200,
    message: 'Deleted !',
  });
};

export const main = middyfy(deleteRoutine);
