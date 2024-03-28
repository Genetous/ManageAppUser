import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeaderToggler
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
const AppToggleHook = () => {
    const dispatch = useDispatch()
    const sidebarShow = useSelector((state) => state.sidebarShow)
  
    return (
        <CHeaderToggler
        className="ps-1"
        onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
      >
        <CIcon icon={cilMenu} size="lg" />
      </CHeaderToggler>
    )
  }
  export default AppToggleHook