"use strict";(self.webpackChunkgenetous_manage_apps=self.webpackChunkgenetous_manage_apps||[]).push([[182],{745:(e,t,s)=>{s.r(t),s.d(t,{Encrypt:()=>u,default:()=>g});var i=s(2791),n=s(4846),l=s(2439),r=s(4880),a=s(4889),o=s(577),c=(s(5462),s(8983)),d=s(184);const h={float:"right"},p={height:"620px","overflow-y":"scroll"};var m="Unexpected Error Occured!";class u extends i.Component{constructor(e){super(e),this.state={encryptions:[],visible:!1,yesNoVisible:!1,yesNoQuestion:"",arguments:[],sendType:"",redirect:!1,error:!1,errroText:"",sendApp:!1}}handleRedirectApp(){this.state.sendApp||this.setState({sendApp:!0})}toastShow(e,t){switch(e){case"success":o.Am.success(t,{position:"bottom-center",autoClose:1e3,hideProgressBar:!0,closeOnClick:!1,pauseOnHover:!1,draggable:!1,theme:"dark",transition:o.Mi});break;case"error":o.Am.error(t,{position:"bottom-center",autoClose:1e3,hideProgressBar:!0,closeOnClick:!1,pauseOnHover:!1,draggable:!1,theme:"dark",transition:o.Mi});break;case"info":o.Am.info(t,{position:"bottom-center",autoClose:1e3,hideProgressBar:!0,closeOnClick:!1,pauseOnHover:!1,draggable:!1,theme:"dark",transition:o.Mi})}}handleRedirect(e){this.state.redirect||this.setState({redirect:!0})}componentDidMount(){for(var e=["clientId","organizationId","applicationId"],t=0;t<e.length;++t){var s=e[t];if(null==localStorage.getItem(s)||""==localStorage.getItem(s))return void this.handleRedirect()}var i=["appId","orgId"];for(t=0;t<i.length;++t){s=i[t];if(null==localStorage.getItem(s)||""==localStorage.getItem(s))return void this.handleRedirectApp()}this.getEncryption()}async getEncryption(){var e={organizationId:localStorage.getItem("orgId"),applicationId:localStorage.getItem("appId")},t=[...this.state.encryptions],s=!0;await(0,a.Rd)(e,a.fq.GetEncryption).then((function(e){e.success&&(t=e.data.encryptions)}),(e=>{401==e.status?this.handleRedirect():(s=!1,m=e.message)})),s||this.toastShow("error",m),this.setState({encryptions:t})}changeCollectionName(e,t){var s=[...this.state.encryptions];s[e].collectionName=t.target.value,this.setState({encryptions:s})}addNewCollection(){var e=[...this.state.encryptions];e.push({collectionName:"collectionName",fields:[],not_return:[]}),this.setState({encryptions:e})}removeCollection(e){var t=[...this.state.encryptions];t.splice(e,1),this.setState({encryptions:t})}changeFN(e,t,s){var i=[...this.state.encryptions],n=i[e];if(s.target.value.toString().indexOf(",")>=0){var l=this.getValueAsArrayByType(s.target.value);l[0]&&n[t].indexOf(l[0])<0&&n[t].push(l[0]),s.target.value=""}this.setState({encryptions:i})}removeFN(e,t,s){var i=[...this.state.encryptions],n=i[t];const l=n[s].indexOf(e);l>-1&&n[s].splice(l,1),this.setState({encryptions:i})}getFN(e,t,s){return(0,d.jsxs)("p",{className:"p-1 rounded border border-primary text-primary",children:[e,(0,d.jsxs)("span",{style:h,children:[" ",(0,d.jsx)("button",{type:"button",onClick:this.removeFN.bind(this,e,t,s),class:"btn-close","aria-label":"Close"})]})]})}async addUpdateEncryption(){this.toastShow("info","Processing..."),this.setVisible(!1);var e=[...this.state.encryptions],t={organizationId:localStorage.getItem("orgId"),applicationId:localStorage.getItem("appId"),encryptions:e},s=!0;await(0,a.Rd)(t,a.fq.AddEncryption).then((function(e){1==e.success?m="Saved!":(s=!1,m=e.message)}),(e=>{401==e.status?this.handleRedirect():(s=!1,m=e.message)}));var i=s?"success":"error";this.toastShow(i,m)}setVisible(e){this.setState({visible:e})}async setYesNoVisible(e,t,s,i,n){if(e)this.setState({yesNoVisible:e,yesNoQuestion:t,sendType:s,arguments:i});else{if(n)if("saveAll"===this.state.sendType)await this.addUpdateEncryption();this.setState({yesNoVisible:e,yesNoQuestion:"",sendType:"",arguments:[]})}}getValueAsArrayByType(e){var t=[];e.toString().indexOf(",")>=0?t=e.split(","):e&&t.push(e);return t}render(){const{redirect:e,sendApp:t}=this.state;return e?(0,d.jsx)(r.l_,{to:"/login"}):t?(0,d.jsx)(r.l_,{to:"/applications"}):(0,d.jsxs)(c.xH,{children:[(0,d.jsx)(o.Ix,{}),(0,d.jsxs)(c.rb,{className:"m-2 border-bottom d-flex align-items-center",children:[(0,d.jsx)(c.b7,{className:"col-6 pb-2",children:(0,d.jsxs)(c.tj,{children:["Add/Update ",(0,d.jsx)("b",{children:'"Encryption Data"'})]})}),(0,d.jsx)(c.b7,{className:"col-6 d-grid gap-2 d-md-flex justify-content-md-end pb-2",children:(0,d.jsx)(c.u5,{color:"info",style:{color:"#fff"},onClick:this.setYesNoVisible.bind(this,!0,"Are you sure you want to save all?","saveAll",[this]),children:"Save All"})}),(0,d.jsxs)(c.Tk,{visible:this.state.yesNoVisible,onClose:this.setYesNoVisible.bind(this,!1),children:[(0,d.jsx)(c.p0,{children:(0,d.jsx)(c.fl,{children:this.state.yesNoQuestion})}),(0,d.jsxs)(c.Ym,{children:[(0,d.jsx)(c.u5,{color:"secondary",onClick:this.setYesNoVisible.bind(this,!1,null,null,null,!1),children:"No"}),(0,d.jsx)(c.u5,{color:"primary",onClick:this.setYesNoVisible.bind(this,!1,null,null,null,!0),children:"Yes"})]})]})]}),(0,d.jsx)(c.sl,{style:p,children:(0,d.jsxs)(c.xH,{className:"mt-1",children:[(0,d.jsxs)(c.sl,{children:[(0,d.jsx)(c.tj,{children:"Collections"}),this.state.encryptions.length>0&&this.state.encryptions.map(((e,t)=>(0,d.jsxs)("div",{children:[(0,d.jsxs)(c.rb,{className:"mt-2",children:[(0,d.jsx)(c.b7,{className:"col-11",children:(0,d.jsx)(c.jO,{type:"text",name:"collectionName",onChange:this.changeCollectionName.bind(this,t),placeholder:"Collection Name",value:e.collectionName})}),(0,d.jsx)(c.b7,{className:"align-self-center",children:(0,d.jsxs)("span",{style:h,children:[" ",(0,d.jsx)("button",{type:"button",onClick:this.removeCollection.bind(this,t),class:"btn-close","aria-label":"Close"})]})})]}),(0,d.jsxs)(c.tj,{className:"mt-2",children:["Encrypt Fields for  ",(0,d.jsx)("b",{children:(0,d.jsx)("u",{children:e.collectionName})})," collection"]}),(0,d.jsx)(c.rb,{className:"mt-2 pb-2",children:(0,d.jsx)(c.b7,{className:"col-9",children:(0,d.jsx)(c.jO,{type:"text",name:"fields",onChange:this.changeFN.bind(this,t,"fields"),placeholder:"Encrypt Fields with comma"})})}),(0,d.jsx)(c.rb,{className:"mt-2",children:e.fields.map((e=>(0,d.jsx)(c.b7,{className:"col-3",children:this.getFN(e,t,"fields")})))}),(0,d.jsxs)(c.tj,{children:["Disabled Return Values of Fields for ",(0,d.jsx)("b",{children:(0,d.jsx)("u",{children:e.collectionName})})," collection"]}),(0,d.jsx)(c.rb,{className:"mt-2 pb-2",children:(0,d.jsx)(c.b7,{className:"col-9",children:(0,d.jsx)(c.jO,{type:"text",name:"not_return",onChange:this.changeFN.bind(this,t,"not_return"),placeholder:"Disable return Fields with comma"})})}),(0,d.jsx)(c.rb,{className:"mt-2",children:e.not_return.map((e=>(0,d.jsx)(c.b7,{className:"col-3",children:this.getFN(e,t,"not_return")})))})]})))]}),(0,d.jsx)(c.Bt,{children:(0,d.jsx)(c.rb,{className:"mt-2 justify-content-center",children:(0,d.jsx)(c.b7,{className:"col-6 text-center",children:(0,d.jsxs)(c.u5,{onClick:this.addNewCollection.bind(this),children:[(0,d.jsx)(n.Z,{icon:l.q}),"Add New Collection"]})})})})]})})]})}}const g=u},2439:(e,t,s)=>{s.d(t,{q:()=>i});const i=["512 512","<polygon fill='var(--ci-primary-color, currentColor)' points='440 240 272 240 272 72 240 72 240 240 72 240 72 272 240 272 240 440 272 440 272 272 440 272 440 240' class='ci-primary'/>"]}}]);
//# sourceMappingURL=182.b12e3957.chunk.js.map