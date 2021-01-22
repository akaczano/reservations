import React from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import SeatMap from '../../reservation/SeatMap';

import {
    setFirstName,
    setLastName,
    selectSeat,
    closeSelect,
    saveReservation
} from '../../../actions/weeklyActions';

class SelectionDialog extends React.Component {
    render() {
        return (
            <Modal
                size="lg"
                show={this.props.visible}
                onHide={() => this.props.closeSelect()}
            >
                <Modal.Header>
                    <Modal.Title>
                        Create Recurring Reservation
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>First name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={this.props.firstName}
                                onChange={e => this.props.setFirstName(e.target.value)}
                                isInvalid={this.props.firstInvalid}/>
                            <Form.Control.Feedback type="invalid">
                                Invalid first name
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={this.props.lastName}
                                onChange={e => this.props.setLastName(e.target.value)}
                                isInvalid={this.props.lastInvalid}/>
                            <Form.Control.Feedback type="invalid">
                                Invalid last name
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                    <SeatMap seats={this.props.seatMap} seatClicked={s => this.props.selectSeat(s)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        disabled={this.props.seats.length < 1}
                        onClick={() => this.props.saveReservation()}
                    >
                        Save
                    </Button>
                    <Button onClick={ () => this.props.closeSelect() }>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        firstName: state.admin.weeklyMassForm.selection.firstName,
        lastName: state.admin.weeklyMassForm.selection.lastName,
        seatMap: state.admin.weeklyMassForm.selection.seatMap,
        seats: state.admin.weeklyMassForm.selection.seats,
        visible: state.admin.weeklyMassForm.selection.modalVisible,
        firstInvalid: state.admin.weeklyMassForm.selection.firstInvalid,
        lastInvalid: state.admin.weeklyMassForm.selection.lastInvalid
    };
};

export default connect(
    mapStateToProps,
    { setFirstName, setLastName, selectSeat, closeSelect, saveReservation }
)(SelectionDialog);