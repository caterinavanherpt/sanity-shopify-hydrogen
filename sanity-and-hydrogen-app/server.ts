// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {createAppLoadContext} from '~/lib/context';
import {createSanityLoader} from 'hydrogen-sanity';
import { createWithCache } from '@shopify/hydrogen';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const appLoadContext = await createAppLoadContext(
        request,
        env,
        executionContext,
      );
        // (Prerequisite) If not already initialized, create a `withCache` handler...
        const withCache = createWithCache({cache, waitUntil, request})

        // 1. Configure the Sanity Loader and preview mode
        const sanity = createSanityLoader({
          // Required:
          withCache,
          
          // Required:
          // Pass configuration options for Sanity client or an instantialized client
          client: {
            projectId: env.SANITY_PROJECT_ID,
            dataset: env.SANITY_DATASET,
            apiVersion: env.SANITY_API_VERSION || '2023-03-30',
            useCdn: process.env.NODE_ENV === 'production',
          },
      })


      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          appLoadContext,
          withCache,
          sanity,
        }),
      });

      const response = await handleRequest(request);

      if (appLoadContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await appLoadContext.session.commit(),
        );
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: appLoadContext.storefront,
        });
      }

      return response;

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
