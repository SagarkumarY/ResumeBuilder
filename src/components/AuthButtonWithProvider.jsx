import React from "react";
// import PropTypes from "prop-types";
import { FaChevronRight } from "react-icons/fa6";
import { GoogleAuthProvider, GithubAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../config/firebase.config";

// Pre-initialize the auth providers outside the component to avoid reinitialization on every render
const googleAuthProvider = new GoogleAuthProvider();
const githubAuthProvider = new GithubAuthProvider();

function AuthButtonWithProvider({ Icon, label, provider }) {
  // Handle click event for the auth button
  const handleClick = async () => {
    switch (provider) {
      case "GoogleAuthProvider":
        // Sign in with Google
        await signInWithRedirect(auth, googleAuthProvider)
        .then((result) =>{
          console.log(result)
        }).catch((err) =>{
          console.log("ERROR:", err.message)
        });
        break;
      case "GithubAuthProvider":
        // Sign in with GitHub
        await signInWithRedirect(auth, githubAuthProvider);
        console.log("Signing in with GitHub")
        break;
      default:
        console.log("Unknown signin provider clicked");
        break;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full px-4 py-3 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md"
    >
      <Icon className="text-textPrimary text-xl group-hover:text-white" />
      <p className="text-textPrimary text-xl group-hover:text-white">
        {label}
      </p>
      <FaChevronRight className="text-textPrimary text-base group-hover:text-white" />
    </div>
  );
}

// Define PropTypes for type checking
// AuthButtonWithProvider.propTypes = {
//   Icon: PropTypes.elementType.isRequired, // Ensure Icon is a valid React component
//   label: PropTypes.string.isRequired, // Label for the button
//   provider: PropTypes.oneOf(["GoogleAuthProvider", "GithubAuthProvider"]).isRequired // Provider type
// };

export default AuthButtonWithProvider;
