import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { createWSClient, wsLink, createTRPCProxyClient } from '@trpc/client';
import type { AppRouter } from '../src/index';
import { wss } from '..';


let wsClient: ReturnType<typeof createWSClient>;
let trpc: ReturnType<typeof createTRPCProxyClient<AppRouter>>;

beforeAll(() => {
  // 1  Create a raw WS client that talks to our dev server
  wsClient = createWSClient({ url: 'ws://localhost:3011' });

  // 2  Wrap it in a tRPC proxy so we can call procedures
  trpc = createTRPCProxyClient<AppRouter>({
    links: [wsLink({ client: wsClient })],
  });
});

afterAll(() => {
  // ⚠️  Without this Vitest would keep running because of open handles
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
