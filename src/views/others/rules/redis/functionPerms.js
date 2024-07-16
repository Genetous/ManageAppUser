import React, { Component } from 'react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { Link } from 'react-router-dom'
import { format } from 'date-fns';
import { ToastContainer, toast, Slide } from 'react-toastify';
import Popup from '../../../widgets/Popup';
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
    CFormCheck
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
export class FunctionPerms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            functions: [
                {
                    Name: "Get Value",
                    Url: "get/value"
                },
                {
                    Name: "Get Hash",
                    Url: "get/hash"
                },
                {
                    Name: "Get List",
                    Url: "get/list"
                },
                {
                    Name: "Get Sets",
                    Url: "get/sets"
                },
                {
                    Name: "Get Sorted",
                    Url: "get/sorted"
                },
                {
                    Name: "Add Value",
                    Url: "add/value"
                },
                {
                    Name: "Add Hash",
                    Url: "add/hash"
                },
                {
                    Name: "Add List",
                    Url: "add/list"
                },
                {
                    Name: "Add Sets",
                    Url: "add/sets"
                },
                {
                    Name: "Add Sorted",
                    Url: "add/sorted"
                },
                {
                    Name: "Delete Key",
                    Url: "delete/key"
                },
                {
                    Name: "Remove Hash",
                    Url: "remove/hash"
                },
                {
                    Name: "Remove List",
                    Url: "remove/list"
                },
                {
                    Name: "Remove Sets",
                    Url: "remove/sets"
                },
                {
                    Name: "Remove Sorted",
                    Url: "remove/sorted"
                }
            ],
            functionRules: [],
            activeKey: 1,
            activeSubKeys: [1, 1, 1, 1, 1],
            subKeys: [],
            visible: false,
            yesNoVisible: false,
            yesNoQuestion: "",
            arguments: [],
            sendType: "",

        }
    }

    setSubActiveKey(key, id) {
        const { subKeys } = this.state;
        var index = subKeys.findIndex(x => x.id === id);
        subKeys[index].activeKey = key;
        this.setState({ subKeys });
        return false;
    }
    getSubActiveKey(e, key, id) {
        const { subKeys } = this.state;
        var index = subKeys.findIndex(x => x.id === id);
        return key == subKeys[index].activeKey
    }
    componentDidMount() {
        this.getFunctionRules();
    }
    setSubKey(d) {
        var sk = [];
        if (d.length > 0) {
            var rr = d[0];
            rr.roleRules.permissions.map(m => {
                var data = {
                    id: m._id,
                    activeKey: 1
                }
                sk.push(data);
            })
        }

        this.setState({ functionRules: d, subKeys: sk });
    }
    async getFunctionRules() {
        var orgId = localStorage.getItem('orgId')
        var appId = localStorage.getItem('appId')
        var model = {
            organizationId: orgId,
            applicationId: appId,
            service: "redisservice",
            methodContentType: "any",
            methodType: "any"
        }
        var d = { ...this.state.functionRules };
        d = await this.props.getRules(model);

        this.setSubKey(d);
    }
    getValueType(val) {
        if (Array.isArray(val)) {
            if (val.length > 0) {
                return typeof val[0]
            }
        }
        return typeof val;
    }
    async addUpdateRule() {
        this.setVisible(false);
        this.props.toastShow("info", "Processing....");
        var functionRules = [...this.state.functionRules]
        var rule = functionRules[0].roleRules;
        var rls = {
            method: rule.method,
            methodType: rule.methodType,
            methodContentType: rule.methodContentType,
            service: rule.service,
            permissions: rule.permissions
        }
        var orgId = localStorage.getItem("orgId");
        var appId = localStorage.getItem("appId");
        var model = {
            organizationId: orgId,
            applicationId: appId,
            rules: [rls]
        }
        this.props.addUpdateRule(model);
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
                    case "deleteRole":
                        await this.deleteRole(this.state.arguments);
                        break;
                    case "saveAll":
                        await this.addUpdateRule();
                        break;
                }
            }
            this.setState({ yesNoVisible: vis, yesNoQuestion: "", sendType: "", arguments: [] });
        }
    }
    async newRuleAdd() {
        var functionRules = [...this.state.functionRules]
        var eleman = document.getElementById("newrule");
        if (!eleman.value) {
            this.props.toastShow("error", "Role Name cannot be null or empty!");
            return false;
        }
        this.setVisible(false);
        this.props.toastShow("info", "Processing....");
        var orgId = localStorage.getItem("orgId");
        var appId = localStorage.getItem("appId");
        var model = {
            organizationId: orgId,
            applicationId: appId,
            rules: [
                {
                    method: "any",
                    methodType: "any",
                    methodContentType: "any",
                    service: "redisservice",
                    permissions: [{
                        role: eleman.value,
                        permitted:{
                            functions:[]
                        },
                        nonPermitted:{
                            functions:[]
                        }
                    }]
                }
            ]
        }
        await this.props.newRuleAdd(model);
        this.getFunctionRules();
    }
    async deleteRole(args) {
        this.setVisible(false);
        this.props.toastShow("info", "Processing...");
        var id = args[0];
        var index = args[1];
        var orgId = localStorage.getItem('orgId')
        var appId = localStorage.getItem('appId')
        var model = {
            organizationId: orgId,
            applicationId: appId,
            id: id
        }
        var success = await this.props.deleteRole(model);
        if (success) {
            var functionRules = [...this.state.functionRules]
            var permissions = functionRules[0].roleRules.permissions;
            permissions.splice(index, 1);
            this.setState({ functionRules });
        }
    }

    addValue(item,index){
        var functionRules = [...this.state.functionRules]
        functionRules[0].roleRules.permissions[index].permitted.functions.push(item);
        this.setState({ functionRules });
        this.props.setData(this.props.position, true);
    }
    removeValue(permIndex,itemIndex) {
        var functionRules = [...this.state.functionRules]
        var collection = functionRules[0].roleRules.permissions[permIndex].permitted.functions;
        collection.splice(itemIndex, 1);
        this.setState({ functionRules });
        this.props.setData(this.props.position, true);
    }
    hasValue(item,index){
        var functionRules = [...this.state.functionRules]
        var checked = functionRules[0].roleRules.permissions[index].permitted.functions.some(val => val.Name === item);
        return checked
    }
    changed(index,ind){
        var functions = [...this.state.functions]
        var item=functions[ind]
        if(this.hasValue(item.Name,index)){
            var itemIndex = this.state.functionRules[0].roleRules.permissions[index].permitted.functions.findIndex(x => x.Name === item.Name);
            this.removeValue(index,itemIndex);
        }else{
            this.addValue(item,index);
        }
    }
    render() {

        return (
            <CCard>
                <CRow className='m-2 border-bottom d-flex align-items-center'>
                    <CCol className='col-6 pb-2'>
                        <CCardTitle>Add/Update <b>"Redis Function"</b> Permissions</CCardTitle>
                    </CCol>
                    <CCol className='col-6 d-grid gap-2 d-md-flex justify-content-md-end pb-2'>
                        <CButton color='secondary' onClick={this.setVisible.bind(this, true)}>Add New Role</CButton>
                        <CButton color='info' style={{ "color": "#fff" }}
                            onClick={this.setYesNoVisible.bind(this, true, "Are you sure you want to save all?", "saveAll", [this])}>Save All</CButton>
                    </CCol>

                    <CModal visible={this.state.visible} onClose={this.setVisible.bind(this, false)}>
                        <CModalHeader>
                            <CModalTitle>Add New Role</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CFormInput type='text' placeholder='Role Name' name="newRule" id="newrule" />
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={this.setVisible.bind(this, false)}>
                                Close
                            </CButton>
                            <CButton color="primary" onClick={this.newRuleAdd.bind(this)}>Create Role</CButton>
                        </CModalFooter>
                    </CModal>
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

                    {this.state.functionRules.length > 0 &&

                        this.state.functionRules[0].roleRules.permissions.map((item, index) => (
                            <CCard className='mt-1'>
                                <CCardBody>
                                    <CCardTitle><b>"{item.role}"</b> Rules  <span style={fRight}>
                                        <CButton color='danger'
                                            onClick={this.setYesNoVisible.bind(this, true, "Are you sure you want to delete " + item.role + " role?", "deleteRole", [item._id, index, this])}
                                            style={dangerIcon}>Delete Role</CButton></span></CCardTitle>
                                    <CNav variant="tabs" className='mt-4' role="tablist" style={vars} >
                                        <CNavItem>
                                            <CNavLink
                                                style={vars}
                                                active={this.getSubActiveKey(this, 1, item._id)}
                                                onClick={this.setSubActiveKey.bind(this, 1, item._id)}
                                            >
                                                Permitted Functions
                                            </CNavLink>
                                        </CNavItem>

                                    </CNav>
                                    <CTabContent>
                                        <CTabPane role="tabpanel" className='p-3' aria-labelledby="home-tab" visible={this.getSubActiveKey(this, 1, item._id)}>
                                            <CCard className='mt-2'>
                                                <CCardHeader>
                                                    <CCardTitle className='p-2'>Functions</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    {this.state.functions.map((it, ind) => (
                                                        <CRow className='mt-2 pb-2'>
                                                            <CCol className='col-9'>
                                                            <CFormCheck onChange={this.changed.bind(this, index,ind)} label={it.Name} name={it.Url} checked={this.hasValue(it.Name,index)} />
                                                            </CCol>
                                                        </CRow>
                                                    ))}
                                                </CCardBody>
                                            </CCard>
                                        </CTabPane>
                                    </CTabContent>
                                </CCardBody>
                            </CCard>
                        ))}
                </CCardBody>


            </CCard>
        )
    }
}
export default FunctionPerms