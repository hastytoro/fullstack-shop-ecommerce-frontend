import { useStateContext } from "../lib/context";

// Payment logic and posting to next backend api called stripe:
import axios from "axios";
import getStripe from "../lib/getStripe";

import { FiShoppingCart } from "react-icons/fi";
import { TiPlus, TiMinus } from "react-icons/ti";
// import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";

import styled from "styled-components";
import { motion } from "framer-motion";
// Animation variants allow us to enable `staggerChildren` to parent container.
// The main reason we create them is staggering. For example our parent Cards
// component can stagger each child Card under it.
// We can also use `layout` attribute in our parent for all child components.
// If true, it auto animates children to new positions when layout changes.
// Avoid a stretching affect by assigning `layout` to both parent and child.
// We also apply it outside to our button to ensure it flows nicely also.
const cards = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.4 },
  },
};
// Notice we don't need to setup `initial` and `animate` attributes in the child.
// As they are already defined in the parent variant it inherits from.
const card = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

import { toast } from "react-hot-toast";

export default function Cart() {
  const { cartItems, setShowCart, onAdd, onRemove, totalPrice } =
    useStateContext();

  // Payment fetching logic (consider axios):
  // We use the next api folder to handle the post request like a mini-express.
  const checkoutHandler = async () => {
    const stripePromise = await getStripe();
    const response = await axios({
      method: "post",
      url: "/api/stripe",
      data: cartItems,
    });
    toast.loading("Waiting...");
    await stripePromise.redirectToCheckout({ sessionId: response.data.id });
  };
  // const checkoutHandler = async () => {
  //   const stripePromise = await getStripe();
  //   const response = await fetch("/api/stripe", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(cartItems),
  //   });
  //   const data = await response.json();
  //   await stripePromise.redirectToCheckout({ sessionId: data.id });
  // };

  return (
    <CartWrapper
      onClick={() => setShowCart(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CartPopup
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "50%" }}
        animate={{ x: "0%" }}
        exit={{ x: "50%" }} // requires `AnimatePresence` in Navbar
        transition={{ type: "tween" }}
      >
        {cartItems.length < 1 && (
          <Empty
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
          >
            <h2>Your shopping cart is empty.</h2>
            <FiShoppingCart />
          </Empty>
        )}
        {/* parent variant */}
        <motion.div layout variants={cards} initial="hidden" animate="show">
          {cartItems.length >= 1 &&
            cartItems.map((item) => {
              return (
                <Card layout variants={card} key={item.slug}>
                  <img
                    src={item.image.data.attributes.formats.thumbnail.url}
                    alt={item.title}
                  />
                  <Info>
                    <h3>{item.title}</h3>
                    <p>{item.price}$</p>
                    <Quantity>
                      <span>Quantity</span>
                      <button>
                        <TiMinus onClick={() => onRemove(item, 1)} />
                      </button>
                      <p>{item.quantity}</p>
                      <button>
                        <TiPlus onClick={() => onAdd(item, 1)} />
                      </button>
                    </Quantity>
                  </Info>
                </Card>
              );
            })}
        </motion.div>
        {cartItems.length >= 1 && (
          <Checkout layout>
            <h3>Subtotal: {totalPrice}$</h3>
            <button onClick={checkoutHandler}>Purchase</button>
          </Checkout>
        )}
      </CartPopup>
    </CartWrapper>
  );
}

const CartWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  /* testing */
  backdrop-filter: blur(1px);
  // ...
  z-index: 100;
  display: flex;
  justify-content: flex-end;
`;

const CartPopup = styled(motion.div)`
  filter: drop-shadow(5px 5px 20px #494949);
  position: relative;
  background: var(--background);
  width: 30%;
  padding: 2rem 1rem;
  /* testing */
  /* padding: 2rem 0rem; */
  // ...
  overflow-y: scroll;
`;

const Card = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.5rem;
  /* testing */
  /* border-radius: 0rem; */
  // ...
  overflow: hidden;
  background: white;
  padding: 2rem;
  /* padding: 1rem; */
  margin: 2rem 0rem;
  img {
    width: 8rem;
  }
`;

const Info = styled(motion.div)`
  width: 60%;
  p {
    /* testing */
    color: var(--secondary);
    /* font-size: 0.8rem; */
  }
`;

const Quantity = styled(motion.div)`
  display: flex;
  align-items: center;
  margin: 0.5rem 0rem;
  button {
    background: transparent;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.1rem;
    padding: 0rem 0.5rem;
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

const Empty = styled(motion.div)`
  /* position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0%); */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    font-size: 1.5rem;
    padding: 2rem;
  }
  svg {
    font-size: 10rem;
  }
`;

const Checkout = styled(motion.div)`
  button {
    border: none;
    border-radius: 5px;
    width: 100%;
    background: var(--primary);
    color: white;
    font-weight: 500;
    padding: 1rem 2rem;
    margin-top: 2rem;
    cursor: pointer;
  }
`;
