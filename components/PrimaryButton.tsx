import Button from './Button'

const PrimaryButton = ({onClick, children, href, isLoading, isDisabled, className} : {
    onClick?: any,
    children: string,
    href?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    className?: string,
}) => {
    return (
        <Button 
            onClick={onClick}
            href={href} 
            isLoading={isLoading} 
            isDisabled={isDisabled}
            className={`bg-primary text-white ${className && className}`}
        >{children}</Button>
    )
}

export default PrimaryButton
