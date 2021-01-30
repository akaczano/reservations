import React from "react";
import { Button, Container, Row, Col, Form, Table, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';

import SeatMap from './SeatMap';
import AsyncButton from '../helper/AsyncButton';
import { getMassTime, getMassTitle } from '../../util/DateFunctions';
import { getSeatList } from '../../util/seatFunctions';   
import { 
    getMass, 
    setSeatSelected, 
    confirm, 
    back,
    saveReservation
} from '../../actions/massActions'; 

import './MassDisplay.css';

const NUM_ROWS = 25;
const SEATS_PER_ROW = 13;

class MassDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {                        
            firstName: '',
            lastName: '',                            
        }
    }

    componentDidMount() {        
        this.props.getMass(this.props.match.params.id);        
    }

    handleClick = (seat) => {
        this.props.setSeatSelected(seat);
    }

    countSeats = () => {
        return this.props.seats.filter(status => status === "selected").length
    }



    confirmReservation = async (e) => {        
        e.preventDefault();        
        const firstName = this.state.firstName;
        const lastName = this.state.lastName;
        const seats = this.props.seats;
        const reservation = {
            firstName,
            lastName,
            seats: seats.map((seat, idx) => idx).filter(idx => seats[idx] === 'selected')
        }        
        this.props.saveReservation(this.props.match.params.id, reservation);
    }


    getComponent = () => {
        if (this.props.stage === 'selection') {
            return (
                <>
                    <SeatMap seats={this.props.seats} seatClicked={this.handleClick} />
                    <Row style={{ marginTop: '8px' }}>
                        <Col md={6}><p>Total Selected: {this.countSeats()}</p></Col>
                    </Row>
                    <Row style={{ marginTop: '8px', marginBottom: '15px' }}>
                        <Col md={6}>
                            <Button onClick={() => this.props.history.push('/')} style={{ marginRight: '8px' }}>
                                Back to menu
                        </Button>
                            <Button
                                onClick={() => this.props.confirm() }
                                disabled={this.countSeats() === 0}>
                                Continue
                            </Button>
                        </Col>
                    </Row>
                </>
            );
        }
        else if (this.props.stage === 'input') {
            return (
                <>
                    <Row><hr /></Row>
                    <Row><h4>Confirm Reservation</h4><br /></Row>
                    <Row>
                        <Form>
                            <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={this.state.firstName}
                                    onChange={e => this.setState({ firstName: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={this.state.lastName}
                                    onChange={e => this.setState({ lastName: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email (optional)</Form.Label>
                                <Form.Control type="email" />
                                <Form.Text>
                                    This will be used to send you a confirmation email,
                                    but will not be saved.
                                </Form.Text>
                            </Form.Group>
                            <AsyncButton
                                variant="primary"
                                type="submit"
                                onClick={e => this.confirmReservation(e)}                                
                                loading={this.props.posting}
                            >
                                Confirm Reservation
                            </AsyncButton>                            
                            <Button
                                style={{ marginLeft: '8px' }}
                                onClick={() => this.props.back() }
                            >
                                Cancel
                            </Button>
                            <Form.Text>
                                <span style={{color: 'red'}}>
                                    {this.props.postError}
                                </span>
                            </Form.Text>
                        </Form>
                    </Row>
                </>
            );
        }
        else if (this.props.stage === 'receipt') {
            let marySeats = this.props.seats
                .map((seat, idx) => idx)
                .filter(idx => this.props.seats[idx] === 'selected')
                .filter(idx => Math.floor(idx / (SEATS_PER_ROW * NUM_ROWS)) === 0);
            let josephSeats = this.props.seats
                .map((seat, idx) => idx)
                .filter(idx => this.props.seats[idx] === 'selected')
                .filter(idx => Math.floor(idx / (SEATS_PER_ROW * NUM_ROWS)) === 1);
            return (
                <>
                    <h3>Reservation Receipt</h3>
                    <Table size="sm">
                        <tbody>
                            <tr>
                                <td><h4>First name</h4></td>
                                <td><h4>{this.state.firstName}</h4></td>
                            </tr>
                            <tr>
                                <td><h4>Last Name</h4></td>
                                <td><h4>{this.state.lastName}</h4></td>
                            </tr>
                            <tr>
                                <td><h4>Mass Date</h4></td>
                                <td><h4>{this.props.mass.date.toDateString()}</h4></td>
                            </tr>
                            <tr>
                                <td><h4>Mass Time</h4></td>
                                <td><h4>{getMassTime(this.props.mass)}</h4></td>
                            </tr>
                            <tr>
                                <td><h4>Seats</h4></td>
                                <td>
                                    {getSeatList(0, marySeats)}<br />
                                    {getSeatList(1, josephSeats)}<br />
                                </td>
                            </tr>
                            <tr>
                                <td><h4>Reservation Time</h4></td>
                                <td><h4>
                                    {new Date().toLocaleTimeString()} on {new Date().toLocaleDateString()}                                    
                                </h4></td>
                            </tr>
                        </tbody>
                    </Table>

                </>
            );

        }
    }
    render() {        
        if (this.props.errorMessage !== null) {
            return <Container><h2>{this.props.errorMessage}</h2></Container>
        }
        else if (this.props.mass === null) {
            return (
                <Container>
                    <Row style={{ marginTop: '20px' }}>
                        <h3 style={{ marginRight: '10px' }}>Loading mass</h3>
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Row>
                </Container>
            );
        }
        return (
            <Container style={{marginTop: '15px', marginLeft: '4px' }}>
                <Row>
                    <h3>Reserve Seats for {getMassTitle(this.props.mass)}</h3>
                </Row>
                {this.getComponent()}
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        mass: state.mass.mass,
        seats: state.mass.seats,
        errorMessage: state.mass.errorMessage,
        stage: state.mass.stage,
        posting: state.mass.posting,
        postError: state.mass.postError
    };
};

export default connect(
    mapStateToProps, { 
        getMass, 
        setSeatSelected, 
        confirm, 
        back,
        saveReservation 
    })(MassDisplay);