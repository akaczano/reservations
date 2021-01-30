import React from 'react';
import { Tab, Row, Col, Nav } from 'react-bootstrap';
import { RiDashboard3Fill } from 'react-icons/ri';
import { IoCreateSharp } from 'react-icons/io5';
import { IoSettingsSharp } from 'react-icons/io5';
import { IoCalendarSharp } from 'react-icons/io5';
import { ImUsers } from 'react-icons/im';
import "./Sidebar.css";

class Sidebar extends React.Component {
    render() {
        const labels = this.props.labels;
        const components = this.props.components;
        return (
            <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={labels[0]}                
            >
                <Row style={{ marginTop: '10px', marginLeft: '0px' }}>
                    <Col sm={3} style={{marginLeft: '-15px'}}>
                        <Nav variant="pills">
                            <Nav.Item>
                                <Nav.Link eventKey="Dashboard">
                                    <RiDashboard3Fill style={{ fontSize: '25px', marginRight: '10px' }} />
                                    Dashboard
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Configurations">
                                    <IoSettingsSharp style={{ fontSize: '25px', marginRight: '10px' }} />
                                    Configurations
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Create mass">
                                    <IoCreateSharp style={{ fontSize: '25px', marginRight: '10px' }} />
                                    Create mass
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Weekly masses">
                                    <IoCalendarSharp style={{ fontSize: '25px', marginRight: '10px' }} />
                                    Weekly masses
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Accounts">
                                    <ImUsers style={{ fontSize: '25px', marginRight: '10px' }} />
                                    Accounts
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            {components.map((component, i) => {
                                return (
                                    <Tab.Pane eventKey={labels[i]} key={labels[i]}>
                                        {component()}
                                    </Tab.Pane>
                                );
                            })}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container >
        );
    }
}

export default Sidebar;