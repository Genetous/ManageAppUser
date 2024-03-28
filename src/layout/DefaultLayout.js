import React, { Component } from 'react';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Link, Redirect } from 'react-router-dom'

export class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
        redirect:false
    };
    this.handleRedirect = this.handleRedirect.bind(this);
   
}
componentDidMount(){
  if (localStorage.getItem('token') == null || localStorage.getItem('token') == "") {
    if(!this.state.redirect)
      this.setState({redirect:true})
  }
}
handleRedirect(e){
    if(!this.state.redirect)
        this.setState({redirect:true})
}
  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to='/login' />;
    }
    return (
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <AppHeader handleRedirect={this.handleRedirect} />
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </div>
    )
  }
}

export default DefaultLayout
