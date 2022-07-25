import { main as getProductsById } from './handler';
import {Context} from 'aws-lambda/handler';
import {APIGatewayProxyEvent} from 'aws-lambda';

describe('Unit test for app handler', function () {
  it('verifies successful response', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {
        productId: "7567ec4b-b10c-48c5-9345-fc73c48a80a0"
      }
    } as any
    const result = await getProductsById(event, {} as Context);

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual({
      "count": 6,
      "description": "Short Product Description3",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
      "price": 10,
      "title": "ProductNew"
    });
  });

  it('verifies error response', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {
        productId: "7567ec4b-b10c-48c5-9345-fc73c48a"
      }
    } as any
    const result = await getProductsById(event, {} as Context);

    expect(result.statusCode).toEqual(404);
    expect(JSON.parse(result.body)).toEqual({ message: 'Product not found' });
  });
});
