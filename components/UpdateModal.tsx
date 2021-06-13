import axios from 'axios';
import React, { useEffect, useState } from 'react'
import H1 from './H1'
import UpModal from './UpModal'
import PrimaryButton from "./PrimaryButton"
import { DatedObj, SelectionTemplateObj, TextTemplateObj, UpdateObj, UserObj } from '../utils/types';
import {format, formatDistance} from "date-fns";
import SmallTitle from './SmallTitle';

const UpdateModal = ({isOpen, setIsOpen, userId, setUserId, selectionTemplates, textTemplates, users, setIter, iter, update}: {
        isOpen: boolean,
        setIsOpen: any,
        userId: string,
        setUserId?: any,
        selectionTemplates: DatedObj<SelectionTemplateObj>[],
        textTemplates: DatedObj<TextTemplateObj>[],
        users: DatedObj<UserObj>[],
        setIter?: any,
        iter: number,
        update?: DatedObj<UpdateObj>,
    }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(update ? update.name : "");
    const [date, setDate] = useState<string>(format((update ? new Date(update.date) : new Date()), "yyyy-MM-dd"));
    
    
    // create a state variable for the value of every selection template
    const [selections, setSelections] = useState<{templateId: string, selected: string, required: boolean}[]>([])
    const [texts, setTexts] = useState<{templateId: string, body: string, required: boolean}[]>([])

    useEffect(() => {
        selectionTemplates && setSelections(selectionTemplates.map(st => (
            {
                templateId: st._id,
                selected: (update && update.selectionArr.filter(s => (s.templateId == st._id))[0]) ? update.selectionArr.filter(s => (s.templateId == st._id))[0].selected : "",
                required: st.required,
            }
        )))
    }, [selectionTemplates]); 

    useEffect(() => {
        textTemplates && setTexts(textTemplates.map(tt => (
            {
                templateId: tt._id,
                body: (update && update.textArr.filter(t => (t.templateId == tt._id))[0]) ? update.textArr.filter(t => (t.templateId == tt._id))[0].body : "",
                required: tt.required
            }
        )))
    }, [textTemplates]);

    // See if all required texts and selections have a value.
    const [filledIn, setFilledIn] = useState<boolean>(false);
    useEffect(() => {
        setFilledIn(true);
        texts.filter(t => (t.required)).map(t => (!t.body && setFilledIn(false)));
        selections.filter(s => (s.required)).map(s => (s.selected == "" && setFilledIn(false)));
    }, [texts, selections])

    function handleAddUpdate() {
        setIsLoading(true);
        axios.post("/api/update", {
            name: name,
            userId: userId,
            date: date,
            selections: selections,
            texts: texts,
            id: update && update._id
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                setIsOpen(false);
                setIsLoading(false);
                setIter(iter + 1); 
                setName("");
                console.log(res.data);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    return (users && users.length) ? (
        <UpModal isOpen={isOpen} setIsOpen={setIsOpen} wide={true}>
            {console.log("1")}
            <p className="text-sm btm-text-gray-400">{update ? "Edit update" : users.length == 1 ? `New update for ${users[0].name}` : "New update"}</p>
            
            <div className="my-8">
                <div className="up-ui-title my-4"><span>Date</span></div>
                <input
                    type="date"
                    className="w-full text-xl h-12"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />
            </div>
            
            <div className="my-12">
                {users.length > 1 && (
                    <>
                        <SmallTitle>User</SmallTitle>
                        <select
                            className={`border-b w-full content my-2 py-2 ${!userId && "opacity-30"}`}
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
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
                    value={name}
                    id="update-name-field" 
                    onChange={e => setName(e.target.value)}
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
                isDisabled={!(userId && name && filledIn)}
            >
                {update ? "Save" : "Create"}
            </PrimaryButton>
        </UpModal>
    ) : (
        <UpModal isOpen={isOpen} setIsOpen={setIsOpen} wide={true}>
            <p>Create a user to write updates!</p>
        </UpModal>
    )
}

export default UpdateModal
