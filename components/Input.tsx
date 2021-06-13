const Input = ({value, setValue, id="", placeholder=""} : {
    value: string,
    setValue: any,
    id?: string,
    placeholder?: string,
}) => {
    return (
        <input
            type="text"
            className="border-b w-full content my-2 py-2"
            placeholder={placeholder}
            value={value}
            id={id}
            onChange={e => setValue(e.target.value)}
        />
    )
}

export default Input
