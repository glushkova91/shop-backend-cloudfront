import { main as getProductsList } from './handler';
import {Context} from 'aws-lambda/handler';
import {products} from '../../mocks/products';

jest.mock('serverless-postgres', () => {
  const client = {
    connect: jest.fn(),
    query: jest.fn(() => ({ rows: products })),
    clean: jest.fn(),
  };
  return jest.fn(() => client);
});

describe('Unit test for app handler', function () {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('verifies successful response', async () => {
    const result = await getProductsList(() => {}, {} as Context);

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual(products);
  });
});
