import React, { ReactNode } from 'react'

// Precondition: gtc length = headers length

const Table = ({children, gtc, headers} : { children: ReactNode, gtc: string, headers: string[] }) => {
    const tableStyle = {
        gridTemplateColumns: gtc,
    }
    return (
        <div className="grid mt-8 mb-4 items-center" style={tableStyle}>
            {headers.map(header => (<p className="opacity-40">{header}</p>))}
            <hr className={`col-span-${gtc.split(" ").length} my-2`}/>
            {children}
        </div>
    )
}

export default Table
