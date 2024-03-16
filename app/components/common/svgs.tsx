import useMountedAndHover from "@/app/hooks/useMounted";

export const ArrowDownSvg = ({ className = "" }) => {
    const { isMounted } = useMountedAndHover();

    if (!isMounted) return null;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 9" fill="none" className={className}>
            <path
                stroke="#FFFFFF"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.6}
                d="m16.68.87-6.52 6.52c-.77.77-2.03.77-2.8 0L.84.87"
            />
        </svg>
    );
};
