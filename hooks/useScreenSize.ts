"use client"

import { useState, useEffect } from "react";

const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
        width: 1920,
        height: 1080,
    });

    useEffect(() => {
        setScreenSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        // Cleanup khi unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return screenSize;
};

export default useScreenSize;