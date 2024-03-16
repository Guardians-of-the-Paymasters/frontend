import Text from "./Text";
type InputType =
    | "text"
    | "number"
    | "email"
    | "password"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "datetime-local"
    | "month"
    | "week"
    | "time"
    | "color"
    | "range"
    | "checkbox"
    | "radio"
    | "file"
    | "submit"
    | "image"
    | "reset"
    | "button"
    | "textarea";

interface FormProps {
    title: string;
    placeholder: string;
    type?: InputType;
}

const Form = ({ title, placeholder, type = "text" }: FormProps) => {
    const renderInput = () => {
        if (type === "textarea") {
            return (
                <textarea
                    placeholder={placeholder}
                    className="h-40 w-3/5 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-2 text-white outline-none placeholder:text-zinc-600 active:border-zinc-500"
                />
            );
        }
        return (
            <input
                type={type}
                placeholder={placeholder}
                className="w-3/5 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-2 text-white outline-none placeholder:text-zinc-600 active:border-zinc-500"
            />
        );
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
