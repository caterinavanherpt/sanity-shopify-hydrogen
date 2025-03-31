import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

export async function loader({
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  const {product} = await storefront.query<{product: Product}>(
    `#graphql
      query Product($handle: String!) {
        product(handle: $handle) { id title }
      }
    `,
    {
      variables: {handle: params.handle},
    },
  );

  return json({product});
}

export default function Page() {
  const {product} = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto p-12 prose prose-xl prose-a:text-blue-500">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <Link to="/products">&larr; Back to All Products</Link>
    </div>
  );
}