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
export class GetCollections extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collectionCreateRules: [],
            activeKey: 1,
            activeSubKeys: [1, 1, 1, 1, 1],
            subKeys: [],
            changedTypes: [],
            visible: false,
            yesNoVisible: false,
            yesNoQuestion: "",
            arguments: [],
            sendType: "",
            compare:["eq","not","gt","gte","lt","lte","in"]

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
        this.getCollectionRules();
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

        this.setState({ collectionCreateRules: d, subKeys: sk });
    }
    async getCollectionRules() {
        var orgId = localStorage.getItem('orgId')
        var appId = localStorage.getItem('appId')
        var model = {
            organizationId: orgId,
            applicationId: appId,
            service: this.props.service,
            methodContentType: "collection",
            methodType: "read"
        }
        var d = { ...this.state.collectionCreateRules };
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
    getContentData(item, key, permIndex, type) {
        return (
            <div>
                {Object.keys(item).length < 1 &&
                    <CRow className='mt-2 justify-content-center'>
                        <CCol className='col-2'>
                            <CButton color='primary' onClick={this.addNewContentDataSub.bind(this, key, permIndex, type)}><CIcon style={dangerIcon} icon={icon.cilPlus} /></CButton>
                        </CCol>
                    </CRow>
                }
                {typeof item == "object" &&
                    Object.keys(item).map((k, i) => {
                        return (
                            <div>
                                <CRow className='mt-2'>
                                    <CCol className='col-3'>
                                        <CFormSelect onChange={this.eqChanged.bind(this, key, k, permIndex, type, i)}
                                            value={k} name={this.getValueType(item[k])}>
                                            <option value="eq">{'='}</option>
                                            <option value="not">{'!='}</option>
                                            <option value="gt">{'>'}</option>
                                            <option value="gte">{'>='}</option>
                                            <option value="lt">{'<'}</option>
                                            <option value="lte">{'<='}</option>
                                            <option value="in">{'in'}</option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol className='col-3'>
                                        <CFormInput type='text' name='value' onChange={this.changeContentDataSubKey.bind(this, key, k, permIndex, type)} placeholder={arrayLabels.indexOf(k) < 0 ? "value" : "values with comma"} value={arrayLabels.indexOf(k) < 0 ? item[k] : this.value} />
                                    </CCol>
                                    <CCol className='col-3'>
                                        <CFormSelect id={key + "_" + k + "_" + permIndex + "_" + type}
                                            onChange={this.typeChanged.bind(this, key, k, permIndex, type, i)}
                                            value={this.getValueType(item[k])}
                                            disabled={item[k].length<1} >
                                            <option value="string">{'String'}</option>
                                            <option value="number">{'Integer'}</option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol className='col-1 align-self-center'>
                                        <button type="button"
                                            onClick={this.removeContentDataSubKey.bind(this, key, k, permIndex, type)}
                                            class="btn-close" aria-label="Remove" />
                                    </CCol>

                                    {Object.keys(item).length - 1 == i &&
                                        <CCol className='col-1'>
                                            <CButton color='primary' onClick={this.addNewContentDataSub.bind(this, key, permIndex, type)}><CIcon style={dangerIcon} icon={icon.cilPlus} /></CButton>
                                        </CCol>
                                    }
                                </CRow>
                                {arrayLabels.indexOf(k) >= 0 &&
                                    <CRow className='mt-2'>
                                        {item[k].map((val =>
                                            <CCol className='col-3'>
                                                {this.getArrayItems(val, key, k, permIndex, type)}
                                            </CCol>
                                        ))}
                                    </CRow>
                                }
                            </div>
                        );
                    })
                }

            </div>
        );


    }
    getArrayItems(val, key, k, permIndex, type) {
        return (
            <p className="p-1 rounded border border-primary text-primary">{val}
                <span style={fRight}> <button type="button"
                    onClick={this.removeContentDataSubKeyArray.bind(this, key, k, permIndex, type, val)}
                    class="btn-close" aria-label="Close"></button></span>
            </p>
        )
    }

    eqChanged(key, k, permIndex, type, keyIndex, e) {
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var collection = collectionCreateRules[0].roleRules.permissions[permIndex][type];
        var newContentData = {}

        Object.keys(collection.contentData[key]).map((ki, i) => {
            if (keyIndex == i) {
                if (arrayLabels.indexOf(e.target.value) < 0)
                    newContentData[e.target.value] = collection.contentData[key][ki]
                else {
                    var arr = this.getValueAsArrayByType(collection.contentData[key][ki], e.target.name);
                    newContentData[e.target.value] = arr
                }
            } else {
                newContentData[ki] = collection.contentData[key][ki]
            }
        })
        collection.contentData[key] = newContentData;
        this.setState({ collectionCreateRules });
        this.props.setData(this.props.position, true);
    }
    typeChanged(key, k, permIndex, type, keyIndex, e) {
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var collection = collectionCreateRules[0].roleRules.permissions[permIndex][type];
        var newContentData = {}
        Object.keys(collection.contentData[key]).map((ki, i) => {
            if (keyIndex == i) {
                if (arrayLabels.indexOf(k) < 0)
                    newContentData[k] = this.convert(collection.contentData[key][ki], e.target.value);
                else {
                    var arr = this.convert(collection.contentData[key][ki], e.target.value);
                    newContentData[k] = arr
                }
            } else {
                newContentData[ki] = collection.contentData[key][ki]
            }
        })
        collection.contentData[key] = newContentData;
        this.setState({ collectionCreateRules });
        this.props.setData(this.props.position, true);
    }
    removeContentDataSubKey(key, k, permIndex, type) {
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var collection = collectionCreateRules[0].roleRules.permissions[permIndex][type];
        delete collection.contentData[key][k];
        this.setState({ collectionCreateRules });
        this.props.setData(this.props.position, true);

    }
    removeContentDataSubKeyArray(key, k, permIndex, type, val) {
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var collection = collectionCreateRules[0].roleRules.permissions[permIndex][type];
        const index = collection.contentData[key][k].indexOf(val);
        if (index > -1) {
            collection.contentData[key][k].splice(index, 1);
        }
        this.setState({ collectionCreateRules });
        this.props.setData(this.props.position, true);

    }

    changeContentDataSubKey(key, k, permIndex, type, e) {
        var eleman = document.getElementById(key + "_" + k + "_" + permIndex + "_" + type)
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var collection = collectionCreateRules[0].roleRules.permissions[permIndex][type];
        if (arrayLabels.indexOf(k) < 0)
            collection.contentData[key][k] = e.target.value;
        else {
            if (e.target.value.toString().indexOf(",") >= 0) {
                var arr = this.getValueAsArrayByType(e.target.value, eleman.value);
                switch (eleman.value) {
                    case "string":
                        if (arr[0] && collection.contentData[key][k].indexOf(arr[0]) < 0) {
                            collection.contentData[key][k].push(arr[0]);
                        }
                        break;
                    case "number":
                        if (!isNaN(arr[0]) && collection.contentData[key][k].indexOf(arr[0]) < 0) {
                            collection.contentData[key][k].push(arr[0]);
                        }
                        break;
                }
                e.target.value = "";
            }
            else if (e.target.value.toString().trim() == "") {
                e.target.value = "";
            }
        }
        this.setState({ collectionCreateRules });
        this.props.setData(this.props.position, true);

    }
    addNewContentDataSub(key, permIndex, type) {
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var collection = collectionCreateRules[0].roleRules.permissions[permIndex][type];
        for(var i=0;i<this.state.compare.length;++i){
            if(!(this.state.compare[i] in collection.contentData[key])){
                 if(i>0 && collection.contentData[key][this.state.compare[i-1]].length>0){
                    collection.contentData[key][this.state.compare[i]] = [];
                }else if(i==0){
                    collection.contentData[key][this.state.compare[i]] = [];
                }
                break;
            }
        }
        this.setState({ collectionCreateRules });
        this.props.setData(this.props.position, true);

    }
    removeContentDataKey(key, permIndex, type) {
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var collection = collectionCreateRules[0].roleRules.permissions[permIndex][type];
        delete collection.contentData[key];
        this.setState({ collectionCreateRules });
        this.props.setData(this.props.position, true);

    }
    changeContentDataKey(key, permIndex, type, keyIndex, e) {
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var collection = collectionCreateRules[0].roleRules.permissions[permIndex][type]
        var newContentData = {}
        Object.keys(collection.contentData).map((k, i) => {
            if (keyIndex == i) {
                newContentData[e.target.value] = collection.contentData[k]
            } else {
                newContentData[k] = collection.contentData[k]
            }
        })
        collection.contentData = newContentData;
        this.setState({ collectionCreateRules });
        this.props.setData(this.props.position, true);

    }

    addNewContentData(permIndex, type) {
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var collection = collectionCreateRules[0].roleRules.permissions[permIndex][type];
        collection.contentData["newkey"] = {};
        this.setState({ collectionCreateRules });
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
    convert(val, type) {
        if (!Array.isArray(val)) {
            switch (type) {
                case "string":
                    return val.toString();
                case "number":
                    return parseInt(val);
            }
        } else {
            switch (type) {
                case "string":
                    var arr = [];
                    val.map((item) => {
                        arr.push(item.toString());
                    });
                    return arr;
                case "number":
                    var arr = [];
                    val.map((item) => {
                        var item = parseInt(item);
                        if (!isNaN(item))
                            arr.push(item);
                    });
                    return arr;
            }

        }
    }
    async addUpdateRule() {
        this.setVisible(false);
        this.props.toastShow("info", "Processing....");
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var rule = collectionCreateRules[0].roleRules;
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
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var rule = collectionCreateRules[0].roleRules;
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
                    method: rule.method,
                    methodType: "read",
                    methodContentType: "collection",
                    service: this.props.service,
                    permissions: [{
                        role: eleman.value,
                        permitted: {
                            collectionNames: [
                            ],
                            contentData: {},
                            contentKeys: [
                            ]
                        },
                        nonPermitted: {
                            collectionNames: [
                            ],
                            contentData: {},
                            contentKeys: [
                            ]
                        }
                    }]
                }
            ]
        }
        await this.props.newRuleAdd(model);
        this.getCollectionRules();
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
            var collectionCreateRules = [...this.state.collectionCreateRules]
            var permissions = collectionCreateRules[0].roleRules.permissions;
            permissions.splice(index, 1);
            this.setState({ collectionCreateRules });
        }
    }
    addExt(permIndex, type, item, e) {
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var collection = collectionCreateRules[0].roleRules.permissions[permIndex][type][item];
        if (e.target.value.toString().indexOf(",") >= 0) {
            var arr = this.getValueAsArrayByType(e.target.value, "string");
            if (arr[0] && collection.indexOf(arr[0]) < 0) {
                collection.push(arr[0]);
            }
            e.target.value = "";
        }
        this.setState({ collectionCreateRules });
        this.props.setData(this.props.position, true);
    }
    getExt(val, permIndex, collectionNameIndex, type, item) {
        return (
            <CCol md={3}>
                <p className="p-1 rounded border border-primary text-primary">{val}
                    <span style={fRight}> <button type="button"
                        onClick={this.removeExt.bind(this, permIndex, collectionNameIndex, type, item)}
                        class="btn-close" aria-label="Close"></button></span>
                </p>
            </CCol>
        )
    }
    removeExt(permIndex, collectionNameIndex, type, item, e) {
        var collectionCreateRules = [...this.state.collectionCreateRules]
        var collection = collectionCreateRules[0].roleRules.permissions[permIndex][type][item]
        collection.splice(collectionNameIndex, 1);
        this.setState({ collectionCreateRules });
        this.props.setData(this.props.position, true);
    }
    render() {

        return (
            <CCard>
                <CRow className='m-2 border-bottom d-flex align-items-center'>
                    <CCol className='col-6 pb-2'>
                        <CCardTitle>Add/Update <b>"Get Collection"</b> Permissions</CCardTitle>
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

                    {this.state.collectionCreateRules.length > 0 &&

                        this.state.collectionCreateRules[0].roleRules.permissions.map((item, index) => (
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
                                                    <CCardTitle className='p-2'>CollectionNames</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    <CRow className='mt-2 pb-2'>
                                                        <CCol className='col-9'>
                                                            <CFormInput type='text' name='collectionNames'
                                                                onChange={this.addExt.bind(this, index, "permitted", "collectionNames")}
                                                                placeholder='collectionNames with comma' />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        {item.permitted.collectionNames.map((c, i) => (
                                                            this.getExt(c, index, i, "permitted", "collectionNames")
                                                        ))}
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                            <CCard className='mt-2'>
                                                <CCardHeader>
                                                    <CCardTitle className='p-2'>Content Data</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    {Object.keys(item.permitted.contentData).map((key, keyIndex) => (
                                                        <div>
                                                            <CRow className='mt-2'>
                                                                <CCol className='col-11'>
                                                                    <CCard>
                                                                        <CCardBody>
                                                                            <CRow className='mt-2 pb-2 border-bottom'>
                                                                                <CCol className='col-9'><CFormInput type='text' placeholder='Content Field'
                                                                                    value={key} onChange={this.changeContentDataKey.bind(this, key, index, "permitted", keyIndex)} /></CCol>
                                                                                <CCol className='col-1 align-self-center'>
                                                                                    <button type="button"
                                                                                        onClick={this.removeContentDataKey.bind(this, key, index, "permitted")}
                                                                                        class="btn-close" aria-label="Remove" />
                                                                                </CCol>
                                                                            </CRow>
                                                                            {this.getContentData(item.permitted.contentData[key], key, index, "permitted")}
                                                                        </CCardBody>
                                                                    </CCard>
                                                                </CCol>
                                                            </CRow>


                                                        </div>
                                                    ))
                                                    }

                                                    <CRow className='mt-2 justify-content-center'>
                                                        <CCol className='col-6 text-center'>
                                                            <CButton onClick={this.addNewContentData.bind(this, index, "permitted")}><CIcon icon={icon.cilPlus} />Add New Content Data</CButton>
                                                        </CCol>
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                            <CCard className='mt-2'>
                                                <CCardHeader>
                                                    <CCardTitle className='p-2'>Content Keys</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    <CRow className='mt-2 pb-2'>
                                                        <CCol className='col-9'>
                                                            <CFormInput type='text' name='contentKeys'
                                                                onChange={this.addExt.bind(this, index, "permitted", "contentKeys")}
                                                                placeholder='Content Keys with comma' />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        {item.permitted.contentKeys.map((c, i) => (
                                                            this.getExt(c, index, i, "permitted", "contentKeys")
                                                        ))}
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                        </CTabPane>
                                        <CTabPane role="tabpanel" className='p-3' aria-labelledby="profile-tab" visible={this.getSubActiveKey(this, 2, item._id)}>
                                            <CCard className='mt-2'>
                                                <CCardHeader>
                                                    <CCardTitle className='p-2'>CollectionNames</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    <CRow className='mt-2 pb-2'>
                                                        <CCol className='col-9'>
                                                            <CFormInput type='text' name='collectionNames'
                                                                onChange={this.addExt.bind(this, index, "nonPermitted", "collectionNames")}
                                                                placeholder='collectionNames with comma' />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        {item.nonPermitted.collectionNames.map((c, i) => (
                                                            this.getExt(c, index, i, "nonPermitted", "collectionNames")
                                                        ))}
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                            <CCard className='mt-2'>
                                                <CCardHeader>
                                                    <CCardTitle className='p-2'>Content Data</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    {Object.keys(item.nonPermitted.contentData).map((key, keyIndex) => (
                                                        <div>
                                                            <CRow className='mt-2'>
                                                                <CCol className='col-11'>
                                                                    <CCard>
                                                                        <CCardBody>
                                                                            <CRow className='mt-2 pb-2 border-bottom'>
                                                                                <CCol className='col-9'><CFormInput type='text' placeholder='Content Field'
                                                                                    value={key} onChange={this.changeContentDataKey.bind(this, key, index, "nonPermitted", keyIndex)} /></CCol>
                                                                                <CCol className='col-1 align-self-center'>
                                                                                    <button type="button"
                                                                                        onClick={this.removeContentDataKey.bind(this, key, index, "nonPermitted")}
                                                                                        class="btn-close" aria-label="Remove" />
                                                                                </CCol>
                                                                            </CRow>
                                                                            {this.getContentData(item.nonPermitted.contentData[key], key, index, "nonPermitted")}
                                                                        </CCardBody>
                                                                    </CCard>
                                                                </CCol>
                                                            </CRow>


                                                        </div>
                                                    ))
                                                    }

                                                    <CRow className='mt-2 justify-content-center'>
                                                        <CCol className='col-6 text-center'>
                                                            <CButton onClick={this.addNewContentData.bind(this, index, "nonPermitted")}><CIcon icon={icon.cilPlus} />Add New Content Data</CButton>
                                                        </CCol>
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                            <CCard className='mt-2'>
                                                <CCardHeader>
                                                    <CCardTitle className='p-2'>Content Keys</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    <CRow className='mt-2 pb-2'>
                                                        <CCol className='col-9'>
                                                            <CFormInput type='text' name='contentKeys'
                                                                onChange={this.addExt.bind(this, index, "nonPermitted", "contentKeys")}
                                                                placeholder='Content Keys with comma' />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        {item.nonPermitted.contentKeys.map((c, i) => (
                                                            this.getExt(c, index, i, "nonPermitted", "contentKeys")
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
export default GetCollections