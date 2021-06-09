import Button from './Button'

const Breadcrumb = ({onClick, children, href, isLoading, isDisabled} : {
    onClick?: any,
    children: string,
    href?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
}) => {
    return (
        <div className = "btm-text-gray-500 font-bold">
            <Button 
                onClick={onClick}
                href={href} 
                isLoading={isLoading} 
                isDisabled={isDisabled}
            >{children}</Button>
        </div>
    )
}

export default Breadcrumb
