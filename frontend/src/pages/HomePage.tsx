import React from "react";
import { useNavigate } from "react-router-dom";
import { useRootStore } from "../providers/rootProvider";
import { observer } from "mobx-react-lite"

const HomePage: React.FC = observer(() => {
    const navigate = useNavigate()
    const userStore = useRootStore()?.getUserStore()

    return (
        <>
            <p>{userStore?.getData()?.name}</p>
            <button onClick={() => navigate('../project')}>To project X</button>
        </>
    );
})

export default HomePage;
