import React, { Component } from 'react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { Methods, get, logout, organization, postWithSavedToken } from "../../genetousApi"
import { format } from 'date-fns';
import { Link, Redirect } from 'react-router-dom'
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    CCard,
    CCardBody,
    CRow,
    CCol,
    CCardTitle,
    CContainer,
    CCardImage,
    CCardText,
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CFormInput,
    CFormLabel
} from '@coreui/react'
import { bool } from 'prop-types';
const vars = {
    'cursor': "pointer"
}
var status = -1;
var message = "Unexpected Error Occured!";
var error = false;
export class Applications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            modalVisible: false,
            file: [],
            application: {
                collectionName: "application",
                content: {
                    applicationName: "",
                    applicationIcon: "",
                    applicationCreatedDate: 0,
                    uniqueFields: ["applicationName"]
                }
            },
            redirect: false,
            appCreateStarted: false
        }
    }

    handleRedirect() {
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
        var now=Date.now()/1000;
        var time=localStorage.getItem("timeout")/1000;
        if((now-time)>3600){
            localStorage.setItem("token","");
            this.handleRedirect();
        }else{
            this.getApplications();
        }
    }
    async getApplications() {
        var orgId = localStorage.getItem('orgId')
        var model = {
            where: {
                and: {
                    "relationName": "organizationRelations",
                    "collectionId": orgId
                }
            },
            related: {
                collectionName: "application",
                sort: {
                    applicationName: "asc"
                }
            }
        }
        var d = [...this.state.applications];
        var success = true;
        await postWithSavedToken(model, Methods.GetApplications).then(function (result) {
            if (result.results.length > 0 && result.results[0].data.length > 0) {
                d = result.results[0].data[0].related.application;
            }
        }, err => {
            if (err.status == 401) {
                this.handleRedirect();
            } else {
                success = false;
                message = err.message;

            }
        });
        if (!success) {
            var type = success ? "success" : "error";
            this.toastShow(type, message);
        }
        this.setState({ applications: d });
    }
    toastShow(type, message) {
        switch (type) {
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
    appItemChange(d) {
        const { application } = this.state;
        application["content"][d.target.name] = d.target.value;
        this.setState({ application });
    }
    async fileChanged(e) {
        if (e.target.files.length > 0) {
            var files = e.target.files;
            if (files.length > 0) {
                await this.setState({
                    file: files
                });
            }
        } else {
            await this.setState({ file: [] });
        }
    }
    setModalVisible(e, b) {
        this.setState({ modalVisible: e });
    }
    async deleteApp(appId) {
        var model = {
            where: {
                or: {
                    id: [appId]
                }
            }
        }
        await postWithSavedToken(model, Methods.DeleteCollection).then(function (result) {
        }, err => {

        });
        return true;
    }
    setAppID(e, d) {
        localStorage.setItem("appId", e.target.name)
    }
    async logOut(e) {
        var redirect = false;
        await logout().then(function (result) {

        }, err => {

        });

        localStorage.removeItem("token")
        localStorage.removeItem("clientId")
        localStorage.removeItem("appId")
        localStorage.removeItem("orgId")
        delete organization.clientId;
        this.setState({ redirect: true })

        return false;
    }
    toastShow(type, message) {
        switch (type) {
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
    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/login' />;
        }
        return (
            <CContainer className='p-5'>
                <ToastContainer />
                <CRow className="justify-content-center">
                    <CCol className="text-center p-5">
                        <CCardTitle>OrganizationId : {localStorage.getItem("orgId")}</CCardTitle>
                    </CCol>
                </CRow>
                <CRow className="justify-content-center">

                    {this.state.applications.map((item, index) => (
                        <CCol sm={3}>
                            <CCard className="text-center" >
                                <CCardBody>
                                    <CCardTitle>{item.content.applicationName}</CCardTitle>
                                    <CCardText>ApplicationId : {item.content.applicationId}</CCardText>
                                    <CCardText>Created Date : {format(item.content.applicationCreatedDate, 'dd.MM.yyyy')}</CCardText>
                                    <Link to="/" name={item.content.applicationId} onClick={this.setAppID.bind(this)}>
                                        <CButton name={item.content.applicationId} href="#">Go to Panel</CButton>
                                    </Link>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    ))
                    }
                </CRow>

                <CRow className="justify-content-center">
                    <CCol className="text-center p-5">
                        <CButton onClick={this.logOut.bind(this)}><CIcon icon={icon.cilAccountLogout} /> Logout </CButton>
                    </CCol>
                </CRow>

            </CContainer>
        )
    }
}
export default Applications