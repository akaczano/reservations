import React from 'react';
import { Row, Col } from 'react-bootstrap';

const NUM_ROWS = 25;
const SEATS_PER_ROW = 13;

function Seat(props) {
    let className = "seat seat-" + props.status;
    return (
        <div 
            className={className} 
            onClick={e => props.onClick(e)}
            onMouseEnter={props.mouseEnter}
            style={{color: props.highlight ? '#5c34eb' : 'black'}}            
        >
            {props.value}
        </div>
    )
}

const SeatMap = ({ seats, seatClicked, seatMouseOver, selectedReservation}) => {
    if (!seatMouseOver) {
        seatMouseOver = () => {};
    }
    const getSeatMap = side => {
        return (
            seats
                .filter((_state, idx) => Math.floor(idx / (NUM_ROWS * SEATS_PER_ROW)) === side)
                .map((seat, idx) => {
                    let number = Math.abs(-12 * side + 12 - (idx % 13));
                    if (number === 0) {
                        number = String.fromCharCode(97 + idx / 13);
                        seat = "row-label";
                    }
                    return (
                        <Seat
                            key={idx}
                            value={number}
                            status={seat}
                            onClick={e => seatClicked(idx + side * (NUM_ROWS * SEATS_PER_ROW), e)}
                            mouseEnter={() => seatMouseOver(idx + side * (NUM_ROWS * SEATS_PER_ROW))}
                            highlight={selectedReservation?.seats.includes(idx + side * (NUM_ROWS * SEATS_PER_ROW))}
                        />
                    )
                })
        );
    }


    return (
        <>
            <Row style={{justifyContent: 'center'}}>
                <h4 style={{ textAlign: 'center' }}>Altar</h4>                
            </Row>
            <Row><br /></Row>
            <Row className="church">
                <Col md={6} style={{ justifyContent: 'center' }}>
                    <h4 style={{ textAlign: 'center' }}>Mary's Side</h4>
                    <div className="seats">
                        {getSeatMap(0)}
                    </div>
                </Col>
                <Col md={6} style={{ justifyContent: 'center' }}>
                    <h4 style={{ textAlign: 'center' }}>Josephs's Side</h4>
                    <div className="seats">
                        {getSeatMap(1)}
                    </div>
                </Col>
            </Row>
        </>
    );

};

export default SeatMap;