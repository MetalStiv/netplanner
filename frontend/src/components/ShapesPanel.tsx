import React, { useState, useEffect } from 'react';
import { useRootStore } from '../providers/rootProvider';


const ShapesPanel: React.FC = () => {
    const userStore = useRootStore()?.getUserStore()



    return (
        <div id="shapesPanel">
            <ul>
                <li>Точка</li>
                <li>Линия</li>
                <li>Круг</li>
            </ul>
        </div>
    )
}

export default ShapesPanel;