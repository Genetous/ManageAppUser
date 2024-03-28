import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { loginOrganization, verifyToken } from "../../genetousApi"
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
const inlineb = {
  "display": "inline-block"
}

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      userpass: "",
      redirect: false,
      spinner: true,
      eyes: {
        userpassEye: false,
      },
      types: {
        userpassEye: "password",
      }
    }
  }
  changeEye(d, e) {
    e.preventDefault
    var eyes = { ...this.state.eyes }
    var types = { ...this.state.types }
    eyes[d] = eyes[d] == true ? false : true;
    types[d] = eyes[d] == true ? "text" : "password"
    this.setState({ eyes, types });
    return false;
  }
  change(e) {
    this.state[e.target.name] = e.target.value;
    this.setState();
  }
  componentDidMount() {
    this.verify();
  }
  async verify() {
    var loggedIn = false
    await verifyToken().then(function (result) {
      if (result == 200) {
        loggedIn = true;
      } else {

        localStorage.removeItem("token")
        localStorage.removeItem("clientId")
        localStorage.removeItem("organizationId")
        localStorage.removeItem("applicationId")
        localStorage.removeItem("appId")
        localStorage.removeItem("orgId")
      }
    }, err => {
      localStorage.removeItem("token")
      localStorage.removeItem("clientId")
      localStorage.removeItem("organizationId")
      localStorage.removeItem("applicationId")
      localStorage.removeItem("appId")
      localStorage.removeItem("orgId")
    });
    this.setState({ redirect: loggedIn })
  }
  async login(e) {
    e.preventDefault();
    await this.setState({ spinner: false })
    var model = {
      where: {
        and: {
          relationName: "organizationRelations",
          isActive: true
        }
      },
      related: {
        collectionName: "user",
        where: {
          and: {
            username: this.state.username,
            userpass: this.state.userpass,
            isActive: true
          }
        }
      }
    }
    var loggedIn = false
    var spinner = false;
    var errMes;
    await loginOrganization(model, 0).then(function (result) {
      if (result.success == true) {
        loggedIn = true;
      } else {
        errMes = result.message;
      }
    }, err => {
      errMes = err.message;
    });
    if (!loggedIn) {
      toast.error(errMes, {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        theme: "dark",
        transition: Slide
      });
      spinner = true;
    }
    this.setState({ redirect: loggedIn, spinner: spinner })
  }
  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to='/applications' />;
    }
    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <ToastContainer />
          <CRow className="justify-content-center">
            <CCol md={4}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={this.login.bind(this)}>
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">Sign In to your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput placeholder="Username"
                          required
                          name='username'
                          onChange={this.change.bind(this)} />
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type={this.state.types.userpassEye}
                          required
                          placeholder="Password"
                          autoComplete="current-password"
                          name='userpass' onChange={this.change.bind(this)} />
                        <CInputGroupText className='p-0'>
                          <button type="button" className="btn btn-link" onClick={this.changeEye.bind(this, "userpassEye")}>
                            {this.state.eyes.userpassEye && <Eye />} {!this.state.eyes.userpassEye && <EyeSlash />}
                          </button>
                        </CInputGroupText>
                      </CInputGroup>
                     
                      <CRow className="justify-content-center">
                        <CCol className='text-center d-grid gap-2 col-6 mx-auto' md={6}>
                          <CButton color="primary" type='submit' size='lg'
                            disabled={!this.state.spinner}>
                            <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" 
                            hidden={this.state.spinner} className='mx-1' />

                            Login
                          </CButton>
                          {/* <CSpinner color="primary" hidden={this.state.spinner} /> */}
                        </CCol>
                        
                      </CRow>
                      <CRow className="justify-content-center">
                      <CCol xs={6} className="text-center">
                          <Link to="/forgot">
                            <CButton color="link" className="px-0">
                              Forgot password?
                            </CButton>
                          </Link>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                {/* <CCard className="text-white bg-primary py-5" >
                  <CCardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        <h5>
                          Create a new <u><b>genetous</b></u> account now to start developing your app!

                        </h5>
                      </p>
                      <Link to="/register">
                        <CButton color="success" className="mt-2" size='lg'>
                          Join Private Beta Now!
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard> */}
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}

export default Login