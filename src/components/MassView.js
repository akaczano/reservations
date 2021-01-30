import React from 'react';
import { Tabs, Tab, Spinner, ListGroup, Row, Container, Card, Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux';
import {
    loadMass, cancelReservation, setCancelPending, setCancelCanceled
} from '../actions/viewActions';
import { getFullSeatList, getFullPdfList } from '../util/seatFunctions';
import AsyncButton from './helper/AsyncButton';
import SeatMap from './reservation/SeatMap';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { days, months } from '../util/util';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});


class MassView extends React.Component {
    state = { selectedReservation: null }
    componentDidMount() {
        this.props.loadMass(this.props.match.params.id);
    }

    getDocument() {
        const resList = this.props.mass.reservations.slice();
        resList.sort((a, b) => a.lastName > b.lastName);

        resList.push({
            seats: this.props.seatMap
                .map((s, i) => i)
                .filter(i => this.props.seatMap[i] === 'available')
                .sort((a, b) => a - b),
            firstName: 'Walk',
            lastName: 'In'
        });

        return (
            <Document>
                <Page size="A4" style={{ paddingVertical: '8mm' }}>
                    <View style={styles.section}>
                        <Text style={{ textAlign: 'center', fontSize: '6.5mm' }}>
                            Reservation List
                        </Text>
                        {resList.map(r => {
                            return (
                                <>
                                    <Text style={{
                                        fontSize: '5mm',
                                        fontWeight: 'semibold',
                                        marginBottom: '1mm',
                                        marginTop: '3mm'
                                    }}
                                    >
                                        {r.lastName},{r.firstName}
                                    </Text>
                                    {getFullPdfList(r.seats)}
                                </>
                            );
                        })}
                    </View>
                </Page>
            </Document>
        );
    }

    getList() {
        return (
            <>
                <Modal
                    size="sm"
                    onHide={() => this.props.setCancelCanceled()}
                    show={this.props.staged !== null}
                >
                    <Modal.Header>
                        <Modal.Title>
                            Are you sure you want to cancel this reservation?
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button
                            onClick={() => this.props.cancelReservation(this.props.mass, this.props.staged)}
                            style={{ marginRight: '18px' }}
                        >
                            Yes
                        </Button>
                        <Button onClick={() => this.props.setCancelCanceled()}>No</Button>
                    </Modal.Footer>
                </Modal>
                <ListGroup style={{ marginTop: '8px' }}>
                    {this.props.mass.reservations.map(r => {
                        return (
                            <ListGroup.Item key={r._id} style={{ marginLeft: '12px', marginRight: '12px' }}>

                                <h4 style={{ color: '#2da65d' }}>{r.lastName}, {r.firstName}</h4>                                                                                                                                            
                                <AsyncButton
                                    style={{ marginLeft: '20px', maxHeight: '35px', float: 'right'}}
                                    variant="info"
                                    loading={this.props.canceling === r._id}
                                    onClick={() => {
                                        this.props.setCancelPending(r);
                                        this.setState({ selectedReservation: null });
                                    }}
                                >
                                    Cancel
                            </AsyncButton>
                            {getFullSeatList(r.seats)}
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </>
        );
    }

    getReservationCard() {
        const title = this.state.selectedReservation ?
            this.state.selectedReservation.lastName + ', ' + this.state.selectedReservation.firstName :
            'No reservation selected';

        return (
            <Card>
                <Card.Body>
                    <Card.Title>
                        {title}
                    </Card.Title>
                    <Card.Text>
                        {getFullSeatList(this.state.selectedReservation?.seats)}
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    selectSeat = seat => {
        const res = this.props.mass.reservations.find(r => r.seats.includes(seat));
        this.setState({ selectedReservation: res });
    }

    render() {
        if (!this.props.authorized) {
            return (
                <div style={{ marginTop: '5px', marginLeft: '5px' }}>
                    <h3>Please <a href="/login">login</a> to view this page</h3>
                </div>
            )
        }
        else if (this.props.error) {
            return <h3>Failed to load mass view</h3>
        }
        else if (this.props.mass === null) {
            return (
                <div>
                    <h3>Loading mass</h3>
                    <Spinner animation="border" />
                </div>
            );
        }

        let day = days[this.props.mass.date.getDay()];
        let month = months[this.props.mass.date.getMonth()];
        let date = this.props.mass.date.getDate();
        let hour = this.props.mass.date.getHours();
        let minutes = this.props.mass.date.getMinutes() < 10 ?
            "0" + this.props.mass.date.getMinutes() : this.props.mass.date.getMinutes();
        let ampm = hour >= 12 ? "PM" : "AM";
        hour = hour > 12 ? hour - 12 : hour;
        let filename = `SeatList_${day}_${month}_${date}_${hour}_${minutes}_${ampm}.pdf`

        return (
            <Tabs defaultActiveKey="list">
                <Tab eventKey="list" title="Reservation List">
                    <PDFDownloadLink
                        document={this.getDocument()}
                        fileName={filename}
                        style={{ marginLeft: '12px', fontSize: '17px' }}
                    >
                        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download List')}
                    </PDFDownloadLink>
                    {this.getList()}
                </Tab>
                <Tab eventKey="map" title="Seat Map">
                    <Container>
                        <SeatMap
                            seats={this.props.seatMap}
                            seatClicked={this.selectSeat}
                            seatMouseOver={() => { }}
                            selectedReservation={this.state.selectedReservation}
                        />
                    </Container>
                    {this.getReservationCard()}
                </Tab>
            </Tabs>
        );
    }
}

const mapStateToProps = state => {
    return {
        mass: state.massView.mass,
        canceling: state.massView.canceling,
        error: state.massView.error,
        seatMap: state.massView.seatMap,
        authorized: state.auth.isAuthenticated,
        staged: state.massView.staged
    };
};

export default connect(
    mapStateToProps,
    { loadMass, cancelReservation, setCancelPending, setCancelCanceled }
)(MassView);