import React from 'react';
import { connect } from 'react-redux';
import { loadConfigList, setConfig, deleteConfig } from '../../../actions/configDataActions';
import { Spinner, Row, ListGroup, Button } from 'react-bootstrap';
import { BsTrashFill, BsPencil } from 'react-icons/bs';


class ConfigList extends React.Component {

    componentDidMount() {
        this.props.loadConfigList();
    }
    getButtonContent(id) {
        if (this.props.deleting === id) {
            return <Spinner animation="border" />
        }
        else {
            return <BsTrashFill />
        }
    }
    render() {
        if (this.props.configList) {
            return (

                <div style={{marginRight: '20px'}}>
                    <h3>Configurations</h3>
                    <ListGroup>
                        {this.props.configList.map(config => {
                            return (
                                <ListGroup.Item key={config._id}>
                                    <h4>{config.name}</h4>
                                    <Button 
                                        variant="info" 
                                        onClick={() => this.props.setConfig(config)}
                                    >
                                        <BsPencil />
                                    </Button>
                                    <Button 
                                        variant="info" 
                                        style={{marginLeft: '10px'}}
                                        onClick={() => this.props.deleteConfig(config)}
                                    >
                                        {this.getButtonContent(config._id)}
                                    </Button>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                    <Button 
                        variant="primary" 
                        style={{marginTop: '20px', marginBott: '10px'}}
                        onClick={() => this.props.setConfig(null)}
                    >
                        Add Configuration
                    </Button>
                </div>
            );
        }
        else {
            return (
                <Row>
                    <h3 style={{ marginRight: '10px', marginLeft: '15px' }}>Loading configurations</h3>
                    <Spinner animation="border" />
                </Row>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        configList: state.admin.config.configList,
        deleting: state.admin.config.deleting
    }
}

export default connect(mapStateToProps, { loadConfigList, setConfig, deleteConfig })(ConfigList);
