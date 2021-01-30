import React from 'react';
import { connect } from 'react-redux';

import ConfigForm from './config/ConfigForm';
import ConfigList from './config/ConfigList';
import MassForm from './mass/MassForm';
import WeeklyMassList from './weekly/WeeklyMassList';
import WeeklyMassForm from './weekly/WeeklyMassForm';
import Dashboard from './Dashboard';
import SideBar from './Sidebar';


class Admin extends React.Component {

    dashboard = () => {
        return <Dashboard />
    }
    createMass = () => {
        return <MassForm />
    }
    configs = () => {        
        if (this.props.selectedConfig) {
            return <ConfigForm />
        }
        else {
            return <ConfigList />
        }
    }    
    weeklyMasses = () => {
        if (this.props.selectedWeekly) {
            return <WeeklyMassForm />
        }
        else {
            return <WeeklyMassList />
        }
    }
    accounts = () => {
        return <div>Manage accounts</div>
    }

    render() {

        const labels = [
            'Dashboard',
            'Configurations',
            'Create mass',            
            'Weekly masses',
            'Accounts'
        ];
        const components = [
            this.dashboard,  
            this.configs,                        
            this.createMass,             
            this.weeklyMasses, 
            this.accounts
        ];

        if (!this.props.authorized) {
            return <h3 style={{marginLeft: '25px'}}><a href="/login">Login</a> to view this page</h3>
        }
        return <SideBar 
            labels={labels}
            components={components}
        />        
    }
}

const mapStateToProps = state => {    
    return {
        authorized: state.auth.isAuthenticated,
        selectedConfig: state.admin.config.selectedConfig,
        selectedWeekly: state.admin.weeklyMassForm.selected
    };
};

export default connect(mapStateToProps)(Admin);