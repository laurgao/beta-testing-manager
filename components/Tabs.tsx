import React from 'react'

const Tabs = ({tab, setTab, tabs}: {tab: string, setTab: any, tabs: string[]}) => {
    return (
        <div>
            {tabs.map(t => (
                <button 
                    className={`${t.toLowerCase()==tab ? "btm-text-gray-700 font-bold border-b-2 btm-gray-700-border" : "btm-text-gray-400 font-normal"} mr-6`}
                    onClick={() => setTab(t.toLowerCase())}
                    key={t}
                >{t}</button>
            ))}
        </div>
    )
}

export default Tabs
