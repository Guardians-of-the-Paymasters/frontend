import Text from "./Text";

type InputType = "text" | "number" | "textarea" | "datetime-local";

interface FormProps {
    title: string;
    placeholder: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    textAreaOnChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    type?: InputType;
    className?: string;
}

const Form = ({ title, placeholder, onChange, textAreaOnChange, type = "text", className }: FormProps) => {
    const classes = `w-3/5 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-2 text-white outline-none placeholder:text-zinc-600 active:border-zinc-500 ${className}`;

    const renderInput = () => {
        if (type === "textarea") {
            return <textarea onChange={textAreaOnChange} placeholder={placeholder} className={`h-40 ${classes}`} />;
        }
        return <input type={type} onChange={onChange} placeholder={placeholder} className={classes} />;
    };

    return (
        <div className="flex flex-col gap-2.5">
            <Text size="caption1" className="uppercase text-white">
                {title}
            </Text>
            {renderInput()}
        </div>
    );
};

export default Form;
