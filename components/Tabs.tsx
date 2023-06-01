import { Dispatch, SetStateAction } from "react";

const Tabs = ({ state, setState, displayedTabs, className, possibleStates = ["dashboard", "users", "updates"] }: { state: string, setState: Dispatch<SetStateAction<string>>, displayedTabs: string[], className?: string, possibleStates?: string[] }) => {

    function getTabStateValue(displayedTab: string) {
        for (let possibleState of possibleStates) {
            if (displayedTab.toLowerCase().includes(possibleState)) {
                return possibleState;
            }
        }
        return "";
    }

    return (
        <>
            {displayedTabs.map(t => (
                <button
                    className={`focus:outline-none ${t.toLowerCase().includes(state) ? "btm-text-gray-700 font-bold border-b-2 btm-gray-700-border" : "btm-text-gray-400 font-normal"} ${className && className} mr-6`}
                    onClick={() => setState(getTabStateValue(t))}
                    key={t}
                >{t}</button>
            ))}
        </>
    )
}

export default Tabs
