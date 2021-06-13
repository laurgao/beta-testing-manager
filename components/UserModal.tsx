import React, { useState } from 'react'
import {format, formatDistance} from "date-fns";
import axios from 'axios';
import SmallTitle from './SmallTitle';
import UpModal from './UpModal';
import PrimaryButton from './PrimaryButton';
import { DatedObj, UserObj } from '../utils/types';

const UserModal = ({isOpen, setIsOpen, user, iter, setIter, setTab, projectId} : {
    isOpen: boolean,
    setIsOpen: any,
    user?: DatedObj<UserObj>,
    iter: number,
    setIter: any,
    setTab?: any,
    projectId: string,
}) => {
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(user ? user.name : "");
    const [email, setEmail] = useState<string>(user ? user.email : "");
    const [date, setDate] = useState<string>(format((user ? new Date(user.date) : new Date()), "yyyy-MM-dd"));

    function handleAddUser() {
        setIsLoading(true);

        axios.post("/api/user", {
            name: name,
            email: email,
            date: date,
            projectId: projectId,
            id: user && user._id
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                setIsLoading(false);
                setIter(iter + 1);
                setIsOpen(false);
                if (setTab) setTab("users");
                // router.push(`/projects/${projectId}/${res.data.id[0]}`); // user page
                console.log(res.data);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }
    return (
        <UpModal isOpen={isOpen} setIsOpen={setIsOpen} wide={true}>
        <SmallTitle>{user ? "Edit User" : "New User"}</SmallTitle>
        <div className="my-12">
            <h3 className="up-ui-title">Name</h3>
            <input
                type="text"
                className="border-b w-full content my-2 py-2"
                placeholder="Samson Zhang"
                value={name}
                id="user-name-field"
                onChange={e => setName(e.target.value)}
            />
        </div>
        <div className="my-8">
        <div className="up-ui-title my-4"><span>Date joined</span></div>
            <input
                type="date"
                className="w-full text-xl h-12"
                value={date}
                onChange={e => setDate(e.target.value)}
            />
        </div>

        <div className="my-12">
            <h3 className="up-ui-title">Email (optional)</h3>
            <input
                type="text"
                className="border-b w-full content my-2 py-2"
                placeholder="hello@samsonzhang.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
        </div>
        <PrimaryButton
            onClick={handleAddUser}
            isLoading={isLoading}
            isDisabled={!name}
        >
            {user ? "Save" : "Create"}
        </PrimaryButton>
    </UpModal>
    )
}

export default UserModal
