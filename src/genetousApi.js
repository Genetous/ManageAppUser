import { cilHd } from "@coreui/icons"

export const auth_service = process.env.REACT_APP_AUTH_SERVICE;
export const rule_engine = process.env.REACT_APP_RULE_ENGINE;
export const organization = {

}
const uconfig = {
    onUploadProgress: progressEvent => console.log(progressEvent.loaded)
}
const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: "" },
    body: ""
};
const requestOptionsFile = {
    method: 'POST',
    headers: { Authorization: "" },
    body: null
};
export const Methods = {
    GetConfigs: rule_engine + '/get/configs',
    AddConfigs:rule_engine + '/add/configuration',
    GetRules:rule_engine + '/get/rules',
    GetEncryption:rule_engine + '/get/encryption',
    AddEncryption:rule_engine + '/add/encryption',
    AddUpdateRules:rule_engine + '/add/methods',
    DeleteRule:rule_engine + '/delete/method',
    GetAppSecret:rule_engine + '/get/appSecret',
    GetApplications:rule_engine + '/applications',

    VerifyToken: auth_service + '/verify',
    KillToken: auth_service + '/logout',
    Auth: auth_service + '/gen/auth',
    Client:auth_service + '/gen/client',
    LoginUser:auth_service + '/login',

}
async function setTokenToLocalStorage(token) {
    localStorage.setItem('token', token)
}
async function setTimeout() {
    var time=Date.now();
    localStorage.setItem('timeout', time)
}
async function setOrgToLocalStorage(orgId) {
    localStorage.setItem('orgId', orgId)
}
async function setAppIDToLocalStorage(appId) {
    localStorage.setItem('appID', appId)
}
export var verifyToken = function () {
    return new Promise(async function (resolve, reject) {

        try {
            var hd = new Headers();
            var tk = "";
            if (localStorage.getItem('token') != null && localStorage.getItem('token') != "") {
                tk = `Bearer ${localStorage.getItem('token')}`;
            } else {
                reject(401)
                return;
            }
            hd.append('Authorization', tk)
            hd.append("Content-Type", "application/json");
            const responseCollection = await fetch(
                Methods.VerifyToken,
                {
                    method: 'GET',
                    headers: hd
                }
            )
            resolve(responseCollection.status);
        } catch (err) {
            reject(err)
        }
    });
}
export var logout = function () {
    return new Promise(async function (resolve, reject) {

        try {
            var hd = new Headers();
            var tk = "";
            if (localStorage.getItem('token') != null && localStorage.getItem('token') != "") {
                tk = `Bearer ${localStorage.getItem('token')}`;
            } else {
                reject(401)
                return;
            }
            var rdata = {
                status: -1,
                message: "",
            }
            hd.append('Authorization', tk)
            hd.append("Content-Type", "application/json");
            const responseCollection = await fetch(
                Methods.KillToken,
                {
                    method: 'POST',
                    headers: hd
                }
            )
            var d = null
            rdata.status = responseCollection.status;
            try {
                d = await responseCollection.json()
                if (responseCollection.status != 200) {
                    if (responseCollection.status == 500) {
                        rdata.message = "Unexpected Error Occured!"
                    } else {
                        rdata.message = d.message
                    }
                    reject(rdata)
                } else {
                    resolve(d)
                }
            } catch (err) {
                rdata.message = err.message
                reject(rdata)
            }
        } catch (err) {
            reject(err)
        }
    });
}
export var loginOrganization = function (loginModel, operationStep) {
    return new Promise(async function (resolve, reject) {
        try {
            requestOptions.body = JSON.stringify(organization)
            const responseClient = await fetch(Methods.Client, requestOptions)
            var c = await responseClient.json()
            if (responseClient.status != 200) {
                var model = {
                    success: false,
                    message: c.message
                }
                reject(model)
                return;
            }
            requestOptions.body = JSON.stringify(c)
            const responseAuth = await fetch(Methods.Auth, requestOptions)
            const a = await responseAuth.json()
            if (responseAuth.status != 200) {
                var model = {
                    success: false,
                    message: a.message
                }
                reject(model)
                return;
            }
            if (operationStep === 0) {
                var hd = new Headers();
                var tk = "Bearer " + a.token;
                hd.append('Authorization', tk)
                hd.append("Content-Type", "application/json");
                const responseCollection = await fetch(
                    Methods.LoginUser,
                    {
                        method: 'POST',
                        headers: hd,
                        body: JSON.stringify(loginModel)
                    }
                )
                const d = await responseCollection.json();
                if (responseCollection.status != 200) {
                    var model = {
                        success: false,
                        message: d.message
                    }
                    reject(model)
                }
                if (d.results.length > 0) {
                    var ds = d.results[0].data[0];
                    if (ds == null) {
                        var model = {
                            success: false,
                            message: "No user found!"
                        }
                        reject(model)
                        return;
                    }
                    setOrgToLocalStorage(ds.collectionId);
                    organization.clientId = ds.related.user[0]._id;
                    await loginOrganization(organization, 1).then(function (result) {
                        resolve(result);
                    }, err => {
                        var model = {
                            success: false,
                            message: err
                        }
                        reject(model)
                        return;
                    });
                } else {
                    var model = {
                        success: false,
                        message: d.message
                    }
                    reject(model)
                    return;
                }
            } else {
                setTokenToLocalStorage(a.token);
                setTimeout();
                localStorage.setItem('clientId', organization.clientId)
                var model = {
                    success: true,
                    message: ""
                }
                resolve(model)
            }
        } catch (err) {
            console.log(err)
            var model = {
                success: false,
                message: err
            }
            reject(model)
        }
    });
}
export var getGuestToken = function () {
    return new Promise(async function (resolve, reject) {
        try {
            Object.keys(organization).forEach(function (key) {
                if (key === "clientId") {
                    delete organization[key];
                }
            });
            requestOptions.body = JSON.stringify(organization)
            const responseClient = await fetch(Methods.Client, requestOptions)
            var c = await responseClient.json()
            requestOptions.body = JSON.stringify(c)
            const responseAuth = await fetch(Methods.Auth, requestOptions)
            const a = await responseAuth.json()
            setTokenToLocalStorage(a.token)
            setTimeout();
            resolve(true);
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}
export var getGuestTokenReturnToken = function () {
    return new Promise(async function (resolve, reject) {
        try {
            Object.keys(organization).forEach(function (key) {
                if (key === "clientId") {
                    delete organization[key];
                }
            });
            requestOptions.body = JSON.stringify(organization)
            const responseClient = await fetch(Methods.Client, requestOptions)
            var c = await responseClient.json()
            requestOptions.body = JSON.stringify(c)
            const responseAuth = await fetch(Methods.Auth, requestOptions)
            const a = await responseAuth.json()
            resolve(a.token);
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}
export var postWithSavedToken = function (model, method) {
    return new Promise(async function (resolve, reject) {
        try {
            var hd = new Headers();
            var tk = "";
            if (localStorage.getItem('token') != null && localStorage.getItem('token') != "") {
                tk = `Bearer ${localStorage.getItem('token')}`;
            } else {
                reject(401)
                return;
            }
            hd.append('Authorization', tk)
            hd.append("Content-Type", "application/json");
            var rdata = {
                status: -1,
                message: "",
            }
            const responseCollection = await fetch(
                method,
                {
                    method: 'POST',
                    headers: hd,
                    body: JSON.stringify(model)
                }
            )
            var d = null
            rdata.status = responseCollection.status;
            try {
                d = await responseCollection.json()
                if (responseCollection.status != 200) {
                    if (responseCollection.status == 500) {
                        rdata.message = "Unexpected Error Occured!"
                    } else {
                        rdata.message = d.message
                    }
                    reject(rdata)
                } else {
                    resolve(d)
                }
            } catch (err) {
                rdata.message = err.message
                reject(rdata)
            }

        } catch (err) {
            reject(err)
        }
    });
}
export var get = function (method) {
    return new Promise(async function (resolve, reject) {
        try {
            var hd = new Headers();
            var tk = `Bearer ${localStorage.getItem('token')}`;
            hd.append('Authorization', tk)
            hd.append("Content-Type", "application/json");
            var rdata = null
            const responseCollection = await fetch(
                method,
                {
                    method: 'GET',
                    headers: hd
                }
            )
            var d = null
            try {
                d = await responseCollection.json()
                resolve(d);
            } catch (err) {
                if (responseCollection.status === 200) {
                    resolve("success");
                } else if (responseCollection.status === 400) {
                    reject("Not Found")
                } else if (responseCollection.status === 403) {
                    reject("Session Timeout")
                }

            }


        } catch (err) {
            reject(err)
        }
    });
}
export var fileUpload = function (file, method, config) {
    return new Promise(async function (resolve, reject) {
        try {
            const data = new FormData()
            data.append('file', file)
            data.append('bucket', organization.applicationId)
            requestOptionsFile.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
            requestOptionsFile.body = data
            const responseCollection = await fetch(
                method,
                requestOptionsFile
            )
            const d = await responseCollection.text()
            resolve(d);
        } catch (err) {
            reject(err)
        }
    });
}
export var fileDownload = function (file, method) {
    return new Promise(async function (resolve, reject) {
        try {
            requestOptionsFile.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
            const responseCollection = await fetch(
                method + file,
                requestOptionsFile
            )
            resolve(responseCollection.data);
        } catch (err) {
            reject(err)
        }
    });
}
export var postWithNoToken = function (model, method) {
    return new Promise(async function (resolve, reject) {
        try {
            var hd = new Headers();
            hd.append("Content-Type", "application/json");
            var rdata = {
                status: -1,
                message: "",
            }
            const responseCollection = await fetch(
                method,
                {
                    method: 'POST',
                    headers: hd,
                    body: JSON.stringify(model)
                }
            )
            var d = null
            rdata.status = responseCollection.status;
            try {
                d = await responseCollection.json()
                if (responseCollection.status != 200) {
                    if (responseCollection.status == 500) {
                        rdata.message = "Unexpected Error Occured!"
                    } else {
                        rdata.message = d.message
                    }
                    reject(rdata)
                } else {
                    resolve(d)
                }
            } catch (err) {
                rdata.message = err.message
                reject(rdata)
            }

        } catch (err) {
            reject(err)
        }
    });
}
export var postwithAddToken = function (model, method, tk) {
    return new Promise(async function (resolve, reject) {
        try {
            var hd = new Headers();
            hd.append('Authorization', tk)
            hd.append("Content-Type", "application/json");
            var rdata = {
                status: -1,
                message: "",
            }
            const responseCollection = await fetch(
                method,
                {
                    method: 'POST',
                    headers: hd,
                    body: JSON.stringify(model)
                }
            )
            var d = null
            rdata.status = responseCollection.status;
            try {
                d = await responseCollection.json()
                if (responseCollection.status != 200) {
                    if (responseCollection.status == 500) {
                        rdata.message = "Unexpected Error Occured!"
                    } else {
                        rdata.message = d.message
                    }
                    reject(rdata)
                } else {
                    resolve(d)
                }
            } catch (err) {
                rdata.message = err.message
                reject(rdata)
            }

        } catch (err) {
            reject(err)
        }
    });
}
