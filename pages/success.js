import { useRouter } from "next/router";

import styled from "styled-components";

import Image from "next/image";
import success from "../public/success.png";
import { motion } from "framer-motion";

const stripe = require("stripe")(
  `${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`
);
// By exporting a function getServerSideProps we perform (Server-Side Rendering)
// from a page, Next.js will pre-render the page on each request, using the data
// returned by getServerSideProps. getServerSideProps returns JSON which will be
// used to render the page. All this work will be handled automatically by Next,
// so you don’t need to do anything extra as long as you have it defined.
// https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
export async function getServerSideProps(params) {
  // console.log(params.query);
  // Fetch data from external API:
  const data = await stripe.checkout.sessions.retrieve(
    params.query.session_id,
    { expand: ["line_items"] }
  );
  // Pass data to the page via props
  return { props: { data } };
}

export default function Success({ data }) {
  const route = useRouter();
  // console.log(data);
  return (
    <Wrapper>
      <Card
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75 }}
      >
        <h1>Thank you for your order!</h1>
        <h4>A confirmation email has been sent to:</h4>
        <h4>{data.customer_details.email}</h4>

        <OrderWrapper>
          <Address>
            <h4>Address</h4>
            {Object.entries(data.customer_details.address).map(
              ([key, value]) => (
                <p key={key}>
                  {key} : {value}
                </p>
              )
            )}
          </Address>
          <Info>
            <h4>Products</h4>
            {data.line_items.data.map((item) => (
              <div key={item.id}>
                <p>
                  {item.description} (Qty: {item.quantity})
                </p>
                <p>Price : {item.price.unit_amount / 100}$ per unit.</p>
              </div>
            ))}
          </Info>
        </OrderWrapper>
        <button onClick={() => route.push("/")}>Continue shopping</button>
        <ImageWrapper
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Image src={success} alt="success" />
        </ImageWrapper>
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  /* margin: 1rem 15rem; */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
`;

const Card = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: white;
  border-radius: 2rem;
  padding: 2rem;
  width: 40%;
  h1 {
    margin: 0.5rem 0rem;
  }
  h3,
  h4 {
    font-weight: normal;
    margin: 0.5rem 0rem;
  }
  button {
    border: none;
    border-radius: 5px;
    width: 100%;
    background: var(--primary);
    color: white;
    font-weight: bold;
    padding: 1rem 2rem;
    margin-top: 1rem;
    cursor: pointer;
  }
  box-shadow: rgba(104, 104, 104, 0.18) 0px 2px 4px;
`;

const OrderWrapper = styled.div`
  display: flex;
  justify-content: center;
  background: rgba(210, 210, 210, 0.1);
  border-radius: 2px;
  margin: 2rem 1rem;
  padding: 1rem 2rem;
  width: 100%;
`;
const Address = styled.div`
  flex: 1;
  h4 {
    font-weight: normal;
  }
  p {
    line-height: 1.6rem;
    font-weight: lighter;
    font-size: 0.75rem;
  }
`;
const Info = styled.div`
  border-left: 1px solid rgb(210, 210, 210);
  padding-left: 2rem;
  flex: 2;
  h4 {
    font-weight: normal;
  }
  p {
    line-height: 1.6rem;
    font-weight: lighter;
    font-size: 0.75rem;
  }
  div {
    padding-bottom: 1rem;
  }
`;

const ImageWrapper = styled(motion.div)`
  position: absolute;
  width: 15rem;
  bottom: 2rem;
  right: -8rem;
`;
