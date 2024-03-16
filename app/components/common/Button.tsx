import Text from "./Text";

interface ButtonProps {
    text: string;
    onClick?: () => void;
}

const Button = ({ text, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick} className="self-end rounded-lg bg-[#4c84ff] px-5 py-2">
            <Text size="body4" className="uppercase">
                {text}
            </Text>
        </button>
    );
};

export default Button;
