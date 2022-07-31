import { main as getProductsById } from './handler';
import {Context} from 'aws-lambda/handler';
import {APIGatewayProxyEvent} from 'aws-lambda';
import ServerlessClient from 'serverless-postgres';

jest.mock('serverless-postgres', () => {
  const client = {
    connect: jest.fn(),
    query: jest.fn(() => ({})),
    clean: jest.fn(),
  };
  return jest.fn(() => client);
});

describe('Unit test for app handler', function () {
  let client;
  beforeEach(() => {
    client = new ServerlessClient({});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('verifies successful response', async () => {
    const productId = "7567ec4b-b10c-48c5-9345-fc73c48a80a0";
    const event: APIGatewayProxyEvent = { pathParameters: { productId } } as any;
    const productRow = {
      "count": 6,
      "description": "Short Product Description3",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
      "price": 10,
      "title": "ProductNew"
    };
    client.query.mockResolvedValueOnce({ rows: [productRow], rowCount: 0 });
    const result = await getProductsById(event, {} as Context);

    expect(client.connect).toBeCalledTimes(1);
    expect(client.query).toBeCalledWith({
      name: 'fetch-product',
      text: 'SELECT p.id, p.title, p.description, p.price, s.count FROM product p, stocks s WHERE p.id = $1',
      values: [productId],
    });
    expect(client.clean).toBeCalledTimes(1);

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual(productRow);
  });

  it('verifies error response', async () => {
    const productId = "7567ec4b-b10c-48c5-9345-fc73c48a80a0";
    const event: APIGatewayProxyEvent = { pathParameters: { productId } } as any;

    client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    const result = await getProductsById(event, {} as Context);

    expect(client.connect).toBeCalledTimes(1);
    expect(client.query).toBeCalledWith({
      name: 'fetch-product',
      text: 'SELECT p.id, p.title, p.description, p.price, s.count FROM product p, stocks s WHERE p.id = $1',
      values: [productId],
    });
    expect(client.clean).toBeCalledTimes(1);

    expect(result.statusCode).toEqual(404);
    expect(JSON.parse(result.body)).toEqual({ message: 'Product not found' });
  });
});
