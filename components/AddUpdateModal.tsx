import axios from 'axios';
import React, { useEffect, useState } from 'react'
import H1 from './H1'
import UpModal from './UpModal'
import PrimaryButton from "./PrimaryButton"

const AddUpdateModal = ({addUpdateOpen, setAddUpdateOpen, updateUserId, setUpdateUserId, selectionTemplates, users, projectId}, setIter: {
        addUpdateOpen: any,
        setAddUpdateOpen: any,
        updateUserId: string,
        setUpdateUserId?: any,
        selectionTemplates: any
        users?: any,
        projectId: string,
        setIter: any
    }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [updateName, setUpdateName] = useState<string>("");
    
    // create a state variable for the value of every selection template
    const [selectionValues, setSelectionValues] = useState([])

    useEffect(() => {
        selectionTemplates && selectionTemplates.data && setSelectionValues(selectionTemplates.data.map(s => (
            {
                templateId: s._id,
                selected: "",
            }
        )))
    }, [selectionTemplates]); // make a type for this

    function handleAddUpdate() {
        setIsLoading(true);

        axios.post("/api/update", {
            name: updateName,
            userId: updateUserId,
            projectId: projectId
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                console.log(res.data);
                selectionValues && selectionValues.map(s => (
                    axios.post("/api/selection", {
                        projectId: projectId,
                        noteId: res.data.id,
                        templateId: s.templateId,
                        selected: s.selected,
                        userId: updateUserId,
                    }).then(r => {
                        if (r.data.error) {
                            setIsLoading(false);
                            console.log(`Error: ${r.data.error}`);
                        } else {
                            setAddUpdateOpen(false);
                            setIsLoading(false);
                            // setIter(iter + 1); errors out rip - runtime error: cannot read "data" of undefined
                            setUpdateName("");
                            console.log(r.data);
                        }
                    }).catch(e => {
                        setIsLoading(false);
                        console.log(e);
                    })
                ))
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }


    return (
        <UpModal isOpen={addUpdateOpen} setIsOpen={setAddUpdateOpen} wide={true}>
            <H1 text="New update"/>
            <div className="my-12">
                {users ? (
                    <>
                        <h3>User</h3>
                        <select
                            className={`border-b w-full content my-2 py-2 ${!updateUserId && "opacity-30"}`}
                            value={updateUserId}
                            onChange={e => setUpdateUserId(e.target.value)}
                            placeholder="Choose a user"
                        >
                            <option value="">Choose a user</option>
                            {users.data.length ? users.data.map(u => (
                                <option 
                                    key={u._id}
                                    value={u._id}
                                >{u.name}</option>
                            )) : (
                                <p>No users</p>
                            )}
                        </select>
                    </>
                ) : (
                    <h3>Add an update for {updateUserId}</h3>
                )}
            </div>

            <div className="my-12">
                <h3 className="up-ui-title">Name</h3>
                <input
                    type="text"
                    className="border-b w-full content my-2 py-2"
                    placeholder="Check in 2"
                    value={updateName}
                    id="update-name-field" 
                    onChange={e => setUpdateName(e.target.value)}
                />
            </div>
            {selectionTemplates && selectionTemplates.data && selectionValues.length && selectionTemplates.data.map(s => (
                <div className="my-12" key={s._id}>
                    <h3>{s.question}</h3>
                    <select
                        className={`border-b w-full content my-2 py-2 ${selectionValues.filter((sv) => sv.templateId == s._id)[0].selected == "" && "opacity-30"}`}
                        value={selectionValues.filter((sv) => sv.templateId == s._id)[0].selected}
                        onChange={e => setSelectionValues([
                            ...selectionValues.filter((sv) => sv.templateId != s._id), {
                                templateId: s._id,
                                selected: e.target.value,
                            }
                        ])}
                    >
                        <option value="">Choose a value</option>
                        {s.options.map(o => (
                            <option
                                value={o}
                            >{o}</option>
                        ))}
                    </select>
                </div>
            ))}
            <PrimaryButton
                onClick={handleAddUpdate}
                isLoading={isLoading}
                isDisabled={!(updateUserId && updateName)}
            >
                Create
            </PrimaryButton>
        </UpModal>
    )
}

export default AddUpdateModal
