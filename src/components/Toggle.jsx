import React, { useState } from 'react';
import {
    motion,
} from "framer-motion";
import styled from 'styled-components';


const ToggleContainer = styled(motion.div)`
    position: flex;
    margin-left: 16px;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: "rgb(255, 0, 0)";
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ToggleBackground = styled(motion.div)`
    width: 54px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0.4);
    display: flex;
    justify-content: flex-start;
    border-radius: 50px;
    padding: 10px;
    cursor: pointer;
`;

const ToggleCircle = styled(motion.div)`
	width: 24px;
    height: 24px;
    margin-top: -7px;
    margin-left: -6px;
    background-color: white;
    border-radius: 40px;
`;

export const Toggle = ({setActive, isActive}) => {
	
    const [toggleDirection, setToggleDirection] = useState(isActive ? 20 : 0)

    const toggleOn = () => {
		setActive(toggleDirection === 0)
        setToggleDirection(toggleDirection === 0 ? 20 : 0)
    }


    return (
        <ToggleContainer>
            <ToggleBackground
                onTap={toggleOn}
                style={{
                    background: isActive ? "rgb(74,222,128)" : "rgb(209,213,219)"
                }}
            >
                <ToggleCircle 
                    onTap={toggleOn}
                    animate={{
                        //x: toggleDirection
                        x: isActive ? 20 : 0
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 700,
                        damping: 30
                    }}
                    style={{
                        background: "#fff"
                    }}
                />
            </ToggleBackground>
        </ToggleContainer>
    )
}