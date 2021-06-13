import { ReactNode } from 'react'

// Precondition: gtc length = headers length

const Table = ({children, gtc, headers} : { children: ReactNode, gtc: string, headers: string[] }) => {
    const tableStyle = {
        gridTemplateColumns: gtc,
    }
    return (
        <div className="grid mb-4 items-center whitespace-nowrap overflow-x-hidden gap-1" style={tableStyle}>
            {headers.map((header, index) => (<p className="btm-text-gray-400 text-sm" key={index}>{header}</p>))}
            <hr className={`col-span-${gtc.split(" ").length} my-2`}/>
            {children}
        </div>
    )
}

export default Table
