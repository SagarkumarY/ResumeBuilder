import React, { useState } from "react";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import { AnimatePresence, motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { HiLogout } from "react-icons/hi";
import { FadeInOutWithOpacity, slideUpDownMenu } from "../animation";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "react-query";
import { adminIds } from "../utils/helpers";

function Header() {
  const { data, isLoading, isError } = useUser();
  const [isMenu, setIsMenu] = useState(false);
  const queryClient = useQueryClient();

  const signoutUser = async () => {
      await auth.signOut().then(() =>{
        queryClient.setQueryData("user", null);
        // queryClient.invalidateQueries("user");
        // navigate("/", { replace: true });
      })
  };

  

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b  border-gray-300 bg-bgPrimary z-50 gap-12 sticky top-0">
      <Link to={"/"}>
        <img
          src={Logo}
          alt="header_logo "
          className=" w-12 h-auto object-contain"
        />
      </Link>
      {/* {"input"} */}
      <div className=" flex-1 border border-gray-300 px-4 py-1 rounded-b-md flex items-center justify-between bg-gray-300">
        <input
          type="text"
          className=" flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none"
          placeholder="Search here..."
        />
      </div>

      {/* {"Profile"} */}
      <AnimatePresence>
        {isLoading ? (
          <PuffLoader className="#498FCD" size={40} />
        ) : (
          <React.Fragment>
            {data ? (
              <motion.div   {...FadeInOutWithOpacity} className=" relative  cursor-pointer" onClick={()=>setIsMenu(!isMenu)}>
                {data?.photoURL ? (
                  <div className=" w-12 h-12 object-cover flex items-center  justify-center relative">
                    <img
                      src={data?.photoURL}
                      alt="profile"
                      className="w-full h-full object-cover rounded-md"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className=" w-12 h-12 object-cover flex items-center  justify-center relative bg-blue-700 shadow-md text-xl text-white cursor-pointer font-bold">
                    {data.displayName[0].toUpperCase()}
                  </div>
                )}

                {/* {"Dropdown menu start"} */}
                <AnimatePresence>
                  {isMenu && (
                    <motion.div {...slideUpDownMenu} className=" absolute px-4 py-3 rounded-md bg-white right-0 top-14 flex flex-col items-center justify-start gap-3 w-64 pt-12"
                    onMouseLeave={()=> setIsMenu(false)}
                    >
                      {data?.photoURL ? (
                        <div className=" w-20 h-20 object-cover flex items-center  justify-center  relative rounded-full">
                          <img
                            src={data?.photoURL}
                            alt="profile"
                            className="w-full h-full object-cover rounded-full"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className=" w-12 h-12 object-cover flex items-center  justify-center relative bg-blue-700 shadow-md text-xl text-white cursor-pointer font-bold">
                          {data.displayName[0].toUpperCase()}
                        </div>
                      )}

                      {data.displayName && (
                        <p className=" text-lg text-textDark">
                          {data.displayName}
                        </p>
                      )}

                      {/* {"Menu start"} */}
                      <div className=" w-full flex-col flex items-start gap-8 pt-6">
                        <Link
                          className=" whitespace-nowrap text-textLight hover:text-textDark text-base"
                          to={"/profile"}
                        >
                          My Account
                        </Link>

                        {adminIds.includes(data?.uid) && (
                          <Link
                          className=" whitespace-nowrap text-textLight hover:text-textDark text-base"
                          to={"/template/create"}
                        >
                          Add New Template
                        </Link>
                        )}

                        <div className=" w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer" onClick={signoutUser}>
                          <p className=" text-textLight group-hover:text-white">
                            Logout
                          </p>
                          <HiLogout className=" text-textLight  group-hover:text-textDark " />
                        </div>
                      </div>
                      {/* {"Menu end"} */}
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* {"Dropdown menu End"} */}
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button
                {...FadeInOutWithOpacity}
                className=" py-2 px-4 rounded-md border border-gray-300 bg-gray-300 hover:shadow-md active:scale-75 duration-150"
                >Login</motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
