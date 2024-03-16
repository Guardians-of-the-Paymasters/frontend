"use client";

import { useEffect, useState } from "react";

const useMountedAndHover = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const hoverHandlers = {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };

    return { isMounted, isHovered, hoverHandlers };
};

export default useMountedAndHover;
