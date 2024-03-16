export type TextSizeType =
    | "display1"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "button1"
    | "button2"
    | "button3"
    | "body1"
    | "body2"
    | "body3"
    | "body4"
    | "body5"
    | "body6"
    | "subtitle1"
    | "subtitle2"
    | "subtitle3"
    | "subtitle4"
    | "caption1"
    | "caption2";

interface AavegotchiTextBodyProps {
    size?: TextSizeType;
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
    color?: string;
}

const Text = ({ size = "body3", children, className, color = "text-white", inline = false }: AavegotchiTextBodyProps) => {
    const classes = `${inline ? "inline" : "block"} ${color} ${className} ${getTextsizes(
        size
    )} ${size.indexOf("body") === -1 && size.indexOf("subtitle") === -1 ? "uppercase" : ""}`;

    if (
        [
            "display1",
            "display2",
            "subtitle1",
            "subtitle2",
            "subtitle3",
            "subtitle4",
            "caption1",
            "caption2",
            "button1",
            "button2",
            "button3",
        ].includes(size) ||
        inline
    ) {
        return <div className={classes}>{children}</div>;
    } else if (["body1", "body2", "body3", "body4", "body5", "body6"].includes(size)) {
        return <p className={classes}>{children}</p>;
    }

    interface HeadingProps {
        children: React.ReactNode;
        className?: string;
    }

    const HeadingMap = {
        h1: (props: HeadingProps) => <h1 {...props} />,
        h2: (props: HeadingProps) => <h2 {...props} />,
        h3: (props: HeadingProps) => <h3 {...props} />,
        h4: (props: HeadingProps) => <h4 {...props} />,
        h5: (props: HeadingProps) => <h5 {...props} />,
        h6: (props: HeadingProps) => <h6 {...props} />,
    };

    if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(size)) {
        const Component = HeadingMap[size as keyof typeof HeadingMap] || HeadingMap.h1;
        if (Component) return <Component className={classes}>{children}</Component>;
    }

    return <p className={`${color} font-kanit font-light ${size} ${className}`}>{children}</p>;
};

const getTextsizes = (size: TextSizeType) => {
    const product = {
        display1: "text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black",
        h1: "text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold",
        h2: "text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold",
        h3: "text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold",
        h4: "text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold",
        h5: "text-sm md:text-sm lg:text-base xl:text-base 2xl:text-lg font-bold",
        h6: "text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base font-bold",
        button1: "text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold",
        button2: "text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-lg font-bold",
        button3: "text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-lg font-bold",
        body1: "text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-light",
        body2: "text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-light",
        body3: "text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-light",
        body4: "text-xs md:text-xs lg:text-sm xl:text-base 2xl:text-lg font-light",
        body5: "text-xs md:text-xs lg:text-xs xl:text-sm 2xl:text-base font-light",
        body6: "text-xs md:text-xs lg:text-xs xl:text-sm 2xl:text-sm font-light",
        subtitle1: "text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-normal",
        subtitle2: "text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-normal",
        subtitle3: "text-xs md:text-xs lg:text-sm xl:text-base 2xl:text-lg font-normal",
        subtitle4: "text-xs md:text-xs lg:text-xs xl:text-sm 2xl:text-base font-normal",
        caption1: "text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base font-light",
        caption2: "text-xs md:text-xs lg:text-xs xl:text-xs 2xl:text-sm font-light",
    };

    return product[size];
};

export default Text;
