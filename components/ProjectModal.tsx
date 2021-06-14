import axios from 'axios';
import router from 'next/router';
import React, { useState } from 'react'
import { DatedObj, ProjectObj } from '../utils/types';
import Input from './Input';
import PrimaryButton from './PrimaryButton';
import H2 from './H2';
import UpModal from './UpModal';

const ProjectModal = ({isOpen, setIsOpen, project, iter, setIter, setTab} : {
    isOpen: boolean,
    setIsOpen: any,
    project?: DatedObj<ProjectObj>,
    iter: number,
    setIter: any,
    setTab?: any,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(project ? project.name : "");
    const [description, setDescription] = useState<string>(project ? project.description : "");
    
    function handleAddProject() {
        setIsLoading(true);

        axios.post("/api/project", {
            name: name,
            description: description,
            id: project && project._id
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                setIsLoading(false);
                setIter(iter + 1);
                setIsOpen(false);
                if (setTab) setTab("dashboard");
                else router.push(`/projects/${res.data.id[0]}`);
                console.log(res.data);
            }
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
