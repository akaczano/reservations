import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import AsyncButton from '../../helper/AsyncButton';
import SeatMap from '../../reservation/SeatMap';
import {
    goBack,
    selectSeat,
    selectRow,
    saveConfig,
    setName
} from '../../../actions/configDataActions';

class ConfigForm extends React.Component {

    seatClicked = (seat, event) => {
        if (event.ctrlKey) {
            this.props.selectRow(seat);
        }
        else {
            this.props.selectSeat(seat);
        }
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.saveConfig(this.props.config);
    }

    render() {
        console.log(this.props.error);
        return (
            <Form onSubmit={this.onSubmit}>
                <Form.Group>
                    <Form.Label>
                        Configuration Name
                    </Form.Label>
                    <Form.Control
                        type="text"
                        value={this.props.config.name}
                        onChange={e => this.props.setName(e.target.value)}
                    />
                    <Form.Text>
                        <span style={{ color: 'red' }}>{this.props.error}</span>
                    </Form.Text>
                </Form.Group>
                <SeatMap seats={this.props.seatMap} seatClicked={this.seatClicked} />
                <div style={{ marginTop: '10px' }}>
                    <AsyncButton type="submit">
                        Save
                    </AsyncButton>
                    <Button
                        variant="primary"
                        onClick={() => this.props.goBack()}
                        style={{ marginLeft: '10px' }}
                    >
                        Cancel
                    </Button>
                </div>

            </Form>
        );
    }
}

const mapStateToProps = state => {
    return {
        config: state.admin.config.selectedConfig,
        seatMap: state.admin.config.seatMap,
        error: state.admin.config.errorMessage
    }
};

export default connect(mapStateToProps,
    { goBack, selectSeat, selectRow, saveConfig, setName }
)(ConfigForm);