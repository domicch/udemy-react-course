import React, {Component} from 'react';
import {connect} from 'react-redux'
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Checkout from './containers/Checkout/Checkout';
import {Route, Switch } from 'react-router-dom';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout'
import * as actions from './store/actions/index';

class App extends Component{

  componentDidMount() {
    this.props.onAuthCheckState();
  }
  
  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/" component={BurgerBuilder} />
      </Switch>
    );

    if(this.props.isAuthenticated){
      routes = (
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/checkout" render={(props) => <Checkout testprops="a" {...props}/>} />
          <Route path="/orders" component={Orders} />
          <Route path="/logout" component={Logout} />
          <Route path="/" component={BurgerBuilder} />
        </Switch>
      );
    }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuthCheckState: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
