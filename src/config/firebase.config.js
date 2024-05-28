// Import necessary Firebase modules
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Firebase configuration object using environment variables
const firebaseConfig = {
  apiKey:import.meta.env.VITE_API_KEY,
  authDomain:import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};




// Initialize Firebase app if it hasn't been initialized already
// This prevents reinitialization in case of hot-reloading in development
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the initialized services for use in other parts of the application
export { auth, db , storage};








// import React from "react";
// import { FaChevronRight } from "react-icons/fa6";
// import { GoogleAuthProvider,GithubAuthProvider ,signInWithRedirect} from "firebase/auth";
// import { auth } from "../config/firebase.config";

// function AuthButtonWithProvider({ Icon, label, provider }) {
//   const googleAuthProvider = new GoogleAuthProvider();
//   const githubAuthProvider = new GithubAuthProvider();
//   const handleClick = async () => {
//     switch (provider) {
//       case "GoogleAuthProvider":
//        await signInWithRedirect(auth,GoogleAuthProvider)
//         break
//       case "GithubAuthProvider":
//         console.log("github signin provider is click");
//         break;
//       default:
//         console.log("default signin provider is click");
//         break;
//     }
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="w-full px-4 py-3 rounded-md border-2  border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md"
//     >
//       <Icon className=" text-textPrimary text-xl group-hover:text-white" />
//       <p className=" text-textPrimary text-xl group-hover:text-white">
//         {label}
//       </p>
//       <p>
//         <FaChevronRight className=" text-textPrimary text-base group-hover:text-white" />
//       </p>
//     </div>
//   );
// }

// export default AuthButtonWithProvider;
