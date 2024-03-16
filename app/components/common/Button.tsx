import Text from "./Text";

interface ButtonProps {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

const Button = ({ text, onClick, disabled }: ButtonProps) => {
    return (
        <button disabled={disabled} onClick={onClick} className={`self-end rounded-lg bg-[#4c84ff] px-5 py-2 ${disabled && "bg-zinc-500"}`}>
            <Text size="body4" className="uppercase">
                {text}
            </Text>
        </button>
    );
};

export default Button;
