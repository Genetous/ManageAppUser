import React, { Component } from 'react';
import CreateCollection from './createCollection';
import UpdateCollection from './updateCollection';
import DeleteCollection from './deleteCollection';
import {
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CRow,
    CCol,
    CContainer,
} from '@coreui/react'
import { bool } from 'prop-types';
const vars = {
    'cursor': "pointer",
    "color":  "rgb(33, 37, 41)",
    "background-color": "#fff"
}
const activeLink = {
    'cursor': "pointer",
    "background-color": "rgb(33, 37, 41)",
    "color": "#fff"
}
const dangerIcon = {
    "color": "#c6c6c6"
}
export class AddDbJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permissionItems: ["Create Collection", "Update Collection", "Delete Collection"],
            collectionCreateRules: [],
            activeKey: 1,
            activeSubKeys: [1, 1, 1, 1, 1],
            subKeys: []
        }
    }
    setActiveKey(key) {
        this.setState({ activeKey: key });
        return false;
    }

    render() {

        return (
            <CContainer className='p-5'>

                <CRow>
                    <CCol className='col-2'>
                        <CNav className='flex-column' role="tablist" style={vars} >
                            {this.state.permissionItems.map((item, index) => (
                                <CNavItem>
                                    <CNavLink
                                        style={this.state.activeKey === index + 1 ? activeLink : vars}
                                        active={this.state.activeKey === index + 1}
                                        onClick={this.setActiveKey.bind(this, index + 1)}
                                    >
                                        {item}
                                    </CNavLink>
                                </CNavItem>
                            ))}
                        </CNav>

                    </CCol>
                    <CCol className='col-10 justify-content-center'>
                        <CTabContent>
                            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
                               <CreateCollection/>
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
                               <UpdateCollection/>
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 3}>
                               <DeleteCollection/>
                            </CTabPane>
                        </CTabContent>
                    </CCol>
                </CRow>

            </CContainer>
        )
    }
}
export default AddDbJob