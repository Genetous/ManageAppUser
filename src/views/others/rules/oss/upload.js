import React, { Component } from 'react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { Link } from 'react-router-dom'
import { format } from 'date-fns';
import { ToastContainer, toast,Slide } from 'react-toastify';
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
    CFormCheck,
    CCardHeader,
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
const arrayLabels = ["not", "in"]
export class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadRules: [],
            activeKey: 1,
            activeSubKeys: [1, 1, 1, 1, 1],
            subKeys: [],
            changedTypes: [],
            visible: false,
            yesNoVisible: false,
            yesNoQuestion: "",
            arguments: [],
            sendType: ""

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
        this.getUploadRules();
    }
    async getUploadRules() {
        var orgId = localStorage.getItem('orgId')
        var appId = localStorage.getItem('appId')
        var model = {
            organizationId: orgId,
            applicationId: appId,
            service: "osService",
            methodContentType: "other",
            methodType: "upload"
        }
        var d = { ...this.state.uploadRules };
        d = await this.props.getRules(model);
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

        this.setState({ uploadRules: d, subKeys: sk });
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
        this.setVisible(false);
        this.props.toastShow("info", "Processing....");
        var eleman = document.getElementById("newrule");
        if (!eleman.value) {
            this.props.toastShow("error","Role Name cannot be null or empty!")
            return false;
        }
        var orgId = localStorage.getItem("orgId");
        var appId = localStorage.getItem("appId");
        var model = {
            organizationId: orgId,
            applicationId: appId,
            rules: [
                {
                    method: "/osservice/upload",
                    methodType: "upload",
                    methodContentType: "other",
                    service: "osService",
                    permissions: [{
                        role: eleman.value,
                        permitted: {
                            extensions: []
                        },
                        nonPermitted: {
                            extensions: []
                        }
                    }]
                }
            ]
        }
        await this.props.newRuleAdd(model);
        this.getUploadRules();
    }
    async addUpdateRule() {
        this.setVisible(false);
        this.props.toastShow("info", "Processing....");
        var uploadRules = [...this.state.uploadRules]
        var rule = uploadRules[0].roleRules;
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
    async deleteRole(args) {
        this.setVisible(false);
        this.props.toastShow("info", "Processing....");
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
            var uploadRules = [...this.state.uploadRules]
            var permissions = uploadRules[0].roleRules.permissions;
            permissions.splice(index, 1);
            this.setState({ uploadRules });
        }
    }
    addExt(permIndex, type, e) {
        var uploadRules = [...this.state.uploadRules]
        var collection = uploadRules[0].roleRules.permissions[permIndex][type].extensions;
        if (e.target.value.toString().indexOf(",") >= 0) {
            var arr = this.getValueAsArrayByType(e.target.value, "string");
            if (arr[0] && collection.indexOf(arr[0]) < 0) {
                collection.push(arr[0]);
            }
            e.target.value = "";
        }
        this.setState({ uploadRules });
        this.props.setData(this.props.position, true);
    }
    getExt(val, permIndex, extensionIndex, type) {
        return (
            <p className="p-1 rounded border border-primary text-primary">{val}
                <span style={fRight}> <button type="button"
                    onClick={this.removeExt.bind(this, permIndex, extensionIndex, type)}
                    class="btn-close" aria-label="Close"></button></span>
            </p>
        )
    }
    removeExt(permIndex, extensionIndex, type, e) {
        var uploadRules = [...this.state.uploadRules]
        var collection = uploadRules[0].roleRules.permissions[permIndex][type].extensions
        collection.splice(extensionIndex, 1);
        this.setState({ uploadRules });
        this.props.setData(this.props.position, true);
    }
    getValueAsArrayByType(val, type) {
        var arr = []
        var d = val.toString();
        var ind = d.indexOf(',');
        if (ind >= 0) {
            var arrElems = val.split(",");
            switch (type) {
                case "string":
                    arr = arrElems;
                    break;
                case "number":
                    arrElems.map((item) => {
                        arr.push(parseInt(item));
                    });
            }
        }
        else {
            switch (type) {
                case "string":
                    if (val) {
                        arr.push(val)
                    }
                    break;
                case "number":
                    if (!isNaN(val)) {
                        arr.push(val)
                    }
                    break;
            }
        }

        return arr;
    }
    render() {

        return (
            <CCard>
                <CRow className='m-2 border-bottom d-flex align-items-center'>
                    <CCol className='col-8 pb-2'>
                        <CCardTitle>Add/Update <b>"Object Storage Service Upload"</b> Permissions</CCardTitle>
                    </CCol>
                    <CCol className='col-4 d-grid gap-2 d-md-flex justify-content-md-end pb-2'>
                        <CButton color='secondary' onClick={this.setVisible.bind(this, true)}>Add New Role</CButton>
                        <CButton color='info' style={{"color":"#fff"}}
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

                    {this.state.uploadRules.length > 0 &&

                        this.state.uploadRules[0].roleRules.permissions.map((item, index) => (
                            <CCard className='mt-1'>
                                <CCardBody>
                                    <CCardTitle><b>"{item.role}"</b> Rules  <span style={fRight}>
                                        <CButton color='danger'
                                            onClick={this.setYesNoVisible.bind(this, true, "Are you sure you want to delete " + item.role + " role?", "deleteRole", [item._id, index, this])}
                                            //onClick={this.deleteRole.bind(this,item._id,index)}
                                            style={dangerIcon}>Delete Role</CButton></span></CCardTitle>
                                    <CNav variant="tabs" className='mt-4' role="tablist" style={vars} >
                                        <CNavItem>
                                            <CNavLink
                                                style={vars}
                                                active={this.getSubActiveKey(this, 1, item._id)}
                                                onClick={this.setSubActiveKey.bind(this, 1, item._id)}
                                            >
                                                Permitted
                                            </CNavLink>
                                        </CNavItem>
                                        <CNavItem>
                                            <CNavLink
                                                style={vars}
                                                active={this.getSubActiveKey(this, 2, item._id)}
                                                onClick={this.setSubActiveKey.bind(this, 2, item._id)}
                                            >
                                                Non-Permitted
                                            </CNavLink>
                                        </CNavItem>

                                    </CNav>
                                    <CTabContent>
                                        <CTabPane role="tabpanel" className='p-3' aria-labelledby="home-tab" visible={this.getSubActiveKey(this, 1, item._id)}>
                                            <CCard className='mt-2'>
                                                <CCardHeader>
                                                    <CCardTitle className='p-2'>Extensions</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    <CRow className='mt-2 pb-2'>
                                                        <CCol className='col-9'>
                                                            <CFormInput type='text' name='extension'
                                                                onChange={this.addExt.bind(this, index, "permitted")}
                                                                placeholder='Extensions with comma' />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow className='mt-2'>
                                                        {item.permitted.extensions.map((c, i) => (
                                                            <CCol className='col-3'>
                                                                {this.getExt(c, index, i, "permitted")}
                                                            </CCol>

                                                        ))}

                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                        </CTabPane>
                                        <CTabPane role="tabpanel" className='p-3' aria-labelledby="profile-tab" visible={this.getSubActiveKey(this, 2, item._id)}>
                                            <CCard className='mt-2'>
                                                <CCardHeader>
                                                    <CCardTitle className='p-2'>Extensions</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    <CRow className='mt-2 pb-2'>
                                                        <CCol className='col-9'>
                                                            <CFormInput type='text' name='extension'
                                                                onChange={this.addExt.bind(this, index, "nonPermitted")}
                                                                placeholder='Extensions with comma' />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow className='mt-2'>
                                                        {item.nonPermitted.extensions.map((c, i) => (
                                                            <CCol className='col-3'>
                                                                {this.getExt(c, index, i, "nonPermitted")}
                                                            </CCol>

                                                        ))}

                                                    </CRow>
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
export default Upload