import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import {products} from '../../mocks/products';

function fakeDBRequest(): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products)
    }, 500)
  })
}

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const productsFromDB = await fakeDBRequest();
  return formatJSONResponse(productsFromDB);
};

export const main = middyfy(getProductsList);
