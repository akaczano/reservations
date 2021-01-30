import React from 'react';
import { connect } from 'react-redux';
import { Form, Spinner, Alert, Button} from 'react-bootstrap';
import { loadConfigList } from '../../../actions/configDataActions';
import { saveMass, setDate, setConfig, setPublished, setDone } from '../../../actions/massDataActions';
import DatePicker from './DatePicker';
import AsyncButton from '../../helper/AsyncButton';

class MassForm extends React.Component {
    state = { 
        rawHours: '', 
        rawMinutes: '', 
        hoursInvalid: false,
        minutesInvalid: false,
        ampm: "am"
    }

    componentDidMount() {
        if (this.props.mass.configurationId.length < 1) {
            console.log('hello');
            if (this.props.configList && this.props.configList.length > 0) {
                this.props.mass.configurationId = this.props.configList[0]._id;                
            }
        }
    }

    getSelect() {
        if (this.props.configList) {
            return (
                <Form.Control
                    as="select"
                    value={this.props.mass.configurationId}
                    onChange={e => this.props.setConfig(e.target.value)}
                >
                    {this.props.configList.map(config => {
                        return <option key={config._id} value={config._id}>{config.name}</option>
                    })}
                </Form.Control>
            );
        }
        else {
            return <div>Loading configurations <Spinner animation="border" /> </div>
        }
    }
    getHours() {
        if (this.props.mass.date) {
            return this.props.mass.date.getHours();
        }
        else {
            return '';
        }
    }
    getMinutes() {
        if (this.props.mass.date) {
            return this.props.mass.date.getMinutes();
        }
        else {
            return '';
        }
    }

    onSubmit = e => {
        e.preventDefault();
        let hours = parseInt(this.state.rawHours);
        let minutes = parseInt(this.state.rawMinutes);
        if (isNaN(hours) || isNaN(minutes)) {
            this.setState({hoursInvalid: isNaN(hours), minutesInvalid: isNaN(minutes)});
            return;
        }        
        let hv = hours >= 1 && hours <= 12;
        let mv = minutes >= 0 && minutes < 60;
        if (!hv || !mv) {
            this.setState({hoursInvalid: !hv, minutesInvalid: !mv});
            return;
        }
        this.setState({
            hoursInvalid: false,
            minutesInvalid: false,
            rawHours: this.state.rawHours.length < 2 ? '0' + this.state.rawHours : this.state.rawHours,
            rawMinutes: this.state.rawMinutes.length < 2 ? '0' + this.state.rawMinutes: this.state.rawMinutes
        });

        if (hours < 12 && this.state.ampm === 'pm') {
            hours += 12;
        }

        let date = this.props.mass.date;
        date.setHours(hours);
        date.setMinutes(minutes);        
        this.props.setDate(date);        
        this.props.saveMass(this.props.mass);        
    };

    doneClick = () => {
        this.setState({
            rawMinutes: '',
            rawHours: '',
            ampm: 'am',
            minutesInvalid: false,
            hoursInvalid: false
        });
    }

    render() {

        if (this.props.successful) {
            return(
                <div>
                    <Alert variant="success">
                        Mass created successfully.
                    </Alert>
                    <Button onClick={() => {this.props.setDone()}}>
                        Done
                    </Button>
                </div>
            );
        }

        return (
            <Form onSubmit={this.onSubmit}>
                <Form.Text>
                    <span style={{color: 'red'}}>{this.props.errorMessage}</span>
                </Form.Text>
                <Form.Group>
                    <Form.Label>
                        Mass Date
                    </Form.Label><br />
                    <DatePicker
                        value={this.props.mass.date}
                        onChange={d => this.props.setDate(d)}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Mass Time
                    </Form.Label>
                    <Form.Row>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                style={{ maxWidth: '100px' }}
                                value={this.state.rawHours}                                
                                onChange={e => this.setState({ rawHours: e.target.value })}
                                isInvalid={this.state.hoursInvalid}
                            />
                            <Form.Control.Feedback type="invalid">
                                Invalid hour
                            </Form.Control.Feedback>
                        </Form.Group>
                        <span style={{ fontSize: '30px', marginLeft: '5px', marginRight: '5px' }}>:</span>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                style={{ maxWidth: '100px' }}                                
                                value={this.state.rawMinutes}
                                onChange={e => this.setState({ rawMinutes: e.target.value })}
                                isInvalid={this.state.minutesInvalid}
                                
                            />
                            <Form.Control.Feedback type="invalid">
                                Invalid minute
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                               as="select" 
                               value={this.state.ampm}
                               onChange={e => this.setState({ampm: e.target.value})}
                               style={{marginLeft: '10px'}}
                            >
                                <option value="am">AM</option>
                                <option value="pm">PM</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Configuration
                    </Form.Label>
                    {this.getSelect()}
                </Form.Group>
                <Form.Group>
                    <Form.Check
                        label="Publish"
                        checked={this.props.mass.published}
                        onChange={() => this.props.setPublished()}
                    />
                </Form.Group>
                <AsyncButton type="submit" loading={this.props.posting}>
                    Save
                </AsyncButton>
            </Form>
        );
    }
}

const mapStateToProps = state => {
    return {
        mass: state.admin.massForm.mass,
        posting: state.admin.massForm.posting,
        errorMessage: state.admin.massForm.errorMessage,
        successful: state.admin.massForm.successful,
        configList: state.admin.config.configList,        
    };
};

export default connect(mapStateToProps, {
    saveMass, setDate, setConfig, setPublished, loadConfigList, setDone
})(MassForm);    