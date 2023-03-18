import { logout } from "../login"
import { useNavigate } from "react-router-dom";
import { useRootStore } from "../../providers/rootProvider";
import { TRootStore } from "../../stores/rootStore";

const useLogout = () => {
    const navigate = useNavigate();
    const rootStore: TRootStore = useRootStore();
    
    return () => {
        logout();
        rootStore!.clearStore()
        navigate('/');
    }
}

export default useLogout;