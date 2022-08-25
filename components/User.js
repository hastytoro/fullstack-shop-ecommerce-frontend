import { FaUserCircle } from "react-icons/fa";

import { useRouter } from "next/router";
// The useUser hook gets you the UserProfile object from the server-side session
// by requesting it from the HandleProfile API Route handler.
// https://auth0.github.io/nextjs-auth0/modules/frontend_use_user.html
import { useUser } from "@auth0/nextjs-auth0";

import styled from "styled-components";

export default function User() {
  const route = useRouter();
  const { user, error, isLoading } = useUser();
  console.log(user);
  if (!user) {
    return (
      <div onClick={() => route.push(`/api/auth/login`)}>
        <FaUserCircle className="profile" />
        <h3>Login</h3>
      </div>
    );
  }
  return (
    <Profile onClick={() => route.push(`/profile`)}>
      <img src={user.picture} alt={user.name} />
      <h3>{user.name}</h3>
    </Profile>
  );
}

const Profile = styled.div`
  img {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
  }
`;
