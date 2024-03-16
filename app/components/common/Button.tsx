import Text from "./Text";

interface ButtonProps {
    text: string;
}

const Button = ({ text }: ButtonProps) => {
    return (
        <button className="self-end rounded-lg bg-[#4c84ff] px-5 py-2">
            <Text size="body4" className="uppercase">
                {text}
            </Text>
        </button>
    );
};

export default Button;
