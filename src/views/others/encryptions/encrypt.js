import React, { Component } from 'react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { Link, Redirect } from 'react-router-dom'
import { Methods, get, postWithSavedToken } from "../../../genetousApi"
import { ToastContainer, toast,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CCard,
    CCardBody,
    CRow,
    CCol,
    CCardTitle,
    CFormInput,
    CButton,
    CFormSelect,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CCardHeader,
    CCardFooter,
} from '@coreui/react'
import { bool } from 'prop-types';
const vars = {
    'cursor': "pointer",
    "color": "rgb(33, 37, 41)",
    "background-color": "#fff"
}
const activeLink = {
    'cursor': "pointer",
    "background-color": "rgb(33, 37, 41)",
    "color": "#fff"
}
const dangerIcon = {
    "color": "#f7f2f2"
}
const fRight = {
    "float": "right"
}
const cardText = { "height": "620px", "overflow-y": "scroll" }
const arrayLabels = ["not", "in", "eq"]
var status = -1;
var message = "Unexpected Error Occured!";
var error = false;
export class Encrypt extends Component {

    constructor(props) {
        super(props);
        this.state = {
            encryptions: [],
            visible: false,
            yesNoVisible: false,
            yesNoQuestion: "",
            arguments: [],
            sendType: "",
            redirect: false,
            error: false,
            errroText: "",
            sendApp: false
        };
    }
    handleRedirectApp() {
        if (!this.state.sendApp)
            this.setState({ sendApp: true })
    }

    toastShow(type, message) {
        switch(type){
            case "success":
                toast.success(message, {
                    position: "bottom-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    theme: "dark",
                    transition: Slide
                });
                break;
            case "error":
                toast.error(message, {
                    position: "bottom-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    theme: "dark",
                    transition: Slide
                });
                break;
            case "info":
                toast.info(message, {
                    position: "bottom-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    theme: "dark",
                    transition: Slide
                });
        }
    }
    handleRedirect(e) {
        if (!this.state.redirect)
            this.setState({ redirect: true })
    }
    componentDidMount() {
        var arr = ["clientId"]
        for (var i = 0; i < arr.length; ++i) {
            var key = arr[i];
            if (localStorage.getItem(key) == null || localStorage.getItem(key) == "") {
                this.handleRedirect();
                return;
            }
        }
        var arr2 = ["appId", "orgId"]
        for (var i = 0; i < arr2.length; ++i) {
            var key = arr2[i];
            if (localStorage.getItem(key) == null || localStorage.getItem(key) == "") {
                this.handleRedirectApp();
                return;
            }
        }
        this.getEncryption();
    }
    async getEncryption() {
        var orgId = localStorage.getItem('orgId')
        var appId = localStorage.getItem('appId')
        var model = {
            organizationId: orgId,
            applicationId: appId
        }
        var d = [...this.state.encryptions];
        var success=true;
        await postWithSavedToken(model, Methods.GetEncryption).then(function (result) {
            if (result.success) {
                d = result.data.encryptions;
            }
        }, err => {
            if (err.status == 401) {
                this.handleRedirect();
            } else {
                success=false;
                message = err.message;
            }
        });
        if(!success)
            this.toastShow("error", message);


        this.setState({ encryptions: d });
    }

    changeCollectionName(collectionIndex, e) {
        var encryptions = [...this.state.encryptions]
        var collection = encryptions[collectionIndex]
        collection["collectionName"] = e.target.value
        this.setState({ encryptions });
    }
    addNewCollection() {
        var encryptions = [...this.state.encryptions]
        var model = {
            collectionName: "collectionName",
            fields: [],
            not_return: []
        }
        encryptions.push(model);
        this.setState({ encryptions });
    }
    removeCollection(index) {
        var encryptions = [...this.state.encryptions]
        encryptions.splice(index, 1)
        this.setState({ encryptions });
    }
    changeFN(collectionIndex, type, e) {
        var encryptions = [...this.state.encryptions]
        var collection = encryptions[collectionIndex]
        if (e.target.value.toString().indexOf(",") >= 0) {
            var arr = this.getValueAsArrayByType(e.target.value);
            if (arr[0] && collection[type].indexOf(arr[0]) < 0) {
                collection[type].push(arr[0]);
            }
            e.target.value = "";
        }
        this.setState({ encryptions });
    }
    removeFN(val, collectionIndex, type) {
        var encryptions = [...this.state.encryptions]
        var collection = encryptions[collectionIndex]
        const index = collection[type].indexOf(val);
        if (index > -1) {
            collection[type].splice(index, 1);
        }
        this.setState({ encryptions });
    }
    getFN(val, collectionIndex, type) {
        return (
            <p className="p-1 rounded border border-primary text-primary">{val}
                <span style={fRight}> <button type="button"
                    onClick={this.removeFN.bind(this, val, collectionIndex, type)}
                    class="btn-close" aria-label="Close"></button></span>
            </p>
        )
    }
    async addUpdateEncryption() {
        this.toastShow("info", "Processing...");
        this.setVisible(false);
        var encryptions = [...this.state.encryptions]
        var orgId = localStorage.getItem("orgId");
        var appId = localStorage.getItem("appId");
        var model = {
            organizationId: orgId,
            applicationId: appId,
            encryptions: encryptions
        }
        var success = true;
        await postWithSavedToken(model, Methods.AddEncryption).then(function (result) {
            if (result.success == true) {
                message = "Saved!"
            } else {
                success = false;
                message = result.message;
            }
        }, err => {
            if (err.status == 401) {
                this.handleRedirect();
            } else {
                success=false;
                message = err.message;
            }
        });
        var type=success?"success":"error";
        this.toastShow(type, message);
    }
    setVisible(vis) {
        this.setState({ visible: vis });
    }
    async setYesNoVisible(vis, question, sendType, args, send) {
        if (vis)
            this.setState({ yesNoVisible: vis, yesNoQuestion: question, sendType: sendType, arguments: args });
        else {
            if (send) {
                var st = this.state.sendType;
                switch (st) {
                    case "saveAll":
                        await this.addUpdateEncryption();
                        break;
                }
            }
            this.setState({ yesNoVisible: vis, yesNoQuestion: "", sendType: "", arguments: [] });
        }
    }

    getValueAsArrayByType(val) {
        var arr = []
        var d = val.toString();
        var ind = d.indexOf(',');
        if (ind >= 0) {
            var arrElems = val.split(",");
            arr = arrElems;
        }
        else {
            if (val) {
                arr.push(val)
            }
        }

        return arr;
    }
    render() {
        const { redirect, sendApp } = this.state;

        if (redirect) {
            return <Redirect to='/login' />;
        }
        else if (sendApp) {
            return <Redirect to='/applications' />;
        }
        return (
            <CCard>
                <ToastContainer />
                <CRow className='m-2 border-bottom d-flex align-items-center'>
                    <CCol className='col-6 pb-2'>
                        <CCardTitle>Add/Update <b>"Encryption Data"</b></CCardTitle>
                    </CCol>
                    <CCol className='col-6 d-grid gap-2 d-md-flex justify-content-md-end pb-2'>
                        <CButton color='info' style={{ "color": "#fff" }}
                            onClick={this.setYesNoVisible.bind(this, true, "Are you sure you want to save all?", "saveAll", [this])}>Save All</CButton>
                    </CCol>

                    <CModal visible={this.state.yesNoVisible} onClose={this.setYesNoVisible.bind(this, false)}>
                        <CModalHeader>
                            <CModalTitle>{this.state.yesNoQuestion}</CModalTitle>
                        </CModalHeader>
                        <CModalFooter>
                            <CButton color="secondary" onClick={this.setYesNoVisible.bind(this, false, null, null, null, false)}>
                                No
                            </CButton>
                            <CButton color="primary" onClick={this.setYesNoVisible.bind(this, false, null, null, null, true)}>Yes</CButton>
                        </CModalFooter>
                    </CModal>
                </CRow>
                <CCardBody style={cardText}>

                    <CCard className='mt-1'>
                        <CCardBody>
                            <CCardTitle>Collections</CCardTitle>
                            {this.state.encryptions.length > 0 &&
                                this.state.encryptions.map((item, index) => (
                                    <div>
                                        <CRow className='mt-2'>
                                            <CCol className='col-11'>
                                                <CFormInput type='text' name='collectionName'
                                                    onChange={this.changeCollectionName.bind(this, index)}
                                                    placeholder='Collection Name' value={item.collectionName} />
                                            </CCol>
                                            <CCol className='align-self-center'>
                                                <span style={fRight}> <button type="button"
                                                    onClick={this.removeCollection.bind(this, index)}
                                                    class="btn-close" aria-label="Close"></button></span>
                                            </CCol>
                                        </CRow>
                                        <CCardTitle className='mt-2'>Encrypt Fields for  <b><u>{item.collectionName}</u></b> collection</CCardTitle>
                                        <CRow className='mt-2 pb-2'>
                                            <CCol className='col-9'>
                                                <CFormInput type='text' name='fields'
                                                    onChange={this.changeFN.bind(this, index, "fields")}
                                                    placeholder='Encrypt Fields with comma' />
                                            </CCol>
                                        </CRow>

                                        <CRow className='mt-2'>
                                            {item.fields.map((val =>
                                                <CCol className='col-3'>
                                                    {this.getFN(val, index, "fields")}
                                                </CCol>
                                            ))}
                                        </CRow>
                                        <CCardTitle>Disabled Return Values of Fields for <b><u>{item.collectionName}</u></b> collection</CCardTitle>
                                        <CRow className='mt-2 pb-2'>
                                            <CCol className='col-9'>
                                                <CFormInput type='text' name='not_return'
                                                    onChange={this.changeFN.bind(this, index, "not_return")}
                                                    placeholder='Disable return Fields with comma' />
                                            </CCol>
                                        </CRow>

                                        <CRow className='mt-2'>
                                            {item.not_return.map((val =>
                                                <CCol className='col-3'>
                                                    {this.getFN(val, index, "not_return")}
                                                </CCol>
                                            ))}
                                        </CRow>

                                    </div>
                                ))}
                        </CCardBody>
                        <CCardFooter>
                            <CRow className='mt-2 justify-content-center'>
                                <CCol className='col-6 text-center'>
                                    <CButton onClick={this.addNewCollection.bind(this)}><CIcon icon={icon.cilPlus} />Add New Collection</CButton>
                                </CCol>
                            </CRow>
                        </CCardFooter>
                    </CCard>
                </CCardBody>
            </CCard>
        )
    }
}
export default Encrypt