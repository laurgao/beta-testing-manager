import React from 'react'

const Tabs = ({tab, setTab, tabs, className}: {tab: string, setTab: any, tabs: string[], className?: string}) => {
    return (
        <>
            {tabs.map(t => (
                <button 
                    className={`focus:outline-none ${t.toLowerCase()==tab ? "btm-text-gray-700 font-bold border-b-2 btm-gray-700-border" : "btm-text-gray-400 font-normal"} ${className && className} mr-6`}
                    onClick={() => setTab(t.toLowerCase())}
                    key={t}
                >{t}</button>
            ))}
        </>
    )
}

export default Tabs
