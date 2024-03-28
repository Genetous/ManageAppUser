import React, { Component } from 'react';
import CreateNodes from './createNodes';
import DeleteNodes from './deleteNodes';
import Relate from './relate';
import DeleteRelation from './deleteRelation';
import UpdateNodes from './updateNodes';
import { Link, Redirect } from 'react-router-dom'
import { Methods, get, postWithSavedToken } from "../../../../genetousApi"

import { ToastContainer, toast,Slide } from 'react-toastify';
import Popup from '../../../widgets/Popup';
import 'react-toastify/dist/ReactToastify.css';
import {
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CRow,
    CCol,
    CContainer,
} from '@coreui/react'
import { bool } from 'prop-types';
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
export class Recommendation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permissionItems: ["Create Node", "Update Node", "Delete Node", "Relate Nodes", "Delete Relation"],
            collectionCreateRules: [],
            activeKey: 1,
            activeSubKeys: [1, 1, 1, 1, 1],
            subKeys: [],
            redirect: false,
            sendApp:false
        };
        this.handleRedirect = this.handleRedirect.bind(this);
        this.newRuleAdd = this.newRuleAdd.bind(this);
        this.deleteRole = this.deleteRole.bind(this);
        this.addUpdateRule = this.addUpdateRule.bind(this);
        this.getRules = this.getRules.bind(this);
        this.toastShow = this.toastShow.bind(this);

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
    }
    handleRedirect(e) {
        if (!this.state.redirect)
            this.setState({ redirect: true })
    }
    setActiveKey(key) {
        this.setState({ activeKey: key });
        return false;
    }
    async newRuleAdd(model) {
        var eleman = document.getElementById("newrule");
        if (!eleman.value) {
            this.toastShow("error", "Role Name cannot be null or empty!")
            return false;
        }

        var success=false;
        var message="";
        await postWithSavedToken(model, Methods.AddUpdateRules).then(function (result) {
            success=result.success;
            if (result.success == true) {
                message = "Role Rule Created!"

            } else {
                message = result.message;
            }
        },  err => {
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
        var message="";
        await postWithSavedToken(model, Methods.DeleteRule).then(function (result) {
            success=result.success;
            if (result.success == true) {
                message = "Role Deleted"
            } else {
                message = result.message;
            }
        },  err => {
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
        } else {
            return false;
        }

    }
    async addUpdateRule(model) {
        console.log(model);
        var success = true;
        await postWithSavedToken(model, Methods.AddUpdateRules).then(function (result) {
            success=result.success;
            if (result.success == true) {
                message = "Saved!"
            } else {
                message = result.message;
            }
        },  err => {
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
        var data = []
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
    render() {
        const { redirect } = this.state;
        const { sendApp } = this.state;

        if (redirect) {
            return <Redirect to='/login' />;
        }
        else if (sendApp) {
            return <Redirect to='/applications' />;
        }
        return (
            <CContainer className='p-5'>
                <ToastContainer/>
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
                                <CreateNodes handleRedirect={this.handleRedirect}
                                 newRuleAdd={this.newRuleAdd}
                                 deleteRole={this.deleteRole}
                                 addUpdateRule={this.addUpdateRule}
                                 getRules={this.getRules}
                                 toastShow={this.toastShow} />
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
                                <UpdateNodes handleRedirect={this.handleRedirect}
                                 newRuleAdd={this.newRuleAdd}
                                 deleteRole={this.deleteRole}
                                 addUpdateRule={this.addUpdateRule}
                                 getRules={this.getRules}
                                 toastShow={this.toastShow} />
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 3}>
                                <DeleteNodes handleRedirect={this.handleRedirect}
                                 newRuleAdd={this.newRuleAdd}
                                 deleteRole={this.deleteRole}
                                 addUpdateRule={this.addUpdateRule}
                                 getRules={this.getRules}
                                 toastShow={this.toastShow} />
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 4}>
                                <Relate handleRedirect={this.handleRedirect}
                                 newRuleAdd={this.newRuleAdd}
                                 deleteRole={this.deleteRole}
                                 addUpdateRule={this.addUpdateRule}
                                 getRules={this.getRules}
                                 toastShow={this.toastShow} />
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 5}>
                                <DeleteRelation handleRedirect={this.handleRedirect}
                                 newRuleAdd={this.newRuleAdd}
                                 deleteRole={this.deleteRole}
                                 addUpdateRule={this.addUpdateRule}
                                 getRules={this.getRules}
                                 toastShow={this.toastShow} />
                            </CTabPane>
                        </CTabContent>
                    </CCol>
                </CRow>

            </CContainer>
        )
    }
}
export default Recommendation