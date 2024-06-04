import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { format } from 'date-fns';
import CreateCollection from './createCollection';
import CreateRelation from './createRelation';
import UpdateCollection from './updateCollection';
import DeleteCollection from './deleteCollection';
import DeleteRelation from './deleteRelation';
import Execute from './execute';
import Login from './login';
import { ToastContainer, toast,Slide } from 'react-toastify';
import Popup from '../../../widgets/Popup';
import 'react-toastify/dist/ReactToastify.css';
import { Methods, get, postWithSavedToken } from "../../../../genetousApi"
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
    CCardText,
    CCardTitle,
    CContainer,
    CFormInput,
    CListGroup,
    CListGroupItem,
    CButton,
    CFormSelect,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalFooter
} from '@coreui/react'
import { bool } from 'prop-types';
import GetCollections from './getCollections';
import GetRelations from './getRelations';
const vars = {
    'cursor': "pointer",
    "color": "rgba(33, 37, 41,0.8)",
    "background-color": "#fff"
}
const activeLink = {
    'cursor': "pointer",
    "background-color": "rgba(33, 37, 41,0.8)",
    "color": "#fff"
}
const dangerIcon = {
    "color": "#c6c6c6"
}
var status = -1;
var message = "Unexpected Error Occured!";
var error = false;
export class Dataservice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permissionItems: ["Create Collection", "Update Collection", "Delete Collection",
                "Create Relation", "Delete Relation","Get Collections","Get Relations","Login","Execute SQL"],
            collectionCreateRules: [],
            activeKey: 1,
            activeSubKeys: [1, 1, 1, 1, 1],
            subKeys: [],
            redirect: false,
            error: false,
            errroText: "",
            sendApp:false,
            error: false,
            status: -1,
            message: "",
            lists:[false,false,false,false,false,false,false,false],
            visible: false,
            yesNoVisible: false,
            yesNoQuestion: "",
            arguments: [],
            sendType: ""
        };

        this.handleRedirect = this.handleRedirect.bind(this);
        this.toastShow = this.toastShow.bind(this);
        this.newRuleAdd = this.newRuleAdd.bind(this);
        this.deleteRole = this.deleteRole.bind(this);
        this.addUpdateRule = this.addUpdateRule.bind(this);
        this.getRules = this.getRules.bind(this);
        this.setData=this.setData.bind(this);

    }
    setActiveKey(key) {
        var l = { ...this.state.lists };
        if(l[this.state.activeKey-1]==false){
            this.setState({ activeKey: key });
        }else{
            this.setYesNoVisible(true, "Are you sure you want to discard all changes?", "cancel", [key,this.state.activeKey]);
        }
        return false;
    }
    async setData(position,data){
        var l = { ...this.state.lists };
        l[position-1]=data;
        this.setState({lists:l})
    }
    async setYesNoVisible(vis, question, sendType, args, send) {
        if (vis)
            this.setState({ yesNoVisible: vis, yesNoQuestion: question, sendType: sendType, arguments: args });
        else {
            if (send) {
                var st = this.state.sendType;
                switch (st) {
                    case "cancel":
                        var l = { ...this.state.lists };
                        l[this.state.arguments[1]-1]=false;
                        await this.setState({ activeKey: this.state.arguments[0],lists:l });
                        break;
                }
            }
            this.setState({ yesNoVisible: vis, yesNoQuestion: "", sendType: "", arguments: [] });
        }
    }
    handleRedirectApp() {
        if (!this.state.sendApp)
            this.setState({ sendApp: true })
    }
    componentDidMount(){
        var arr=["clientId"]
        for(var i=0;i<arr.length;++i){
            var key=arr[i];
            if(localStorage.getItem(key)== null || localStorage.getItem(key)==""){
                this.handleRedirect();
                return;
             }
        }
        var arr2=["appId","orgId"]
        for(var i=0;i<arr2.length;++i){
            var key=arr2[i];
            if(localStorage.getItem(key)== null || localStorage.getItem(key)==""){
                this.handleRedirectApp();
                return;
             }
        }
        var now=Date.now()/1000;
        var time=localStorage.getItem("timeout")/1000;
        if((now-time)>3600){
            localStorage.setItem("token","");
            this.handleRedirect();
        }
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
   

    
    async newRuleAdd(model) {
        var eleman = document.getElementById("newrule");
        if (!eleman.value) {
            this.toastShow("error","Role Name cannot be null or empty!")
            return false;
        }
        
        var success=true;
        await postWithSavedToken(model, Methods.AddUpdateRules).then(function (result) {
            success=result.success;
            if (result.success == true) {
                message="Role Rule Created!"
            } else {
                message=result.message;
               
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
        eleman.value = "";
        return true;
    }
    async deleteRole(model) {
        var success = false;
        var message = "";
        await postWithSavedToken(model, Methods.DeleteRule).then(function (result) {
            success=result.success
            if (result.success == true) {
                message = "Role Deleted"
            } else {
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
        if (success) {
           return true
        }else{
            return false;
        }
       
    }
    async addUpdateRule(model) {
        console.log(model);
        var message = "";
        var success = true;
        await postWithSavedToken(model, Methods.AddUpdateRules).then(function (result) {
            success=result.success;
            if (result.success == true) {
                message = "Saved!"
            } else {
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
    async getRules(model) {
        var data=[]
        var success=true;
        await postWithSavedToken(model, Methods.GetRules).then(function (result) {
            if (result.length > 0 && result[0].hasOwnProperty('roleRules')) {
                data = result;
            }
        }, err => {
            if (err.status == 401) {
                this.handleRedirect();
            } else {
                success=false;
                message = err.message;
            }
        });
        return data;
       
    }
    async getIndex(model) {
        var data=[]
        var success=true;
        await postWithSavedToken(model, Methods.GetIndex).then(function (result) {
            data = result;
        }, err => {
            if (err.status == 401) {
                this.handleRedirect();
            } else {
                success=false;
                message = err.message;
            }
        });
        return data;
       
    }
    async getQuery(model) {
        var data=[]
        var success=true;
        await postWithSavedToken(model, Methods.GetSQLQuery).then(function (result) {
            data = result;
        }, err => {
            if (err.status == 401) {
                this.handleRedirect();
            } else {
                success=false;
                message = err.message;
            }
        });
        return data;
       
    }
    async setQuery(model) {
        var success=true;
        await postWithSavedToken(model, Methods.SetSQLQuery).then(function (result) {
            success=result.success;
            if (result.success == true) {
                message = "Saved!"
            } else {
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
    async deleteQuery(model) {
        var success=true;
        await postWithSavedToken(model, Methods.DelSQLQuery).then(function (result) {
            success=result.success;
            if (result.success == true) {
                message = "Deleted!"
            } else {
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
    //////
    render() {
        const { redirect } = this.state;
        const { sendApp } = this.state;

        if (redirect) {
            return <Redirect to='/login' />;
        }else if(sendApp){
            return <Redirect to='/applications' />;
        }
        return (
            <CContainer className='p-5'>
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
                <ToastContainer />
                <CRow>
                    <CCol className='col-2'>
                        <CNav className='flex-column' role="tablist" style={vars} >
                            {this.state.permissionItems.map((item, index) => (
                                <CNavItem>
                                    <CNavLink
                                        style={this.state.activeKey === index + 1 ? activeLink : vars}
                                        active={this.state.activeKey === index + 1}
                                        onClick={this.setActiveKey.bind(this, index + 1)}
                                    >
                                        {item}
                                    </CNavLink>
                                </CNavItem>
                            ))}
                        </CNav>

                    </CCol>
                    <CCol className='col-10 justify-content-center'>
                        <CTabContent>
                            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
                                {this.state.activeKey === 1 &&
                                <CreateCollection service="dataservice"
                                    handleRedirect={this.handleRedirect}
                                    toastShow={this.toastShow}
                                    newRuleAdd={this.newRuleAdd}
                                    deleteRole={this.deleteRole}
                                    addUpdateRule={this.addUpdateRule}
                                    getRules={this.getRules}
                                    method="/dataservice/add/collection"
                                    setData={this.setData}
                                    position={1} />
                                }
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
                            {this.state.activeKey === 2 &&
                                <UpdateCollection service="dataservice"
                                    handleRedirect={this.handleRedirect}
                                    toastShow={this.toastShow}
                                    newRuleAdd={this.newRuleAdd}
                                    deleteRole={this.deleteRole}
                                    addUpdateRule={this.addUpdateRule}
                                    getRules={this.getRules}
                                    method="/dataservice/update/collection"
                                    setData={this.setData}
                                    position={2} />
                            }
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 3}>
                            {this.state.activeKey === 3 &&
                                <DeleteCollection service="dataservice"
                                    handleRedirect={this.handleRedirect}
                                    toastShow={this.toastShow}
                                    newRuleAdd={this.newRuleAdd}
                                    deleteRole={this.deleteRole}
                                    addUpdateRule={this.addUpdateRule}
                                    getRules={this.getRules}
                                    method="/dataservice/delete/collection"
                                    setData={this.setData}
                                    position={3} />
                            }
                            </CTabPane>

                            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 4}>
                            {this.state.activeKey === 4 &&
                                <CreateRelation
                                    handleRedirect={this.handleRedirect}
                                    toastShow={this.toastShow}
                                    newRuleAdd={this.newRuleAdd}
                                    deleteRole={this.deleteRole}
                                    addUpdateRule={this.addUpdateRule}
                                    getRules={this.getRules}
                                    setData={this.setData}
                                    position={4}  />
                            }
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 5}>
                            {this.state.activeKey === 5 &&
                                <DeleteRelation
                                    handleRedirect={this.handleRedirect}
                                    toastShow={this.toastShow}
                                    newRuleAdd={this.newRuleAdd}
                                    deleteRole={this.deleteRole}
                                    addUpdateRule={this.addUpdateRule}
                                    getRules={this.getRules}
                                    setData={this.setData}
                                    position={5}   />
                            }
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 6}>
                            {this.state.activeKey === 6 &&
                                <GetCollections
                                    handleRedirect={this.handleRedirect}
                                    toastShow={this.toastShow}
                                    newRuleAdd={this.newRuleAdd}
                                    deleteRole={this.deleteRole}
                                    addUpdateRule={this.addUpdateRule}
                                    getRules={this.getRules}
                                    setData={this.setData}
                                    position={6}
                                    data={this.state.lists[5]}  />
                            }
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 7}>
                            {this.state.activeKey === 7 &&
                                <GetRelations
                                    handleRedirect={this.handleRedirect}
                                    toastShow={this.toastShow}
                                    newRuleAdd={this.newRuleAdd}
                                    deleteRole={this.deleteRole}
                                    addUpdateRule={this.addUpdateRule}
                                    getRules={this.getRules}
                                    setData={this.setData}
                                    position={7}  />
                            }
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 8}>
                            {this.state.activeKey === 8 &&
                                <Login
                                    handleRedirect={this.handleRedirect}
                                    toastShow={this.toastShow}
                                    newRuleAdd={this.newRuleAdd}
                                    deleteRole={this.deleteRole}
                                    addUpdateRule={this.addUpdateRule}
                                    getRules={this.getRules}
                                    setData={this.setData}
                                    position={8}  />
                            }
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 9}>
                            {this.state.activeKey === 9 &&
                                <Execute
                                    handleRedirect={this.handleRedirect}
                                    toastShow={this.toastShow}
                                    getIndex={this.getIndex}
                                    getQuery={this.getQuery}
                                    setQuery={this.setQuery}
                                    delQuery={this.deleteQuery}
                                    setData={this.setData}
                                    position={9}  />
                            }
                            </CTabPane>
                        </CTabContent>
                    </CCol>
                </CRow>

            </CContainer>
        )
    }
}
export default Dataservice