import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { createWSClient, wsLink, createTRPCProxyClient } from '@trpc/client';
import { AppRouter, wss } from '..';


let wsClient: ReturnType<typeof createWSClient>;
let trpc: ReturnType<typeof createTRPCProxyClient<AppRouter>>;

beforeAll(() => {
  wsClient = createWSClient({ url: 'ws://localhost:3011' });

  trpc = createTRPCProxyClient<AppRouter>({
    links: [wsLink({ client: wsClient })],
  });
});

afterAll(() => {
  wsClient.close();
  wss.close();
});

describe('ping procedure over WebSocket', () => {
  it('returns the default “pong”', async () => {
    const result = await trpc.ping.query();
    expect(result).toBe('pong');
  });

  it('echoes any input it receives', async () => {
    const result = await trpc.ping.query('Vitest');
    expect(result).toBe('pong: Vitest');
  });
});
