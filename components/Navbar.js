import Link from "next/link";

import { FiShoppingBag } from "react-icons/fi";
import styled from "styled-components";

import Cart from "./Cart";
import User from "./User";

// The useUser hook gets you the UserProfile object from the server-side session
// by requesting it from the HandleProfile API Route handler.
// https://auth0.github.io/nextjs-auth0/modules/frontend_use_user.html

import { useStateContext } from "../lib/context";

// AnimatePresence enables animation for components that are tree removed.
// When adding/removing more a child they must have given a unique key prop.
// Now `motion` components that have an `exit` will animate out when removed.
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { showCart, setShowCart, totalQty } = useStateContext();
  return (
    <Nav>
      <Link href={"/"}>Superdry+</Link>
      <NavItems>
        <User />
        <div onClick={() => setShowCart(true)}>
          {totalQty > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: { type: "spring", duration: 0.3 },
              }}
            >
              {totalQty}
            </motion.span>
          )}
          <FiShoppingBag />
          <h3>Cart</h3>
        </div>
      </NavItems>
      <AnimatePresence>{showCart && <Cart />}</AnimatePresence>
    </Nav>
  );
}

const Nav = styled.nav`
  min-height: 15vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    font-size: 1.2rem;
  }
`;

const NavItems = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  div {
    margin-left: 3rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h3 {
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    padding: 0.25rem;
  }
  svg {
    cursor: pointer;
    font-size: 2rem;
    color: var(--secondary);
  }
  span {
    position: absolute;
    top: -20%;
    right: -10%;
    background: var(--special);
    color: white;
    width: 1.3rem;
    height: 1.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid var(--special);
    border-radius: 50%;
    font-size: 0.7rem;
    padding: 0.5rem;
    pointer-events: none;
    filter: drop-shadow(0px 0px 0.5rem var(--special));
  }
`;
