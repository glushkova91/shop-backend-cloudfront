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

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  await client.connect();
  const { body } = event;
  const query = {
    text: 'INSERT INTO product(title, description, price) VALUES($1, $2, $3)',
    values: [body.title, body.description, body.price],
  }
  const productsFromDB = await client.query(query);
  await client.clean();
  return formatJSONResponse(productsFromDB.rows);
};

export const main = middyfy(createProduct);
