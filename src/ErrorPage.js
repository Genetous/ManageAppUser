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
    CCardFooter,
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
export class ErrorPage extends Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
              <CRow className="justify-content-center">
                <CCol md={6}>
                  <div className="clearfix">
                    <h1 className="float-start display-3 me-4">{this.props.status}</h1>
                    <p className="text-medium-emphasis float-start">
                      {this.props.message}
                    </p>
                  </div>
                  <CInputGroup className="input-prepend">
                    <CInputGroupText>
                      <CIcon icon={cilMagnifyingGlass} />
                    </CInputGroupText>
                    <CFormInput type="text" placeholder="What are you looking for?" />
                    <CButton color="info">Search</CButton>
                  </CInputGroup>
                </CCol>
              </CRow>
            </CContainer>
          </div>
        )
    }
}
export default ErrorPage