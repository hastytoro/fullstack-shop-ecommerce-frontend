import { useRouter } from "next/router";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import styled from "styled-components";

import formatMoney from "../lib/formatMoney";

const stripe = require("stripe")(
  `${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`
);

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const session = getSession(ctx.req, ctx.res);
    const stripeId = session.user[`${process.env.BASE_URL}/stripe_customer_id`];
    const paymentIntent = await stripe.paymentIntents.list({
      customer: stripeId,
    });
    return { props: { orders: paymentIntent.data } };
  },
});

export default function Profile({ user, orders }) {
  const route = useRouter();
  return (
    user && (
      <ProfileWrapper>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <div>
          {orders.map((order) => (
            <Order key={order.id}>
              <h3>
                Order number: <span>{order.id}</span>
              </h3>
              <h3>
                Amount: <span>{formatMoney(order.amount)}</span>
              </h3>
              <h3>
                Receipt: <span>{user.email}</span>
              </h3>
            </Order>
          ))}
        </div>
        <button onClick={() => route.push("/api/auth/logout")}>Logout</button>
      </ProfileWrapper>
    )
  );
}

const ProfileWrapper = styled.div`
  button {
    border: none;
    border-radius: 5px;
    background: var(--primary);
    color: white;
    font-weight: bold;
    padding: 1rem 2rem;
    margin-top: 1rem;
    cursor: pointer;
    &:hover {
      background: hsla(0, 0%, 18%, 0.9);
    }
  }
  margin-bottom: 5vh; /* temp space for footer */
`;

const Order = styled.div`
  border-radius: 5px;
  background: white;
  padding: 3rem;
  margin: 2rem 0rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1,
  h2 {
    font-size: 1rem;
  }
  span {
    font-weight: lighter;
  }
`;
