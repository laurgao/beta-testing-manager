import axios from "axios";
import { format } from "date-fns";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DatedObj, SelectionTemplateObj, TextTemplateObj, UpdateObj, UserObj } from "../utils/types";
import H2 from "./H2";
import H3 from "./H3";
import Input from "./Input";
import PrimaryButton from "./PrimaryButton";
import UpModal from "./UpModal";

const UpdateModal = ({ isOpen, setIsOpen, selectionTemplates, textTemplates, users, setIter, update }: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    selectionTemplates: DatedObj<SelectionTemplateObj>[],
    textTemplates: DatedObj<TextTemplateObj>[],
    users: DatedObj<UserObj>[],
    setIter?: Dispatch<SetStateAction<number>>,
    update?: DatedObj<UpdateObj>,
}) => {
    const [userId, setUserId] = useState<string>(users.length == 1 ? users[0]._id : "");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(update ? update.name : "");
    const [date, setDate] = useState<string>(format((update ? new Date(update.date) : new Date()), "yyyy-MM-dd"));
    console.log(userId);

    // create a state variable for the value of every selection template
    const [selections, setSelections] = useState<{ templateId: string, selected: string, required: boolean }[]>([])
    const [texts, setTexts] = useState<{ templateId: string, body: string, required: boolean }[]>([])

    useEffect(() => {
        selectionTemplates && setSelections(selectionTemplates.map(st => (
            {
                templateId: st._id,
                selected: (update?.selectionArr.filter(s => (s.templateId == st._id))[0]) ? update.selectionArr.find(s => (s.templateId == st._id)).selected : "",
                required: st.required,
            }
        )))
    }, [selectionTemplates]);

    useEffect(() => {
        textTemplates && setTexts(textTemplates.map(tt => (
            {
                templateId: tt._id,
                body: (update?.textArr.find(t => (t.templateId == tt._id))) ? update.textArr.find(t => (t.templateId == tt._id)).body : "",
                required: tt.required
            }
        )))
    }, [textTemplates]);

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
                setIter(prevIter => prevIter + 1);
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
            <H2>{update ? "Edit update" : users.length == 1 ? `New update for ${users[0].name}` : "New update"}</H2>

            <Input
                name="Date"
                type="date"
                value={date}
                setValue={setDate}
            />
            <div className="my-8">
                {users.length > 1 && (
                    <>
                        <H3>User</H3>
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

            <Input
                name="Name"
                placeholder="Check in 2"
                value={name}
                id="update-name-field"
                setValue={setName}
            />
            {textTemplates && texts.length && textTemplates.map(textTemplate => (
                <Input
                    type="textarea"
                    key={textTemplate._id}
                    name={textTemplate.question}
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
            ))}
            {selectionTemplates && selections.length && selectionTemplates.map(selectionTemplate => (
                <div className="my-8" key={selectionTemplate._id}>
                    <H3>{selectionTemplate.question}</H3>
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
                                key={o}
                                value={o}
                            >{o}</option>
                        ))}
                    </select>
                </div>
            ))}
            <PrimaryButton
                onClick={handleAddUpdate}
                isLoading={isLoading}
                isDisabled={!((userId || users.length == 1) && name)}
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
