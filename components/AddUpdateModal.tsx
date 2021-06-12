import axios from 'axios';
import React, { useEffect, useState } from 'react'
import H1 from './H1'
import UpModal from './UpModal'
import PrimaryButton from "./PrimaryButton"
import { DatedObj, SelectionTemplateObj, TextTemplateObj, UserObj } from '../utils/types';
import SmallTitle from './SmallTitle';

const AddUpdateModal = ({addUpdateOpen, setAddUpdateOpen, updateUserId, setUpdateUserId, selectionTemplates, textTemplates, users, setIter, iter}: {
        addUpdateOpen: boolean,
        setAddUpdateOpen: any,
        updateUserId: string,
        setUpdateUserId?: any,
        selectionTemplates: DatedObj<SelectionTemplateObj>[],
        textTemplates: DatedObj<TextTemplateObj>[],
        users: DatedObj<UserObj>[],
        setIter?: any,
        iter: number
    }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [updateName, setUpdateName] = useState<string>("");
    
    // create a state variable for the value of every selection template
    const [selections, setSelections] = useState<{templateId: string, selected: string, required: boolean}[]>([])
    const [texts, setTexts] = useState<{templateId: string, body: string, required: boolean}[]>([])

    useEffect(() => {
        selectionTemplates && setSelections(selectionTemplates.map(s => (
            {
                templateId: s._id,
                selected: "",
                required: s.required,
            }
        )))
    }, [selectionTemplates]); 

    useEffect(() => {
        textTemplates && setTexts(textTemplates.map(tt => (
            {
                templateId: tt._id,
                body: "",
                required: tt.required
            }
        )))
    }, [textTemplates]);

    // see if all required texts and selections have a value.
    const [areTextsFilledIn, setAreTextsFilledIn] = useState<boolean>(false);
    useEffect(() => {
        setAreTextsFilledIn(true);
        texts.filter(text => (text.required)).map(text => (!text.body && setAreTextsFilledIn(false)));
    }, [texts])

    const [areSelectionsFilledIn, setAreSelectionsFilledIn] = useState<boolean>(false);
    useEffect(() => {
        setAreSelectionsFilledIn(true);
        selections.filter(s => (s.required)).map(s => (s.selected == "" ? setAreSelectionsFilledIn(false) : console.log(s.selected)));
    }, [selections])

    function handleAddUpdate() {
        setIsLoading(true);
        axios.post("/api/update", {
            name: updateName,
            userId: updateUserId,
            selections: selections,
            texts: texts
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                setAddUpdateOpen(false);
                setIsLoading(false);
                setIter(iter + 1); 
                setUpdateName("");
                console.log(res.data);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    return (users && users.length) ? (
        <UpModal isOpen={addUpdateOpen} setIsOpen={setAddUpdateOpen} wide={true}>
            {console.log("1")}
            <p className="text-sm btm-text-gray-400">{users.length == 1 ? `New update for ${users[0].name}` : "New update"}</p>
            <div className="my-12">
                {users.length > 1 && (
                    <>
                        <SmallTitle>User</SmallTitle>
                        <select
                            className={`border-b w-full content my-2 py-2 ${!updateUserId && "opacity-30"}`}
                            value={updateUserId}
                            onChange={e => setUpdateUserId(e.target.value)}
                            placeholder="Choose a user"
                        >
                            <option value="">Choose a user</option>
                            {users.length ? users.map(u => (
                                <option 
                                    key={u._id}
                                    value={u._id}
                                >{u.name}</option>
                            )) : (
                                <p>No users</p>
                            )}
                        </select>
                    </>
                )}
            </div>

            <div className="my-12">
                <SmallTitle>Name</SmallTitle>
                <input
                    type="text"
                    className="border-b w-full content my-2 py-2"
                    placeholder="Check in 2"
                    value={updateName}
                    id="update-name-field" 
                    onChange={e => setUpdateName(e.target.value)}
                />
            </div>
            {textTemplates && texts.length && textTemplates.map(textTemplate => (
                <div className="my-12" key={textTemplate._id}>
                    <SmallTitle>{textTemplate.question}</SmallTitle>
                    <textarea
                        className="border-b w-full content my-2 py-2"
                        placeholder="Write something awesome..."
                        value={texts.filter(text => text.templateId == textTemplate._id)[0].body}
                        onChange={e => setTexts([
                            ...texts.filter((text) => text.templateId != textTemplate._id), 
                            {
                                templateId: textTemplate._id,
                                body: e.target.value,
                                required: textTemplate.required
                            }
                        ])}
                    />
                </div>
            ))}
            {selectionTemplates && selections.length && selectionTemplates.map(selectionTemplate => (
                <div className="my-12" key={selectionTemplate._id}>
                    <SmallTitle>{selectionTemplate.question}</SmallTitle>
                    <select
                        className={`border-b w-full content my-2 py-2 focus:outline-none ${selections.filter((s) => s.templateId == selectionTemplate._id)[0].selected == "" && "opacity-30"}`}
                        value={selections.filter((s) => s.templateId == selectionTemplate._id)[0].selected}
                        onChange={e => setSelections([
                            ...selections.filter((s) => s.templateId != selectionTemplate._id), 
                            {
                                templateId: selectionTemplate._id,
                                selected: e.target.value,
                                required: selectionTemplate.required
                            }
                        ])}
                    >
                        <option value="">Choose a value</option>
                        {selectionTemplate.options.map(o => (
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
                isDisabled={!(updateUserId && updateName && areTextsFilledIn && areSelectionsFilledIn)}
            >
                Create
            </PrimaryButton>
        </UpModal>
    ) : (
        <UpModal isOpen={addUpdateOpen} setIsOpen={setAddUpdateOpen} wide={true}>
            <p>Create a user to write updates!</p>
        </UpModal>
    )
}

export default AddUpdateModal
