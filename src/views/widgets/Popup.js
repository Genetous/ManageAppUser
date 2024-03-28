import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function Popup(props) {
    return (
        <Modal className="my-popup" isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader className="my-popup-header">
                {props.popupHeader}
            </ModalHeader>
            <ModalBody className="my-popup-body">
                {props.popupMessage}
            </ModalBody>
            <ModalFooter className="my-popup-footer">
                {
                    props.popupType === "YesNo"
                    ?
                    (
                        <div className="my-popup-yesno-buttons">
                            <button className="btn btn-success" onClick={() => {props.yesOnClickHandler(); props.toggle();}}>
                                Yes
                            </button>
                            <button className="btn btn-danger" onClick={() => {props.cancelOnClickHandler(); props.toggle();}}>
                                No
                            </button>
                        </div>
                    )
                    :
                    (
                        <div className="my-popup-alert-button">
                            <button onClick={() => {props.cancelOnClickHandler(); props.toggle();}}>
                                Cancel
                            </button>
                        </div>
                    )
                }
            </ModalFooter>
        </Modal>
    )
}