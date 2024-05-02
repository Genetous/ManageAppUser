import React, { Component } from 'react';
import * as icon from '@coreui/icons';
import { logout, organization } from "../genetousApi"
import { connect, useSelector } from 'react-redux';
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { logo } from 'src/assets/brand/logo'
import AppToggleHook from "./AppToggleHook"
export class AppHeader extends Component {
  constructor(props) {
    super(props);

  }

  async logOut(e) {
    await logout().then(function (result) {
      this.removeStorage();
    }, err => {
      this.removeStorage();
      if (err === 200) {
        alert("success");
      } else if (err === 400) {
        alert("Not Found")
      } else if (err === 403) {
        alert("Forbidden")
      }
      else if (err === 401) {
        
      } else {

      }
    });

    return false;
  }
  removeStorage() {
    
    localStorage.removeItem("token")
    localStorage.removeItem("clientId")
    localStorage.removeItem("appId")
    localStorage.removeItem("orgId")
    delete organization.clientId;
    this.props.handleRedirect();
  }
  render() {
    return (
      <CHeader position="sticky" className="mb-4">
        <CContainer fluid>
          <AppToggleHook />
          <CHeaderBrand><CIcon icon={logo} height={48} width={218} alt="Logo" /></CHeaderBrand>

          <CHeaderNav>

            <CNavItem>
              <CNavLink href='#' onClick={this.logOut.bind(this)}>
                <CIcon icon={icon.cilAccountLogout} size="lg" />
              </CNavLink>
            </CNavItem>
          </CHeaderNav>

        </CContainer>

      </CHeader>
    )
  }
}

export default connect()(AppHeader);
