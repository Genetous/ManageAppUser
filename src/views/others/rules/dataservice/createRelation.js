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
const arrayLabels = ["not", "in","eq"]
export class CreateRelation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            relationCreateRules: [],
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
        this.getCreateRelationRules();
    }
    async getCreateRelationRules() {
        var orgId = localStorage.getItem('orgId')
        var appId = localStorage.getItem('appId')
        var model = {
            organizationId: orgId,
            applicationId: appId,
            service: "dataservice",
            methodContentType: "relation",
            methodType: "create"
        }
        var d = { ...this.state.relationCreateRules };
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

        this.setState({ relationCreateRules: d, subKeys: sk });
    }
    getValueType(val) {
        if (Array.isArray(val)) {
            if (val.length > 0) {
                return typeof val[0]
            }
        }
        return typeof val;
    }
    getContentData(item, key, permIndex, collectionIndex, type) {
        return (
            <div>
                {Object.keys(item).length < 1 &&
                    <CRow className='mt-2 justify-content-center'>
                        <CCol className='col-2'>
                            <CButton color='primary' onClick={this.addNewContentDataSub.bind(this, key, permIndex, collectionIndex, type)}><CIcon style={dangerIcon} icon={icon.cilPlus} /></CButton>
                        </CCol>
                    </CRow>
                }
                {typeof item == "object" &&
                    Object.keys(item).map((k, i) => {
                        return (
                            <div>
                                <CRow className='mt-2'>
                                    <CCol className='col-3'>
                                        <CFormSelect onChange={this.eqChanged.bind(this, key, k, permIndex, collectionIndex, type, i)}
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
                                        <CFormInput type='text' name='value' onChange={this.changeContentDataSubKey.bind(this, key, k, permIndex, collectionIndex, type)} placeholder={arrayLabels.indexOf(k) < 0 ? "value" : "values with comma"} value={arrayLabels.indexOf(k) < 0 ? item[k] : this.value} />
                                    </CCol>
                                    <CCol className='col-3'>
                                        <CFormSelect id={key + "_" + k + "_" + permIndex + "_" + collectionIndex + "_" + type}
                                            onChange={this.typeChanged.bind(this, key, k, permIndex, collectionIndex, type, i)}
                                            value={this.getValueType(item[k])}
                                            disabled={item[k].length<1} >
                                            <option value="string">{'String'}</option>
                                            <option value="number">{'Integer'}</option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol className='col-1 align-self-center'>
                                        <button type="button"                        
                                            onClick={this.removeContentDataSubKey.bind(this, key, k, permIndex, collectionIndex, type)}
                                            class="btn-close" aria-label="Remove"/>
                                    </CCol>
                                    
                                    {Object.keys(item).length - 1 == i &&
                                        <CCol className='col-1'>
                                            <CButton color='primary' onClick={this.addNewContentDataSub.bind(this, key, permIndex, collectionIndex, type)}><CIcon style={dangerIcon} icon={icon.cilPlus} /></CButton>
                                        </CCol>
                                    }
                                </CRow>
                                {arrayLabels.indexOf(k) >= 0 &&
                                    <CRow className='mt-2'>
                                        {item[k].map((val =>
                                            <CCol className='col-3'>
                                                {this.getArrayItems(val, key, k, permIndex, collectionIndex, type)}
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
    getArrayItems(val, key, k, permIndex, collectionIndex, type) {
        return (
            <p className="p-1 rounded border border-primary text-primary">{val}
                <span style={fRight}> <button type="button"
                    onClick={this.removeContentDataSubKeyArray.bind(this, key, k, permIndex, collectionIndex, type, val)}
                    class="btn-close" aria-label="Close"></button></span>
            </p>
        )
    }

    eqChanged(key, k, permIndex, collectionIndex, type, keyIndex, e) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
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
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    typeChanged(key, k, permIndex, collectionIndex, type, keyIndex, e) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
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
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    removeContentDataSubKey(key, k, permIndex, collectionIndex, type) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
        delete collection.contentData[key][k];
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);

    }
    removeContentDataSubKeyArray(key, k, permIndex, collectionIndex, type, val) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
        const index = collection.contentData[key][k].indexOf(val);
        if (index > -1) {
            collection.contentData[key][k].splice(index, 1);
        }
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);

    }

    changeContentDataSubKey(key, k, permIndex, collectionIndex, type, e) {
        var eleman = document.getElementById(key + "_" + k + "_" + permIndex + "_" + collectionIndex + "_" + type)
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex];
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
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);

    }
    addNewContentDataSub(key, permIndex, collectionIndex, type) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
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
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);

    }
    removeContentDataKey(key, permIndex, collectionIndex, type) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
        delete collection.contentData[key];
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);

    }
    changeContentDataKey(key, permIndex, collectionIndex, type, keyIndex, e) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
        var newContentData = {}
        Object.keys(collection.contentData).map((k, i) => {
            if (keyIndex == i) {
                newContentData[e.target.value] = collection.contentData[k]
            } else {
                newContentData[k] = collection.contentData[k]
            }
        })
        collection.contentData = newContentData;
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);

    }
    changeCollectionName(permIndex, collectionIndex, type, e) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
        collection["collectionName"] = e.target.value
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    changeNonPermittedCollectionName(permIndex, collectionIndex, type, e) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
        collection["collectionName"] =e.target.value;
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    addNewContentData(permIndex, collectionIndex, type) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
        collection.contentData["newkey"] = {};
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    addNewCollection(permIndex, type) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections;
        var model = {
            collectionName: "collectionName",
            contentData: {},
            contentKeys: []
        }
        collection.push(model);
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }

    removeCollection(permIndex, index, type) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections;
        collection.splice(index, 1)
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    changeCK(permIndex, collectionIndex, type, e) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
        if (e.target.value.toString().indexOf(",") >= 0) {
            var arr = this.getValueAsArrayByType(e.target.value, "string");
            if (arr[0] && collection.contentKeys.indexOf(arr[0]) < 0) {
                collection.contentKeys.push(arr[0]);
            }
            e.target.value = "";
        }
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    removeContentKeys(val, permIndex, collectionIndex, type, e) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].collections[collectionIndex]
        const index = collection.contentKeys.indexOf(val);
        if (index > -1) {
            collection.contentKeys.splice(index, 1);
        }
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    getContentKeysItems(val, permIndex, collectionIndex, type) {
        return (
            <p className="p-1 rounded border border-primary text-primary">{val}
                <span style={fRight}> <button type="button"
                    onClick={this.removeContentKeys.bind(this, val, permIndex, collectionIndex, type)}
                    class="btn-close" aria-label="Close"></button></span>
            </p>
        )
    }
    addNewMainSub(permIndex, type) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].mainSub;
        var model = {
            main: "mainCollectionName",
            sub: []
        }
        collection.push(model);
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    removeMainSub(permIndex, index, type) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].mainSub;
        collection.splice(index, 1)
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    mainCollectionChange(permIndex, mainSubIndex, type, e) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].mainSub[mainSubIndex]
        collection.main = e.target.value;
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    changeSub(permIndex, mainSubIndex, type, e) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].mainSub[mainSubIndex]
        if (e.target.value.toString().indexOf(",") >= 0) {
            var arr = this.getValueAsArrayByType(e.target.value, "string");
            if (arr[0] && collection.sub.indexOf(arr[0]) < 0) {
                collection.sub.push(arr[0]);
            }
            e.target.value = "";
        }
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    getMainSubItems(val, permIndex, mainSubIndex, valIndex, type) {
        return (
            <p className="p-1 rounded border border-primary text-primary">{val}
                <span style={fRight}> <button type="button"
                    onClick={this.removeSub.bind(this, permIndex, mainSubIndex, valIndex, type)}
                    class="btn-close" aria-label="Close"></button></span>
            </p>
        )
    }
    removeSub(permIndex, mainSubIndex, valIndex, type, e) {
        var relationCreateRules = [...this.state.relationCreateRules]
        var collection = relationCreateRules[0].roleRules.permissions[permIndex][type].mainSub[mainSubIndex]
        collection.sub.splice(valIndex, 1);
        this.setState({ relationCreateRules });
        this.props.setData(this.props.position, true);
    }
    getValueAsArray(val) {
        var arr = []
        var d = val.toString();
        var ind = d.indexOf(',');
        if (ind >= 0) {
            arr = val.split(",");
        }
        else
            arr.push(val)

        return arr;
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
        var relationCreateRules = [...this.state.relationCreateRules]
        var rule = relationCreateRules[0].roleRules;
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
        var eleman = document.getElementById("newrule");
        if (!eleman.value) {
            this.props.toastShow("error","Role Name cannot be null or empty!")
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
                    method: "/dataservice/add/relation",
                    methodType: "create",
                    methodContentType: "relation",
                    service: "dataservice",
                    permissions: [{
                        role: eleman.value,
                        permitted: {
                            collections: [],
                            mainSub: []
                        },
                        nonPermitted: {
                            collections: [],
                            mainSub: []
                        }
                    }]
                }
            ]
        }
        await this.props.newRuleAdd(model)
        this.getCreateRelationRules();

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
        var success= await this.props.deleteRole(model);
        if (success) {
            var relationCreateRules = [...this.state.relationCreateRules]
            var permissions = relationCreateRules[0].roleRules.permissions;
            permissions.splice(index, 1);
            this.setState({ relationCreateRules });
        }
       
        
    }
    render() {

        return (
            <CCard>
                <CRow className='m-2 border-bottom d-flex align-items-center'>
                    <CCol className='col-6 pb-2'>
                        <CCardTitle>Add/Update <b>"Relation Create"</b> Permissions</CCardTitle>
                    </CCol>
                    <CCol className='col-6 d-grid gap-2 d-md-flex justify-content-md-end pb-2'>
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

                    {this.state.relationCreateRules.length > 0 &&

                        this.state.relationCreateRules[0].roleRules.permissions.map((item, index) => (
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
                                                    <CCardTitle className='p-2'>Child Collections</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    {item.permitted.collections.map((c, i) => (
                                                        <div>
                                                            <CRow className='mt-2'>
                                                                <CCol className='col-11'>
                                                                    <CFormInput type='text' name='collectionName'
                                                                        onChange={this.changeCollectionName.bind(this, index, i, "permitted")}
                                                                        placeholder='Collection Name' value={c.collectionName} />
                                                                </CCol>
                                                                <CCol className='align-self-center'>
                                                                    <span style={fRight}> <button type="button"
                                                                        onClick={this.removeCollection.bind(this, index, i, "permitted")}
                                                                        class="btn-close" aria-label="Close"></button></span>
                                                                </CCol>
                                                            </CRow>
                                                            {Object.keys(c.contentData).map((key, keyIndex) => (
                                                                <div>
                                                                    <CRow className='mt-2'>
                                                                        <CCol className='col-11'>
                                                                            <CCard>
                                                                                <CCardBody>
                                                                                    <CRow className='mt-2 pb-2 border-bottom'>
                                                                                        <CCol className='col-9'><CFormInput type='text' placeholder='Content Field'
                                                                                            value={key} onChange={this.changeContentDataKey.bind(this, key, index, i, "permitted", keyIndex)} /></CCol>
                                                                                        <CCol className='col-1 align-self-center'>
                                                                                            <button type="button"
                                                                                                onClick={this.removeContentDataKey.bind(this, key, index, i, "permitted")}
                                                                                                class="btn-close" aria-label="Remove" />
                                                                                        </CCol>
                                                                                    </CRow>
                                                                                    {this.getContentData(c.contentData[key], key, index, i, "permitted")}
                                                                                </CCardBody>
                                                                            </CCard>
                                                                        </CCol>
                                                                    </CRow>


                                                                </div>
                                                            ))
                                                            }

                                                            <CRow className='mt-2 justify-content-center'>
                                                                <CCol className='col-6 text-center'>
                                                                    <CButton onClick={this.addNewContentData.bind(this, index, i, "permitted")}><CIcon icon={icon.cilPlus} />Add New Content Data for {c.collectionName}</CButton>
                                                                </CCol>
                                                            </CRow>
                                                            <CRow className='mt-2 pb-2'>
                                                                <CCol className='col-9'>
                                                                    <CFormInput type='text' name='contentKeys'
                                                                        onChange={this.changeCK.bind(this, index, i, "permitted")}
                                                                        placeholder='Content Keys with comma' />
                                                                </CCol>
                                                            </CRow>

                                                            <CRow className='mt-2'>
                                                                {c.contentKeys.map((val =>
                                                                    <CCol className='col-3'>
                                                                        {this.getContentKeysItems(val, index, i, "permitted")}
                                                                    </CCol>
                                                                ))}
                                                            </CRow>

                                                        </div>
                                                    ))}
                                                </CCardBody>
                                                <CCardFooter>
                                                    <CRow className='mt-2 justify-content-center'>
                                                        <CCol className='col-6 text-center'>
                                                            <CButton onClick={this.addNewCollection.bind(this, index, "permitted")}><CIcon icon={icon.cilPlus} />Add New Collection for {item.role}</CButton>
                                                        </CCol>
                                                    </CRow>
                                                </CCardFooter>
                                            </CCard>


                                            <CCard className='mt-2'>
                                                <CCardHeader>
                                                    <CCardTitle className='p-2'>Main-Child Collections Relation Permissions</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    {item.permitted.mainSub.map((val, i) => (
                                                        <div>
                                                            <CRow>
                                                                <p><b>Main collectionName :</b></p>
                                                                <CCol className='col-9'>
                                                                    <CFormInput type='text' name='main' onChange={this.mainCollectionChange.bind(this, index, i, "permitted")} value={val.main} />
                                                                </CCol>
                                                                <CCol className='align-self-center'>
                                                                    <span style={fRight}> <button type="button"
                                                                        onClick={this.removeMainSub.bind(this, index, i, "permitted")}
                                                                        class="btn-close" aria-label="Close"></button></span>
                                                                </CCol>
                                                            </CRow>
                                                            <CRow className='mt-2 pb-2'>
                                                                <CCol className='col-9'>
                                                                    <p><b>Sub collectionNames :</b></p>
                                                                    <CFormInput type='text' name='subCollection'
                                                                        onChange={this.changeSub.bind(this, index, i, "permitted")}
                                                                        placeholder='Collection Names with comma' />
                                                                </CCol>
                                                            </CRow>
                                                            <CRow className='mt-2'>
                                                                {val.sub.map((s, si) =>
                                                                    <CCol className='col-3'>
                                                                        {this.getMainSubItems(s, index, i, si, "permitted")}
                                                                    </CCol>
                                                                )}
                                                            </CRow>
                                                        </div>
                                                    ))}
                                                </CCardBody>
                                                <CCardFooter>
                                                    <CRow className='mt-2 justify-content-center'>
                                                        <CCol className='col-6 text-center'>
                                                            <CButton onClick={this.addNewMainSub.bind(this, index, "permitted")}><CIcon icon={icon.cilPlus} />Add Main-Sub Collection Relation for {item.role}</CButton>
                                                        </CCol>
                                                    </CRow>
                                                </CCardFooter>
                                            </CCard>

                                        </CTabPane>
                                        <CTabPane role="tabpanel" className='p-3' aria-labelledby="profile-tab" visible={this.getSubActiveKey(this, 2, item._id)}>
                                            <CCard className='mt-2'>
                                                <CCardHeader>
                                                    <CCardTitle className='p-2'>Collections</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    {item.nonPermitted.collections.map((c, i) => (
                                                        <div>
                                                            <CRow className='mt-2'>
                                                                <CCol className='col-11'>
                                                                    <CFormInput type='text' name='collectionName'
                                                                        onChange={this.changeNonPermittedCollectionName.bind(this, index, i, "nonPermitted")} placeholder='Collection Name' value={c.collectionName} />
                                                                </CCol>
                                                                <CCol className='align-self-center'>
                                                                    <span style={fRight}> <button type="button"
                                                                        onClick={this.removeCollection.bind(this, index, i, "nonPermitted")}
                                                                        class="btn-close" aria-label="Close"></button></span>
                                                                </CCol>
                                                            </CRow>
                                                            {Object.keys(c.contentData).map((key, keyIndex) => (
                                                                <div>
                                                                    <CRow className='mt-2'>
                                                                        <CCol className='col-11'>
                                                                            <CCard>
                                                                                <CCardBody>
                                                                                    <CRow className='mt-2 pb-2 border-bottom'>
                                                                                        <CCol className='col-9'><CFormInput type='text' placeholder='Content Field'
                                                                                            value={key} onChange={this.changeContentDataKey.bind(this, key, index, i, "nonPermitted", keyIndex)} /></CCol>
                                                                                        <CCol className='col-1 align-self-center'>
                                                                                            <button type="button"
                                                                                            onClick={this.removeContentDataKey.bind(this, key, index, i, "nonPermitted")}
                                                                                                class="btn-close" aria-label="Remove" />
                                                                                        </CCol>
                                                                                    </CRow>
                                                                                    {this.getContentData(c.contentData[key], key, index, i, "nonPermitted")}
                                                                                </CCardBody>
                                                                            </CCard>
                                                                        </CCol>
                                                                    </CRow>


                                                                </div>
                                                            ))
                                                            }

                                                            <CRow className='mt-2 justify-content-center'>
                                                                <CCol className='col-6 text-center'>
                                                                    <CButton onClick={this.addNewContentData.bind(this, index, i, "nonPermitted")}><CIcon icon={icon.cilPlus} />Add New Content Data for {c.collectionName}</CButton>
                                                                </CCol>
                                                            </CRow>
                                                            <CRow className='mt-2 pb-2'>
                                                                <CCol className='col-9'>
                                                                    <CFormInput type='text' name='contentKeys'
                                                                        onChange={this.changeCK.bind(this, index, i, "nonPermitted")}
                                                                        placeholder='Content Keys with comma' />
                                                                </CCol>
                                                            </CRow>

                                                            <CRow className='mt-2'>
                                                                {c.contentKeys.map((val =>
                                                                    <CCol className='col-3'>
                                                                        {this.getContentKeysItems(val, index, i, "nonPermitted")}
                                                                    </CCol>
                                                                ))}
                                                            </CRow>
                                                        </div>
                                                    ))}
                                                </CCardBody>
                                                <CCardFooter>
                                                    <CRow className='mt-2 justify-content-center'>
                                                        <CCol className='col-6 text-center'>
                                                            <CButton onClick={this.addNewCollection.bind(this, index, "nonPermitted")}><CIcon icon={icon.cilPlus} />Add New Collection for {item.role}</CButton>
                                                        </CCol>
                                                    </CRow>
                                                </CCardFooter>
                                            </CCard>

                                            <CCard className='mt-2'>
                                                <CCardHeader>
                                                    <CCardTitle className='p-2'>Main-Child Collections Relation Permissions</CCardTitle>
                                                </CCardHeader>
                                                <CCardBody>
                                                    {item.nonPermitted.mainSub.map((val, i) => (
                                                        <div>
                                                            <CRow>
                                                                <p><b>Main collectionName :</b></p>
                                                                <CCol className='col-9'>
                                                                    <CFormInput type='text' name='main' onChange={this.mainCollectionChange.bind(this, index, i, "nonPermitted")} value={val.main} />
                                                                </CCol>
                                                                <CCol className='align-self-center'>
                                                                    <span style={fRight}> <button type="button"
                                                                        onClick={this.removeMainSub.bind(this, index, i, "nonPermitted")}
                                                                        class="btn-close" aria-label="Close"></button></span>
                                                                </CCol>
                                                            </CRow>
                                                            <CRow className='mt-2 pb-2'>
                                                                <CCol className='col-9'>
                                                                    <p><b>Sub collectionNames :</b></p>
                                                                    <CFormInput type='text' name='subCollection'
                                                                        onChange={this.changeSub.bind(this, index, i, "nonPermitted")}
                                                                        placeholder='Collection Names with comma' />
                                                                </CCol>
                                                            </CRow>
                                                            <CRow className='mt-2'>
                                                                {val.sub.map((s, si) =>
                                                                    <CCol className='col-3'>
                                                                        {this.getMainSubItems(s, index, i, si, "nonPermitted")}
                                                                    </CCol>
                                                                )}
                                                            </CRow>
                                                        </div>
                                                    ))}
                                                </CCardBody>
                                                <CCardFooter>
                                                    <CRow className='mt-2 justify-content-center'>
                                                        <CCol className='col-6 text-center'>
                                                            <CButton onClick={this.addNewMainSub.bind(this, index, "nonPermitted")}><CIcon icon={icon.cilPlus} />Add Main-Sub Collection Relation for {item.role}</CButton>
                                                        </CCol>
                                                    </CRow>
                                                </CCardFooter>
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
export default CreateRelation