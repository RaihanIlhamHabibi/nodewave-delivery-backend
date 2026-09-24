import { expect, test } from 'bun:test';
import { app } from './index';

test('health endpoint reports the API is alive', async () => {
  const response = await app.fetch(new Request('http://localhost/health'));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok', service: 'nodewave-delivery-api' });
});

test('login rejects invalid credentials', async () => {
  const response = await app.fetch(new Request('http://localhost/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nobody@example.com', password: 'wrong-password' }),
  }));
  expect(response.status).toBe(401);
});
