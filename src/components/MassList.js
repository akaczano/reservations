import React from 'react';
import { Row, Card, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    loadList, publishMass, setDeletePending, setDeleteCanceled, deleteMass, setFilter
} from '../actions/massListActions';
import { getMassTitle } from '../util/DateFunctions';
import AsyncButton from './helper/AsyncButton';
import DatePicker from './admin/mass/DatePicker';

class MassList extends React.Component {

    componentDidMount() {
        this.props.loadList();
    }

    getTotalReservations(mass) {
        return mass.reservations
            .map(r => r.seats.length)
            .reduce((a, b) => a + b, 0);
    }

    getExtraButtons(mass) {
        if (this.props.authorized) {
            return (
                <>
                    <Button
                        style={{ marginLeft: '18px' }}
                        variant="info"
                        onClick={() => this.props.history.push(`/view/${mass._id}`)}
                    >
                        View
                    </Button>
                    <AsyncButton
                        variant="info"
                        style={{ marginLeft: '18px', marginRight: '18px' }}
                        loading={this.props.publishing === mass._id}
                        onClick={() => this.props.publishMass(mass)}
                    >
                        {mass.published ? 'Hide' : 'Publish'}
                    </AsyncButton>
                    <Button
                        variant="info"                        
                        onClick={() => this.props.setDeletePending(mass._id)}                        
                    >
                        {this.props.deleting === mass._id ? (<Spinner animation="border" />) : 'Delete'}
                    </Button>
                </>
            );
        }
    }

    getFilter() {
        if (!this.props.authorized) return null;
        return (
            <Form>
                <Form.Row>
                    <Form.Group>
                        <Form.Label style={{ marginRight: '6px' }}>
                            Start Date
                        </Form.Label>
                        <DatePicker
                            value={this.props.filter.startDate}
                            onChange={value => {
                                value = new Date(value.setHours(0));
                                value = new Date(value.setMinutes(0));
                                this.props.setFilter({
                                    ...this.props.filter,
                                    startDate: value
                                });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Check
                            label="Published Only"
                            style={{ marginLeft: '10px' }}
                            value={this.props.filter.published}
                            onChange={e => this.props.setFilter({                                
                                ...this.props.filter,
                                published: !this.props.filter.published
                            })}
                        />
                    </Form.Group>
                </Form.Row>
            </Form>
        )
    }

    getContent() {
        if (this.props.massList !== null) {
            return (
                this.props.massList.filter(m => {
                    console.log(m.date);
                    console.log(this.props.filter.startDate);
                    if (m.date < this.props.filter.startDate) return false;
                    if (!m.published) {
                        return this.props.authorized && !this.props.filter.published;
                    }
                    return true;
                }).sort((m1, m2) => m1.date - m2.date).map(mass =>
                    <Row key={mass._id} style={{ justifyContent: 'center' }}>
                        <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Card.Title>{getMassTitle(mass)}</Card.Title>
                                <Card.Text>
                                    {this.getTotalReservations(mass)} seats reserved
                                </Card.Text>
                                <ReserveButton mass={mass} style={{marginBottom: '6px'}} />
                                {this.getExtraButtons(mass)}
                            </Card.Body>
                        </Card>

                    </Row>
                )
            );
        }
        else if (this.props.error) {
            return <h2>Failed to load masses</h2>
        }
        else {
            return (
                <Row>
                    <h3 style={{ marginRight: '10px' }}>Loading mass list</h3>
                    <Spinner animation="border" />
                </Row>
            );
        }
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '15px', width: '80vw' }}>
                <Modal
                    size="sm"
                    show={this.props.displayDeleteModal}
                    onHide={() => this.props.setDeleteCanceled()}
                >
                    <Modal.Header>
                        <Modal.Title>
                            Are you sure you want to delete this mass?
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button
                            onClick={() => this.props.deleteMass(this.props.deleting)}
                        >
                            Yes
                        </Button>
                        <Button onClick={() => this.props.setDeleteCanceled()}>No</Button>
                    </Modal.Footer>
                </Modal>
                <Row>{this.getFilter()}</Row>
                <Row style={{ justifyContent: 'center' }}><h3>Upcoming Masses</h3></Row>
                <hr />
                {this.getContent()}
            </div>
        );
    }
}

function ReserveButton(props) {
    let history = useHistory();
    return (
        <Button
            variant="info"
            onClick={() => { history.push(`/mass/${props.mass._id}`) }}
        >
            Reserve Seats
        </Button>
    );
}

const mapStateToProps = state => {
    return {
        massList: state.massList.massList,
        error: state.massList.error,
        publishing: state.massList.publishing,
        authorized: state.auth.isAuthenticated,
        displayDeleteModal: state.massList.displayDeleteModal,
        deleting: state.massList.deleting,
        filter: state.massList.filter
    };
};

export default connect(
    mapStateToProps,
    { loadList, publishMass, setDeletePending, setDeleteCanceled, deleteMass, setFilter }
)(MassList);