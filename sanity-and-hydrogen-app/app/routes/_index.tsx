import {Link} from '@remix-run/react';

export default function Index() {
  return (
    <div className="mx-auto p-12 prose prose-xl prose-a:text-blue-500">
      <h1 className="text-3xl font-bold">Home</h1>
      <p>
        <Link className="text-blue-500 underline" to="/products">
          All Products
        </Link>
      </p>
    </div>
  );
}