import axios from "axios";
import router from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import Input from "./Input";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import UpModal from "./UpModal";

const DeleteModal = ({ isOpen, setIsOpen, item, itemType, setIter }: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    itemType: "project" | "user" | "update",
    item: any, // DatedObj<ProjectObj> | DatedObj<UserObj> | DatedObj<UpdateObj>,
    setIter: Dispatch<SetStateAction<number>>,
}) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");

    function onSubmit() {
        console.log("deleting");
        setIsLoading(true);
        axios.delete(`/api/${itemType}`, {
            data: {
                id: item._id,
            },
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                setIsLoading(false);
                setIter(iter => iter + 1);
                if (itemType == "project") router.push(`/projects`);
                else if (itemType == "user") router.push(`/projects/${item.projectId}`); // project page
                else if (itemType == "update") router.push(`/projects/${item.userArr[0].projectId}/${item.userId}`); // user page
                console.log(res.data);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });

    }

    return (
        <UpModal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="text-center">
                <p>Are you sure you want to delete this {itemType}{itemType == "project" ? " and all its users" : itemType == "user" && " and all its updates"}? This action cannot be undone.</p>
                <p className="font-semibold mt-2">Type "{item.name}" to confirm.</p>
                <Input
                    value={name}
                    setValue={setName}
                    placeholder={item.name}
                />
                <div className="flex items-center gap-2 mt-2 justify-center">
                    <PrimaryButton
                        onClick={onSubmit}
                        isLoading={isLoading}
                        isDisabled={name != item.name}
                    >Delete</PrimaryButton>
                    <SecondaryButton onClick={() => setIsOpen(false)}>Cancel</SecondaryButton>
                </div>
            </div>
        </UpModal>
    )
}

export default DeleteModal
