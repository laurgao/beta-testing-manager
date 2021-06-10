import axios from 'axios';
import React, { useState } from 'react'
import H1 from './H1'
import UpModal from './UpModal'
import PrimaryButton from "./PrimaryButton"

const AddUpdateModal = ({addUpdateOpen, setAddUpdateOpen, updateUserId, setUpdateUserId, selectionTemplates, users, selectionValues, setSelectionValues, projectId}: {
        addUpdateOpen: any,
        setAddUpdateOpen: any,
        updateUserId: string,
        setUpdateUserId?: any,
        selectionTemplates: any
        users?: any,
        selectionValues: any,
        setSelectionValues: any,
        projectId: string
    }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [updateName, setUpdateName] = useState<string>("");
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
        <UpModal isOpen={addUpdateOpen} setIsOpen={setAddUpdateOpen}>
            <H1 text="New update"/>
            <div className="my-12">
                <h3>User</h3>
                <select
                    className="border-b w-full content my-2 py-2"
                    value={updateUserId}
                    onChange={e => setUpdateUserId(e.target.value)}
                    placeholder="Choose a user"
                >
                    {users.data.map(u => (
                        <option 
                            key={u._id}
                            value={u._id}
                        >{u.name}</option>
                    ))}
                </select>
            </div>
            <div className="my-12">
                <h3 className="up-ui-title">Name</h3>
                <input
                    type="text"
                    className="border-b w-full content my-2 py-2"
                    placeholder="Check in 2"
                    value={updateName}
                    onChange={e => setUpdateName(e.target.value)}
                />
            </div>
            {selectionTemplates && selectionTemplates.data && selectionTemplates.data.map(s => (
                <div className="my-12" key={s._id}>
                    <h3>{s.question}</h3>
                    <select
                        className="border-b w-full content my-2 py-2"
                        value={selectionValues.filter((sv) => sv.templateId == s._id)[0].selected}
                        onChange={e => setSelectionValues([
                            ...selectionValues.filter((sv) => sv.templateId != s._id), {
                                templateId: s._id,
                                selected: e.target.value,
                            }
                        ])}
                        placeholder="Choose a user"
                    >
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
                isDisabled={!updateUserId}
            >
                Create
            </PrimaryButton>
        </UpModal>
    )
}

export default AddUpdateModal
