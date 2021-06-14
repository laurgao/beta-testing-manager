import { ReactNode } from 'react'
import Truncate from './Truncate'

// Precondition: gtc length = headers length

const Table = ({children, gtc, headers} : { children: ReactNode, gtc: string, headers: string[] }) => {
    const tableStyle = {
        gridTemplateColumns: gtc,
    }
    return (
        <div className="grid mb-4 items-center whitespace-nowrap overflow-x-hidden gap-x-2" style={tableStyle}>
            {headers.map((header, index) => (<Truncate className="btm-text-gray-400 text-sm" key={index}>{header}</Truncate>))}
            <hr className={`col-span-${gtc.split(" ").length} my-2`}/>
            {children}
        </div>
    )
}

export default Table
