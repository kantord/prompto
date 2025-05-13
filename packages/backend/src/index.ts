import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';                   // ✅ ESM-safe
import { publicProcedure, router } from './trpc';
import { z } from 'zod';

export const wss = new WebSocketServer({
  port: 3011,
});

const appRouter = router({
  ping: publicProcedure
    .input(z.string().optional())
    .query(async ({ input }) => {
      return `pong${input ? `: ${input}` : ''}`;
    }),
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  // Enable heartbeat messages to keep connection open (disabled by default)
  keepAlive: {
    enabled: true,
    // server ping message interval in milliseconds
    pingMs: 30000,
    // connection is terminated if pong message is not received in this many milliseconds
    pongWaitMs: 5000,
  },
});



// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;


console.log('✅ WebSocket Server listening on ws://localhost:3011');
