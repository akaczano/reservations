import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { BsTrashFill } from 'react-icons/bs';

import AsyncButton from '../../helper/AsyncButton';
import {
    saveItem,
    goBack,
    setDay,
    setHour,
    setMinute,
    setConfig,
    setPM,
    newReservation,
    deleteReservation
} from '../../../actions/weeklyActions';
import { days } from '../../../util/util';
import SelectionDialog from './SelectionDialog';

class WeeklyMassForm extends React.Component {

    componentDidMount() {        
        if (this.props.configList && this.props.configList.length > 0) {                        
            if (this.props.entry.configurationId.length > 1) {
                
                this.props.setConfig(this.props.configList[0])
            }
        }
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.saveItem();
    }
    render() {

        if (this.props.success) {
            return (
                <div>
                    <Alert variant="success">
                        Weekly mass saved successfully
                    </Alert>
                    <Button style={{ marginTop: '20px' }} onClick={() => this.props.goBack()}>
                        Done
                    </Button>
                </div>
            );
        }

        return (
            <>
                <SelectionDialog />
                <Form style={{ marginRight: '15px' }} onSubmit={this.onSubmit}>

                    <h3>Edit Weekly Mass</h3>
                    <Form.Row>
                        <Form.Group>
                            <Form.Label>Day</Form.Label>
                            <Form.Control
                                as="select"
                                value={this.props.entry.day}
                                onChange={e => this.props.setDay(e.target.value)}
                            >
                                {days.map((day, idx) => {
                                    return (
                                        <option value={idx} key={day}>{day}</option>
                                    );
                                })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group style={{ marginLeft: '15px' }}>
                            <Form.Label>Hour</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={e => this.props.setHour(e.target.value)}
                                value={this.props.rawHour}
                                isInvalid={this.props.hourInvalid}
                            />
                            <Form.Control.Feedback type="invalid">
                                Invalid hour
                        </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group style={{ marginLeft: '15px' }}>
                            <Form.Label>Minute</Form.Label>
                            <Form.Control
                                type="text"
                                value={this.props.rawMinute}
                                onChange={e => this.props.setMinute(e.target.value)}
                                isInvalid={this.props.minuteInvalid}
                            />
                            <Form.Control.Feedback type="invalid">
                                Invalid minute
                        </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group style={{ marginLeft: '15px' }}>
                            <Form.Label>AM/PM</Form.Label>
                            <Form.Control
                                as="select"
                                value={this.props.pm}
                                onChange={e => this.props.setPM(e.target.value)}
                            >
                                <option value={false}>AM</option>
                                <option value={true}>PM</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Group>
                        <Form.Label>Configuration</Form.Label>
                        <Form.Control
                            as="select"
                            value={this.props.entry.configurationId}
                            onChange={e => this.props.setConfig(this.props.configList.find(c => c._id === e.target.value))}
                            isInvalid={this.props.configInvalid}
                        >
                            {this.props.configList?.map(c => {
                                return (
                                    <option value={c._id} key={c._id}>{c.name}</option>
                                );
                            })}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            This configuration conflicts with at least one of your 
                            recurring reservations
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Recurring Reservations</Form.Label>
                        <ListGroup>
                            {this.props.entry.recurringReservations.map((entry, i) => {
                                return (
                                    <ListGroup.Item key={entry.seats.toString()}>
                                        {entry.lastName}, {entry.firstName} ({entry.seats.length} seats)
                                        <Button
                                            variant="info"
                                            className="pull-right"
                                            style={{ marginLeft: '10px' }}
                                            onClick={() => this.props.deleteReservation(i)}
                                        >
                                            <BsTrashFill />
                                        </Button>
                                    </ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                        <Button
                            style={{ marginTop: '8px' }}
                            onClick={() => this.props.newReservation(this.props.configList.find(c => c._id === this.props.entry.configurationId))}
                        >
                            Add
                        </Button>
                    </Form.Group>
                    <AsyncButton
                        style={{ marginRight: '10px' }}
                        loading={this.props.saving}
                        type="submit"
                    >
                        Save
                </AsyncButton>
                    <Button onClick={() => this.props.goBack()}>Cancel</Button>
                </Form>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        entry: state.admin.weeklyMassForm.selected,
        errorMessage: state.admin.weeklyMassForm.errorMessage,
        saving: state.admin.weeklyMassForm.saving,
        configList: state.admin.config.configList,
        hourInvalid: state.admin.weeklyMassForm.hourInvalid,
        minuteInvalid: state.admin.weeklyMassForm.minuteInvalid,
        configInvalid: state.admin.weeklyMassForm.configInvalid,
        rawHour: state.admin.weeklyMassForm.rawHour,
        rawMinute: state.admin.weeklyMassForm.rawMinute,
        pm: state.admin.weeklyMassForm.pm,
        success: state.admin.weeklyMassForm.saved        
    };
};

export default connect(
    mapStateToProps,
    { saveItem, goBack, setDay, setHour, setMinute, setConfig, setPM, newReservation, deleteReservation }
)(WeeklyMassForm);
