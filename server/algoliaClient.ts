import { algoliasearch } from "algoliasearch";

if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) {
  throw new Error("NEXT_PUBLIC_ALGOLIA_APP_ID is not defined");
}

if (!process.env.ALGOLIA_ADMIN_API_KEY) {
  throw new Error("ALGOLIA_ADMIN_API_KEY is not defined");
}

export const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);
