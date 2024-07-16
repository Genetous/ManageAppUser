import React, { Component } from 'react';
import { Methods, get,postWithSavedToken } from "../../genetousApi"
import { ToastContainer, toast,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, Redirect } from 'react-router-dom'
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
    CButton
} from '@coreui/react'
const vars = {
    'cursor': "pointer"
}
const fRight = {
    "float": "right"
}
var status = -1;
var message = "Unexpected Error Occured!";
var error = false;
export class Configs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                minioCredentials: {
                    uri: "",
                    password: "",
                    username: ""
                },
                dbData: {
                    clusters: [],
                    userpass: "",
                    username: ""
                },
                neoCredentials: {
                    uri: "",
                    password: "",
                    username: ""
                },
                rabbitCredentials: {
                    host: "",
                    ipaddress: "",
                    password: "",
                    username: ""
                },
                permittedExtensions: [
                ],
                jobDbData: {
                    clusters: [],
                    userpass: "",
                    username: ""
                },
                redisData: {
                    host: "",
                    port: "0",
                    password: "",
                    username: ""
                }
            },
            appSecret: "",
            activeKey: 1,
            redirect: false,
            sendApp: false
        }
    }
    handleRedirectApp() {
        if (!this.state.sendApp)
            this.setState({ sendApp: true })
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
            this.getConfigs();
        }
    }
    async getConfigs() {
        var orgId = localStorage.getItem("orgId");
        var appId = localStorage.getItem("appId");
        var model = {
            organizationId: orgId,
            applicationId: appId
        }
        var d = { ...this.state.data };
        var success = true;
        await postWithSavedToken(model, Methods.GetConfigs).then(function (result) {
            if (result.success == true) {
                d = result.data;
            }
        }, err => {
            if (err.status == 401) {
                this.handleRedirect();
            } else if (err.status == 404) {
                success = true;
            } else {
                success = false;
                message = err.message;
            }
        });
        if (!success)
            this.toastShow("error", message);
        if(!d.hasOwnProperty("redisData")){
            d["redisData"]=
                 {
                    host: "",
                    port: "",
                    password: "",
                    username: ""
                }
            
        }
        this.setState({ data: d });
        this.getAppSecret();
    }
    async getAppSecret() {
        var orgId = localStorage.getItem("orgId");
        var appId = localStorage.getItem("appId");
        var model = {
            organizationId: orgId,
            applicationId: appId
        }
        var d = { ...this.state.data };
        var success = true;
        await postWithSavedToken(model, Methods.GetAppSecret).then(function (result) {
            if (result.success == true) {
                d = result.data.clientSecret;
            }
        }, err => {
            if (err.status == 401) {
                this.handleRedirect();
            } else {
                success = false;
                message = err.message;
            }
        });
        if (!success)
            this.toastShow("error", message);
        this.setState({ appSecret: d });
    }
    setActiveKey(key) {
        this.setState({ activeKey: key });
        return false;
    }
    changeData(e, d) {
        const { data } = this.state;
        data[e][d.target.name] = d.target.value;
        this.setState({ data });
    }
    createPermittedList(item) {
        return (<li className='row p-2'>
            <div class="col-sm-10 border-bottom">{item}</div>
            <div class="col-sm-2"><button name={item} onClick={this.removeItem.bind(this)} type="button" class="btn-close" aria-label="Close"></button></div>

        </li>);
    }
    async addExt(e) {
        var val = e.target.value;
        if (val.indexOf(",") > 0) {
            val = val.slice(0, -1);
            const { data } = this.state;
            var permittedExtensionsCopy = data["permittedExtensions"]
            if (permittedExtensionsCopy.indexOf(val) < 0) {
                permittedExtensionsCopy.push(val);
                data["permittedExtensions"] = permittedExtensionsCopy;
                await this.setState({ data });
                e.target.value = "";
            } else {
                e.target.value = val;
            }
        }
    }
    async removeItem(e) {
        const { data } = this.state;
        var permittedExtensionsCopy = data["permittedExtensions"]
        let index = permittedExtensionsCopy.indexOf(e.target.name);
        permittedExtensionsCopy.splice(index, 1);
        data["permittedExtensions"] = permittedExtensionsCopy;
        await this.setState({ data });
    }
    async saveAll(e) {
        this.toastShow("info", "Processing...");
        var model = this.state.data;
        var orgId = localStorage.getItem("orgId");
        var appId = localStorage.getItem("appId");
        model.organizationId = orgId
        model.applicationId = appId
        var success = true;
        await postWithSavedToken(model, Methods.AddConfigs).then(function (result) {
            success = result.success
            if (result.success == true)
                message = "Saved!";
            else {
                message = result.message;
            }
        }, err => {
            if (err.status == 401) {
                this.handleRedirect();
            } else {
                success = false;
                message = err.message;
            }
        });
        var type = success ? "success" : "error";
        this.toastShow(type, message);
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
    getDbData(item, index, type) {
        return (
            <p className="p-1 rounded border border-primary text-primary">{item}
                <span style={fRight}> <button type="button"
                    onClick={this.removeDBData.bind(this, index, type)}
                    class="btn-close" aria-label="Close"></button></span>
            </p>
        )
    }
    removeDBData(index, type) {
        var data = { ...this.state.data }
        var collection = data[type].clusters
        collection.splice(index, 1);
        this.setState({ data });
    }
    changeDBData(type, e) {
        var data = { ...this.state.data }
        var collection = data[type].clusters
        if (e.target.value.toString().indexOf(",") >= 0) {
            var arr = this.getValueAsArrayByType(e.target.value);
            if (arr[0] && collection.indexOf(arr[0]) < 0) {
                collection.push(arr[0]);
            }
            e.target.value = "";
        }
        this.setState({ data });
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
            <CContainer className='p-5'>
                <ToastContainer />
                <CRow className="justify-content-center">
                    <CCol xs={12}>
                        <CCard>
                            <CCardBody>
                                <CCardTitle>Add/Update Configurations</CCardTitle>

                                <CNav variant="tabs" className='mt-4' role="tablist" style={vars} >
                                    <CNavItem>
                                        <CNavLink
                                            style={vars}
                                            active={this.state.activeKey === 1}
                                            onClick={this.setActiveKey.bind(this, 1)}
                                        >
                                            Database
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            style={vars}
                                            active={this.state.activeKey === 2}
                                            onClick={this.setActiveKey.bind(this, 2)}
                                        >
                                            Job DB
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            style={vars}
                                            active={this.state.activeKey === 3}
                                            onClick={this.setActiveKey.bind(this, 3)}
                                        >
                                            Minio
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            style={vars}
                                            active={this.state.activeKey === 4}
                                            onClick={this.setActiveKey.bind(this, 4)}
                                        >
                                            Neo4J
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            style={vars}
                                            active={this.state.activeKey === 5}
                                            onClick={this.setActiveKey.bind(this, 5)}
                                        >
                                            RabbitMQ
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            style={vars}
                                            active={this.state.activeKey === 6}
                                            onClick={this.setActiveKey.bind(this, 6)}
                                        >
                                            Redis
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            style={vars}
                                            active={this.state.activeKey === 7}
                                            onClick={this.setActiveKey.bind(this, 7)}
                                        >
                                            Permitted Extensions
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            style={vars}
                                            active={this.state.activeKey === 8}
                                            onClick={this.setActiveKey.bind(this, 8)}
                                        >
                                            App Secret Key
                                        </CNavLink>
                                    </CNavItem>
                                </CNav>
                                <CTabContent>
                                    <CTabPane role="tabpanel" className='p-3' aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
                                        <CFormInput
                                            className='mb-2'
                                            type="text"
                                            id="title"
                                            name='title'
                                            label="MongoDB or PostgreSQL Uri Title"
                                            placeholder="ex: mongodb+srv:// - mongodb:// - postgresql://"
                                            value={this.state.data.dbData.title != null ? this.state.data.dbData.title : ""}
                                            onChange={this.changeData.bind(this, "dbData")}
                                        />
                                        <CFormInput
                                        className='mb-2'
                                            type="text"
                                            id="cluster"
                                            name='cluster'
                                            label="MongoDB or PostgreSQL Clusters Host Address with Port"
                                            placeholder="ex: 127.0.0.1:27017,"
                                            onChange={this.changeDBData.bind(this, "dbData")}
                                        />
                                        <CRow className='mt-2'>
                                            {this.state.data.dbData.clusters != null &&
                                                this.state.data.dbData.clusters.map((item, index) => (
                                                    <CCol className='col-3'>
                                                        {this.getDbData(item, index, "dbData")}
                                                    </CCol>
                                                ))}
                                        </CRow>
                                        <CFormInput
                                        className='mb-2'
                                            type="text"
                                            id="options"
                                            name='options'
                                            label="MongoDB Clusters Connection Options"
                                            placeholder="ex: retryWrites=true&w=majority"
                                            value={this.state.data.dbData.options != null ? this.state.data.dbData.options : ""}
                                            onChange={this.changeData.bind(this, "dbData")}
                                        />
                                        <CFormInput
                                        className='mb-2'
                                            type="text"
                                            id="username"
                                            name='username'
                                            label="MongoDB or PostgreSQL Username"
                                            placeholder="John"
                                            value={this.state.data.dbData.username}
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "dbData")}
                                            autoComplete='new-username'
                                        />
                                        <CFormInput
                                            type="password"
                                            id="userpass"
                                            name='userpass'
                                            label="MongoDB or PostgreSQL Password"
                                            placeholder="******"
                                            value={this.state.data.dbData.userpass}
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "dbData")}
                                            autoComplete='new-password'
                                        />

                                    </CTabPane>
                                    <CTabPane role="tabpanel" className='p-3' aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
                                        <CFormInput
                                            type="text"
                                            id="title"
                                            name='title'
                                            label="MongoDB or PostgreSQL Uri Title"
                                            placeholder="ex: mongodb+srv:// - mongodb:// - postgresql://"
                                            className='mb-2'
                                            value={this.state.data.jobDbData.title != null ? this.state.data.jobDbData.title : ""}
                                            onChange={this.changeData.bind(this, "jobDbData")}
                                        />
                                        <CFormInput
                                            type="text"
                                            id="cluster"
                                            name='cluster'
                                            label="MongoDB or PostgreSQL Clusters Host Address with Port"
                                            placeholder="ex: 127.0.0.1:27017,"
                                            className='mb-2'
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeDBData.bind(this, "jobDbData")}
                                        />
                                        <CRow className='mt-2'>
                                            {this.state.data.jobDbData.clusters != null &&
                                                this.state.data.jobDbData.clusters.map((item, index) => (
                                                    <CCol className='col-3'>
                                                        {this.getDbData(item, index, "jobDbData")}
                                                    </CCol>
                                                ))}
                                        </CRow>
                                        <CFormInput
                                            type="text"
                                            id="options"
                                            name='options'
                                            label="MongoDB Clusters Connection Options"
                                            placeholder="ex: retryWrites=true&w=majority"
                                            className='mb-2'
                                            value={this.state.data.jobDbData.options != null ? this.state.data.jobDbData.options : ""}
                                            onChange={this.changeData.bind(this, "jobDbData")}
                                        />
                                        <CFormInput
                                        className='mb-2'
                                            type="text"
                                            id="username"
                                            name='username'
                                            label="MongoDB or PostgreSQL Username"
                                            placeholder="John"
                                            value={this.state.data.jobDbData.username}
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "jobDbData")}
                                            autoComplete='new-username'
                                        />
                                        <CFormInput
                                            type="password"
                                            id="userpass"
                                            name='userpass'
                                            label="MongoDB or PostgreSQL Password"
                                            placeholder="******"
                                            value={this.state.data.jobDbData.userpass}
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "jobDbData")}
                                            autoComplete='new-password'
                                        />
                                    </CTabPane>
                                    <CTabPane role="tabpanel" className='p-3' aria-labelledby="contact-tab" visible={this.state.activeKey === 3}>
                                        <CFormInput
                                            type="text"
                                            id="uri"
                                            name='uri'
                                            label="Minio Address"
                                            placeholder="http://127.0.0.1:9000"
                                            value={this.state.data.minioCredentials.uri}
                                            text="Minio Address with Port Number"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "minioCredentials")}
                                        />

                                        <CFormInput
                                            type="text"
                                            id="username"
                                            name='username'
                                            label="Username"
                                            placeholder="John"
                                            value={this.state.data.minioCredentials.username}
                                            text="Minio Credentials Username"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "minioCredentials")}
                                            autoComplete='new-username'
                                        />
                                        <CFormInput
                                            type="password"
                                            id="password"
                                            name='password'
                                            label="Password"
                                            placeholder="******"
                                            value={this.state.data.minioCredentials.password}
                                            text="Minio Credentials Password"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "minioCredentials")} />
                                    </CTabPane>
                                    <CTabPane role="tabpanel" className='p-3' aria-labelledby="contact-tab" visible={this.state.activeKey === 4}>
                                        <CFormInput
                                            type="text"
                                            id="uri"
                                            name='uri'
                                            label="Neo4J Address"
                                            placeholder="bolt://localhost:7687"
                                            value={this.state.data.neoCredentials.uri}
                                            text="Neo4J Address with Port Number"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "neoCredentials")}
                                        />

                                        <CFormInput
                                            type="text"
                                            id="username"
                                            name='username'
                                            label="Username"
                                            placeholder="John"
                                            value={this.state.data.neoCredentials.username}
                                            text="Neo4J Credentials Username"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "neoCredentials")}
                                            autoComplete='new-username'
                                        />
                                        <CFormInput
                                            type="password"
                                            id="password"
                                            name='password'
                                            label="Password"
                                            placeholder="******"
                                            value={this.state.data.neoCredentials.password}
                                            text="Neo4J Credentials Password"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "neoCredentials")} />
                                    </CTabPane>
                                    <CTabPane role="tabpanel" className='p-3' aria-labelledby="contact-tab" visible={this.state.activeKey === 5}>
                                        <CFormInput
                                            type="text"
                                            id="ipaddress"
                                            name='ipaddress'
                                            label="RabbitMQ IP Address"
                                            placeholder="127.0.0.1"
                                            value={this.state.data.rabbitCredentials.ipaddress}
                                            text=""
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "rabbitCredentials")}
                                        />

                                        <CFormInput
                                            type="text"
                                            id="username"
                                            name='username'
                                            label="Username"
                                            placeholder="John"
                                            value={this.state.data.rabbitCredentials.username}
                                            text="RabbitMQ Credentials Username"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "rabbitCredentials")}
                                            autoComplete='new-username'
                                        />
                                        <CFormInput
                                            type="password"
                                            id="userpass"
                                            name='password'
                                            label="Password"
                                            placeholder="******"
                                            value={this.state.data.rabbitCredentials.password}
                                            text="RabbitMQ Credentials Password"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "rabbitCredentials")}
                                            autoComplete='new-password' />
                                        <CFormInput
                                            type="text"
                                            id="host"
                                            name='host'
                                            label="Virtual Host"
                                            placeholder="demohost"
                                            value={this.state.data.rabbitCredentials.host}
                                            text="RabbitMQ Created Virtual Host"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "rabbitCredentials")} />
                                    </CTabPane>
                                    <CTabPane role="tabpanel" className='p-3' aria-labelledby="contact-tab" visible={this.state.activeKey === 6}>
                                        <CFormInput
                                            type="text"
                                            id="host"
                                            name='host'
                                            label="Redis Host"
                                            placeholder="127.0.0.1"
                                            value={this.state.data.redisData.host}
                                            text=""
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "redisData")}
                                        />
                                        <CFormInput
                                            type="text"
                                            id="port"
                                            name='port'
                                            label="Redis Port"
                                            placeholder="Redis Port"
                                            value={this.state.data.redisData.port}
                                            text="Redis Port"
                                            pattern="[0-9]*"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "redisData")} />
                                        <CFormInput
                                            type="text"
                                            id="username"
                                            name='username'
                                            label="Username"
                                            placeholder="John"
                                            value={this.state.data.redisData.username}
                                            text="Redis Credentials Username"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "redisData")}
                                            autoComplete='new-username'
                                        />
                                        <CFormInput
                                            type="password"
                                            id="userpass"
                                            name='password'
                                            label="Password"
                                            placeholder="******"
                                            value={this.state.data.redisData.password}
                                            text="Redis Credentials Password"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.changeData.bind(this, "redisData")}
                                            autoComplete='new-password' />
                                    </CTabPane>
                                    <CTabPane role="tabpanel" className='p-3' aria-labelledby="contact-tab" visible={this.state.activeKey === 7}>
                                        <CFormInput
                                            type="text"
                                            id="ext"
                                            name='ext'
                                            label="Add Extensions"
                                            placeholder="txt"
                                            text="Add extensions with comma for Object Storage Service ex:(txt,png)"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            onChange={this.addExt.bind(this)} />
                                        <ul className='w-75 p-3'>
                                            {
                                                this.state.data.permittedExtensions.map((item, index) => (
                                                    this.createPermittedList(item)
                                                ))
                                            }

                                        </ul>
                                    </CTabPane>
                                    
                                    <CTabPane role="tabpanel" className='p-3' aria-labelledby="contact-tab" visible={this.state.activeKey === 8}>
                                        <CFormInput
                                            type="text"
                                            id="appSecret"
                                            name='appSecret'
                                            label="App Secret Key"
                                            placeholder="txt"
                                            disabled
                                            value={this.state.appSecret}
                                        />

                                    </CTabPane>
                                </CTabContent>

                            </CCardBody>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <CButton color="primary" className="m-2" onClick={this.saveAll.bind(this)}>Save All</CButton>
                            </div>

                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>


        )
    }
}
export default Configs