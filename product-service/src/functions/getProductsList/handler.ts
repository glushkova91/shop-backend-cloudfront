import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const ServerlessClient = require('serverless-postgres')

const client = new ServerlessClient({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  debug: true,
});

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  await client.connect();
  const productsFromDB = await client.query(`SELECT p.id, p.title, p.description, p.price, s.count FROM product p, stocks s WHERE p.id = s.id`);
  await client.clean();
  return formatJSONResponse(productsFromDB.rows);
};

export const main = middyfy(getProductsList);
