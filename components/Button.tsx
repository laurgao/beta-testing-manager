const Button = ({onClick, text}) => {
    return (
        <button
            className="button primary"
            onClick={onClick}
        >
            
            <div className="flex items-center">
                <span>{text}</span>
            </div>
        </button>
    )
}

export default Button
