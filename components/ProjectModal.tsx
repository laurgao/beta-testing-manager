import axios from "axios";
import router from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { DatedObj, ProjectObj } from "../utils/types";
import H2 from "./H2";
import Input from "./Input";
import PrimaryButton from "./PrimaryButton";
import UpModal from "./UpModal";

const ProjectModal = ({ isOpen, setIsOpen, project, setIter, setTab }: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    project?: DatedObj<ProjectObj>,
    setIter: Dispatch<SetStateAction<number>>,
    setTab?: Dispatch<SetStateAction<string>>,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(project ? project.name : "");
    const [description, setDescription] = useState<string>(project ? project.description : "");

    function handleAddProject() {
        if (!name) return;
        setIsLoading(true);

        axios.post("/api/project", {
            name: name,
            description: description,
            id: project && project._id
        }).then(res => {
            setIsLoading(false);
            setIter(iter => iter + 1);
            setIsOpen(false);
            if (setTab) setTab("dashboard");
            else router.push(`/projects/${res.data.id[0]}`);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    return (
        <UpModal isOpen={isOpen} setIsOpen={setIsOpen} wide={true}>
            <H2>{project ? "Edit Project" : "New Project"}</H2>
            <Input
                name="Name"
                placeholder="Beta Testing Manager"
                value={name}
                id="project-name-field"
                setValue={setName}
            />
            <Input
                name="Description"
                type="text"
                placeholder="The all in one tool for effortlessly keeping track of beta testers"
                value={description}
                setValue={setDescription}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && e.controlKey) {
                        handleAddProject();
                    }
                }}
            />
            <PrimaryButton
                onClick={handleAddProject}
                isLoading={isLoading}
                isDisabled={!name}
            >
                {project ? "Save" : "Create"}
            </PrimaryButton>
        </UpModal>
    )
}

export default ProjectModal
