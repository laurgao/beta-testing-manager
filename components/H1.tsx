const H1 = ({text, children, className} : {
    text?: string,
    children?: string,
    className?: string,
}) => {
    return (
        <h1 className={`text-4xl font-bold ${className && className}`}>{text || children}</h1>
    )
}

export default H1
