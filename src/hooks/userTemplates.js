import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getTemplates } from "../api";


const useTemplates = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "templates",
        async () => {
            try {
                const templates = await getTemplates();
                return templates;
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

    return { data, isLoading, isError, refetch };
}

export default useTemplates;