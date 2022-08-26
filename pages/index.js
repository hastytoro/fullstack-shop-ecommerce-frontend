import Head from "next/head";

import Product from "../components/Product";

import { useQuery } from "urql";
import { PRODUCT_QUERY } from "../lib/query";

import styled from "styled-components";

export default function Home() {
  // Fetch from `strapi` with `urql` and graphql query:
  const [results] = useQuery({ query: PRODUCT_QUERY });
  const { data, fetching, error } = results;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no! {error.message}</p>;

  const products = data.products.data;

  return (
    <div>
      <Head>
        <title>Superdry+ Homepage</title>
        <meta name="description" content="Our next app represents Superdry" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Gallery>
          {products.map((product) => (
            <Product key={product.attributes.slug} product={product} />
          ))}
        </Gallery>
      </main>
    </div>
  );
}

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-gap: 1.5rem;
  margin-bottom: 5vh; /* temp space for footer */
`;
