import React from "react";
import "../styles/user.scss";
import Project from "../module/projectCard/Project";
import { useRootStore } from "../providers/rootProvider";

const UserPage: React.FC = () => {
    const userStore = useRootStore()?.getUserStore()

    return (
        <div id="userPage">
            <main>
                <div className="leftMenu">
                    <div className="iconUser"></div>
                    <div className="frame">
                        
                            <div className="work"></div>
                            <div className="book"></div>
                        
                            <div className="setting"></div>
                       
                    </div>
                    <div className="logout"></div>
                </div>
                <div className="startMenu">
                    
                    <div className="text">Start a new project</div>
                    <button type="submit">+</button>
                </div>
                <Project/>
            </main>
        </div>
        
    );
}
export default UserPage;