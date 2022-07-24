import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import {products} from '../../mocks/products';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const productId = event.pathParameters.productId;
  const product = products.find(product => product.id === productId);
  const statusCode = product ? 200 : 404;
  return formatJSONResponse(product || { message: 'Product not found' }, statusCode);
};

export const main = middyfy(getProductsById);
