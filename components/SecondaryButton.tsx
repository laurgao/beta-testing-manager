import Button from './Button'

const SecondaryButton = ({onClick, children, href, isLoading, isDisabled} : {
    onClick?: any,
    children: any, // string or JSX tags
    href?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
}) => {
    return (
        <div className = "btm-gray-500-border btm-text-gray-500 btm-hover-bg-gray-500 hover:text-white">
            <Button 
                onClick={onClick}
                href={href} 
                isLoading={isLoading} 
                isDisabled={isDisabled}
            >{children}</Button>
        </div>
    )
}

export default SecondaryButton
