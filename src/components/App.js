import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'

import MassList from './MassList';
import Navbar from './layout/Navbar';
import MassDisplay from './reservation/MassDisplay';
import Info from './layout/Info';
import Admin from './admin/Admin';
import Login from './Login';
import MassView from './MassView';
import store from "../store";
import { loadUser } from '../actions/authActions';

class App extends React.Component {

    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Navbar />
                    <Switch>
                        <Route exact path="/" component={MassList} />
                        <Route path="/mass/:id" component={MassDisplay} />                            
                        <Route exact path="/info" component={Info} />  
                        <Route exact path="/login" component={Login} />  
                        <Route exact path="/admin" component={Admin} />  
                        <Route exact path="/view/:id" component={MassView} />                                      
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;