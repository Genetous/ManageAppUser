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
    CFormCheck,
    CCardHeader,
    CDropdown,
    CDropdownMenu,
    CDropdownItem,
    CDropdownToggle,
    CFormTextarea,
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
export class Execute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            executeRules: [],
            selectedQuery: { indexName: "", redis: "", permitted: [], functionName: "" },
            functionNames: ["Get Value", "Get Hash", "Get List", "Get Sets"
                , "Get Sorted", "Add Value", "Add Hash", "Add List", "Add Sets", "Add Sorted",
                "Delete Key","Remove Hash Key","Remove From List","Remove From Sets","Remove From Sorted"],
            newIndex: true,
            activeKey: 1,
            activeSubKeys: [1, 1, 1, 1, 1],
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
        this.getExecuteRedis();
    }
    async getExecuteRedis() {
        var orgId = localStorage.getItem('orgId')
        var appId = localStorage.getItem('appId')
        var model = {
            organizationId: orgId,
            applicationId: appId,
            type: "redis"
        }
        var d = { ...this.state.executeRules };
        d = await this.props.getIndex(model);

        this.setState({ executeRules: d.data });
    }
    async getRedis(val) {
        var orgId = localStorage.getItem('orgId')
        var appId = localStorage.getItem('appId')
        var model = {
            organizationId: orgId,
            applicationId: appId,
            indexName: val
        }
        var d = { ...this.state.selectedQuery };
        d = await this.props.getQuery(model);
        if (d != null && d.length > 0)
            this.setState({ selectedQuery: d[0] });
    }
    getForm() {
        return <CCard className='mt-2'>
            <CCardTitle>Edit - {this.state.selectedQuery.indexName}</CCardTitle>
            <CCardBody>
                <CRow>
                    <CCol md={{ span: 6, offset: 3 }} className='text-center'>
                        <CFormSelect value={this.state.selectedQuery.functionName} onChange={this.changedValues.bind(this)} name='functionName'>
                            <option value="0">Select your functionName</option>
                            {this.state.functionNames.length > 0 &&
                                this.state.functionNames.map((item, index) => (
                                    <option>{item}</option>
                                ))}
                        </CFormSelect>
                    </CCol>
                </CRow>
                <CRow className='mt-2 pb-2'>
                    <CCol>
                        <CFormTextarea value={this.state.selectedQuery.redis}
                            name='redis'
                            onChange={this.changedValues.bind(this)}
                            placeholder='Insert your Genetous Redis command'
                        ></CFormTextarea>
                    </CCol>
                </CRow>

                <CRow className='mt-2 pb-2'>
                    <CCol className='col-12'>
                        <CFormInput type='text' name='extension'
                            onChange={this.addExt.bind(this)}
                            placeholder='Permitted Roles with comma' />
                    </CCol>
                </CRow>
                <CRow className='mt-2'>
                    {this.state.selectedQuery.permitted.map((c, i) => (
                        <CCol className='col-3'>
                            {this.getExt(c, i)}
                        </CCol>

                    ))}

                </CRow>
                <CRow>
                    <CCol className='col-12 d-grid gap-2 d-md-flex justify-content-md-end pb-2 mt-2'>
                        <CButton color='info' style={{ "color": "#fff" }}
                            onClick={this.setYesNoVisible.bind(this, true, "Are you sure you want to update index?", "updateIndex", [this])}>Update Index</CButton>
                        <CButton color='danger' style={{ "color": "#fff" }}
                            onClick={this.setYesNoVisible.bind(this, true, "Are you sure you want to delete index?", "deleteIndex", [this])}>Delete Index</CButton>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    }
    getFormNew() {
        return <CCard className='mt-2'>
            <CCardBody>
                <CRow>
                    <CCol md={{ span: 6, offset: 3 }} className='text-center'>
                        <CFormSelect onChange={this.changedValues.bind(this)} name='functionName'>
                            <option value="0">Select your functionName</option>
                            {this.state.functionNames.length > 0 &&
                                this.state.functionNames.map((item, index) => (
                                    <option>{item}</option>
                                ))}
                        </CFormSelect>
                    </CCol>
                </CRow>
                <CRow className='mt-2 pb-2'>
                    <CCol className='col-12'>
                        <CFormInput type='text' name='indexName' value={this.state.selectedQuery.indexName}
                            onChange={this.changedValues.bind(this)}
                            placeholder='Enter your unique indexName' />
                    </CCol>
                </CRow>
                <CRow className='mt-2 pb-2'>
                    <CCol>
                        <CFormTextarea name='redis' value={this.state.selectedQuery.redis}
                            placeholder='Insert your Genetous Redis Command'
                            onChange={this.changedValues.bind(this)}
                        ></CFormTextarea>
                    </CCol>
                </CRow>

                <CRow className='mt-2 pb-2'>
                    <CCol className='col-12'>
                        <CFormInput type='text' name='permitted'
                            onChange={this.addExt.bind(this)}
                            placeholder='Permitted Roles with comma' />
                    </CCol>
                </CRow>
                <CRow className='mt-2'>
                    {this.state.selectedQuery.permitted.length > 0 &&
                        this.state.selectedQuery.permitted.map((c, i) => (
                            <CCol className='col-3'>
                                {this.getExt(c, i)}
                            </CCol>

                        ))}

                </CRow>
                <CRow>
                    <CCol className='col-12 d-grid gap-2 d-md-flex justify-content-md-end pb-2 mt-2'>
                        <CButton color='info' style={{ "color": "#fff" }}
                            onClick={this.setYesNoVisible.bind(this, true, "Are you sure you want to create new index?", "createIndex", [this])}>Create Index</CButton>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    }
    changedValues(e) {
        var selectedQuery = { ...this.state.selectedQuery }
        selectedQuery[e.target.name] = e.target.value;
        this.setState({ selectedQuery })
    }
    addExt(e) {
        var selectedQuery = { ...this.state.selectedQuery }
        var collection = selectedQuery.permitted;
        if (e.target.value.toString().indexOf(",") >= 0) {
            var arr = this.getValueAsArrayByType(e.target.value, "string");
            if (arr[0] && collection.indexOf(arr[0]) < 0) {
                collection.push(arr[0]);
            }
            e.target.value = "";
        }
        this.setState({ selectedQuery });
    }
    getExt(val, index) {
        return (
            <p className="p-1 rounded border border-primary text-primary">{val}
                <span style={fRight}> <button type="button"
                    onClick={this.removeExt.bind(this, index)}
                    class="btn-close" aria-label="Close"></button></span>
            </p>
        )
    }
    removeExt(index) {
        var selectedQuery = { ...this.state.selectedQuery }
        var collection = selectedQuery.permitted;
        collection.splice(index, 1);
        this.setState({ selectedQuery });
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
    async deleteIndex() {
        this.setVisible(false);
        this.props.toastShow("info", "Processing....");
        var orgId = localStorage.getItem('orgId')
        var appId = localStorage.getItem('appId')

        var model = {
            organizationId: orgId,
            applicationId: appId,
            indexName: this.state.selectedQuery.indexName,
        }
        await this.props.delQuery(model);
        this.createNew();
        this.getExecuteRedis();
    }
    async updateIndex() {
        this.setVisible(false);
        this.props.toastShow("info", "Processing....");
        var orgId = localStorage.getItem('orgId')
        var appId = localStorage.getItem('appId')

        var model = {
            organizationId: orgId,
            applicationId: appId,
            indexName: this.state.selectedQuery.indexName,
            permitted: this.state.selectedQuery.permitted,
            redis: this.state.selectedQuery.redis,
            functionName:this.state.selectedQuery.functionName
        }
        await this.props.setQuery(model);
        this.getExecuteRedis();


    }
    async createIndex() {
        this.setVisible(false);
        this.props.toastShow("info", "Processing....");
        var orgId = localStorage.getItem('orgId')
        var appId = localStorage.getItem('appId')

        var model = {
            organizationId: orgId,
            applicationId: appId,
            indexName: this.state.selectedQuery.indexName,
            permitted: this.state.selectedQuery.permitted,
            redis: this.state.selectedQuery.redis,
            functionName:this.state.selectedQuery.functionName
        }
        await this.props.setQuery(model);
        this.createNew();
        this.getExecuteRedis();


    }
    createNew() {
        let element = document.getElementsByName("selectIndex")[0];
        element.value = "0";
        var empty = { indexName: "", redis: "", permitted: [], functionName: "" }
        this.setState({ selectedQuery: empty, newIndex: true })
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
                    case "deleteIndex":
                        await this.deleteIndex();
                        break;
                    case "updateIndex":
                        await this.updateIndex();
                        break;
                    case "createIndex":
                        await this.createIndex();
                        break;
                }
            }
            this.setState({ yesNoVisible: vis, yesNoQuestion: "", sendType: "", arguments: [] });
        }
    }
    dropDownSelected(e) {
        var val = e.target.value;
        if (val !== "0") {
            var empty = { indexName: "", redis: "", permitted: [], functionName: "" };
            this.setState({ selectedQuery: empty, newIndex: false })
            this.getRedis(val);
        }
    }
    render() {

        return (
            <CCard>

                <CRow className='m-2 border-bottom d-flex align-items-center'>
                    <CCol className='col-6 pb-2'>
                        <CCardTitle>Add/Update <b>"Execute Genetous Redis Command"</b> Permissions</CCardTitle>
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
                    <CRow>
                        <CCol md={{ span: 4, offset: 4 }} className='text-center'>

                            <CFormSelect onChange={this.dropDownSelected.bind(this)} name='selectIndex'>
                                <option value="0">Select your indexName</option>
                                {this.state.executeRules.length > 0 &&
                                    this.state.executeRules.map((item, index) => (
                                        <option>{item.indexName}</option>
                                    ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow>
                        {!this.state.newIndex &&
                            <CCol md={{ span: 4, offset: 4 }} className='text-center mt-2'>
                                <CButton color='info' style={{ "color": "#fff" }}
                                    onClick={this.createNew.bind(this)}>Add New Query</CButton>
                            </CCol>
                        }
                        {Object.keys(this.state.selectedQuery).length > 0 && !this.state.newIndex &&
                            this.getForm(this.state.selectedQuery)
                        }
                        {this.state.newIndex &&
                            this.getFormNew()
                        }
                    </CRow>
                </CCardBody>


            </CCard>
        )
    }
}
export default Execute