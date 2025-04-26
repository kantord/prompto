import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';

const appRouter = router({
  ping: publicProcedure
    .input(z.string().optional())
    .query(async ({ input }) => {
      return `pong${input ? `: ${input}` : ''}`;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;


const server = createHTTPServer({
  router: appRouter,
});
 
server.listen(3011);
