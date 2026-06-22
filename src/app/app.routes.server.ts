import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // The demo routes render ag-grid, which depends on browser-only APIs and
    // cannot be prerendered/SSR'd. Keep the SSR pipeline (server.ts, express,
    // hydration) but render route content on the client.
    path: '**',
    renderMode: RenderMode.Client,
  },
];
