import { main as getProductsList } from './handler';
import {Context} from 'aws-lambda/handler';
import {products} from '../../mocks/products';

describe('Unit test for app handler', function () {
  it('verifies successful response', async () => {
    const result = await getProductsList(() => {}, {} as Context);

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual(products);
  });
});
