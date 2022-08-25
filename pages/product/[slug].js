import { useEffect } from "react";
import { useRouter } from "next/router";

import { useQuery } from "urql";
import { GET_PRODUCT_QUERY } from "../../lib/query";

// import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { TiPlus, TiMinus } from "react-icons/ti";
import styled from "styled-components";

import { useStateContext } from "../../lib/context";

import toast from "react-hot-toast";

export default function SlugDetail() {
  // Use "consume" context state:
  const { qty, setQty, increaseQty, decreaseQty, onAdd } = useStateContext();
  // Reset qty when page mounts:
  useEffect(() => setQty(1), []);

  // Fetch slug from the url with useRouter hook.
  const { query } = useRouter();
  // Fetch from `strapi` with `urql` and graphql query:
  const [results] = useQuery({
    query: GET_PRODUCT_QUERY,
    variables: { slug: query.slug },
  });

  const { data, fetching, error } = results;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no! {error.message}</p>;

  // Extract our data from the graphql backend query:
  const product = data.products.data[0].attributes;
  const { title, description, image } = product;
  const imgUrl = image.data.attributes.formats.medium.url;

  // Create a toast :)
  const notify = () => {
    toast.success(`${title} added!`, { duration: 1500 });
  };

  return (
    <DetailWrapper>
      <img src={imgUrl} alt={title} />
      <DetailInfo>
        <h3>{title}</h3>
        <p>{description}</p>
        <Quantity>
          <span>Quantity</span>
          <button onClick={decreaseQty}>
            <TiMinus />
          </button>
          <p>{qty}</p>
          <button onClick={increaseQty}>
            <TiPlus />
          </button>
        </Quantity>
        <Buy
          onClick={() => {
            onAdd(product, qty);
            notify();
          }}
        >
          Add to cart
        </Buy>
      </DetailInfo>
    </DetailWrapper>
  );
}

const DetailWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5rem;
  img {
    width: 40%;
  }
`;

const DetailInfo = styled.div`
  width: 40%;
  p {
    margin: 0.5rem 0rem;
  }
  button {
    font-size: 1rem;
    font-weight: medium;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
`;

const Quantity = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0rem;
  button {
    background: transparent;
    border: none;
    display: flex;
    font-size: 1.5rem;
  }
  p {
    width: 1rem;
    text-align: center;
  }
  span {
    color: var(--secondary);
  }
  svg {
    color: var(--lightgray);
  }
`;

const Buy = styled.button`
  border: none;
  border-radius: 5px;
  width: 100%;
  background: var(--primary);
  color: white;
  font-weight: 500;
`;
