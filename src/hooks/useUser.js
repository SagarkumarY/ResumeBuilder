import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getUserDetail } from "../api";

const useUser = () => {
    const { data, isLoading, refetch, isError } = useQuery(
        "user",
        async () => {
            try {
                const userDetail = await getUserDetail();
                return userDetail;
            } catch (error) {
                if (!error.message.includes("not authenticated")) {
                    toast.error("Something went wrong..");
                }
                // Throw the error so that react-query can handle the error state
                throw error;
            }
        },
        { refetchOnWindowFocus: false }
    );

    return { data, isLoading, refetch, isError };
}

export default useUser;
