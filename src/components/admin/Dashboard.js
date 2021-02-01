import React from 'react';
import { connect } from 'react-redux';
import { Row, Spinner } from 'react-bootstrap';
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis
 } from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart'

import { loadMassList } from '../../actions/dashboardActions';

class Dashboard extends React.Component {
    componentDidMount() {
        this.props.loadMassList();
    }
    render() {
        if (this.props.error) {
            return <h2>Failed to load dashboard</h2>
        }
        else if (!this.props.totals) {
            return (
                <Row>
                    <h3 style={{ marginRight: '10px', marginLeft: '15px' }}>Loading dashboard</h3>
                    <Spinner animation="border" />
                </Row>
            );
        }
        else {
            const data = Object.keys(this.props.totals).map(date => {
                return {mass: date, reservations: this.props.totals[date]};
            });
            
            return (                
                <Chart data={data}>
                    <ArgumentAxis />
                    <ValueAxis max={100}/>
                    <BarSeries 
                        valueField="reservations"
                        argumentField="mass"
                    />
                    <Title text="Active Reservations" />
                    <Animation />
                </Chart>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        totals: state.admin.dashboard.totals,
        error: state.admin.dashboard.error
    };
};

export default connect(mapStateToProps, { loadMassList })(Dashboard);