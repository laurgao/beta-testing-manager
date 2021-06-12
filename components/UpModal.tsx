import {Dispatch, ReactNode, SetStateAction} from 'react';
import Modal from "react-modal";

export default function UpModal({isOpen, setIsOpen, children, wide = false}: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    children: ReactNode,
    wide?: boolean,
}) {
    const ModalClasses = "top-24 left-1/2 fixed bg-white p-4 rounded-md shadow-xl mx-4 overflow-y-auto";
    // style="max-height: calc(100vh - 200px); overflow-y: auto;"
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className={ModalClasses}
            ariaHideApp={false} // Add this if you want the rest of the app to be shown when the modal is open
            style={{content: {transform: "translateX(calc(-50% - 16px))", maxWidth: "calc(100% - 32px)", maxHeight: "calc(100vh - 200px)", width: wide ? 700 : 320}, overlay: {zIndex: 50}}}
        >
            {children}
        </Modal>
    );
}