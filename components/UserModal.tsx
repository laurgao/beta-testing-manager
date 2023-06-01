import axios from "axios";
import { format } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";
import { DatedObj, UserObj } from "../utils/types";
import H2 from "./H2";
import Input from "./Input";
import PrimaryButton from "./PrimaryButton";
import UpModal from "./UpModal";

const UserModal = ({ isOpen, setIsOpen, user, setIter, setTab, projectId }: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    user?: DatedObj<UserObj>,
    setIter: Dispatch<SetStateAction<number>>,
    setTab?: Dispatch<SetStateAction<string>>,
    projectId: string,
}) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(user ? user.name : "");
    const [email, setEmail] = useState<string>(user ? user.email : "");
    const [date, setDate] = useState<string>(format(user ? new Date(user.date) : new Date(), "yyyy-MM-dd"));

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
                setIter(iter => iter + 1);
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
            <H2>{user ? "Edit User" : "New User"}</H2>
            <Input
                name="Name"
                type="text"
                placeholder="Samson Zhang"
                value={name}
                id="user-name-field"
                setValue={setName}
            />
            <Input
                name="Date joined"
                type="date"
                value={date}
                setValue={setDate}
            />
            <Input
                name="Email (optional)"
                type="text"
                placeholder="hello@samsonzhang.com"
                value={email}
                setValue={setEmail}
            />
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
