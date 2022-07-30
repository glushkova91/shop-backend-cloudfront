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


const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const productId = event.pathParameters.productId;
  await client.connect();
  const query = {
    // give the query a unique name
    name: 'fetch-product',
    text: 'SELECT p.id, p.title, p.description, p.price, s.count FROM product p, stocks s WHERE p.id = $1',
    values: [productId],
  }

  const product = await client.query(query);
  await client.clean();
  const statusCode = product.rows.length ? 200 : 404;
  return formatJSONResponse(product.rows[0] || { message: 'Product not found' }, statusCode);
};

export const main = middyfy(getProductsById);
