import React from 'react';
import { Form, Row, Container, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { loginUser } from '../actions/authActions';
import AsyncButton from './helper/AsyncButton';

class Login extends React.Component {
    state = { username: '', password: '' }

    usernameChanged(text) {
        this.setState({ username: text });
    }

    passwordChanged(text) {
        this.setState({ password: text });
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.loginUser({
            username: this.state.username,
            password: this.state.password
        });
    }

    render() {        
        if (this.props.auth.user !== null) {
            return <Redirect to="/" />
        }
        return (
            <Container>
                <Row style={{ justifyContent: 'center' }}>
                    <Col md={6}>
                        <h3>Admin Login</h3>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Text>
                                <span style={{ color: 'red' }}>
                                    {this.props.auth.errorMessage}
                                </span>
                            </Form.Text>
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    onChange={e => this.usernameChanged(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    onChange={e => this.passwordChanged(e.target.value)}
                                />
                            </Form.Group>
                            <AsyncButton type="submit" loading={this.props.auth.loading}>
                                Login
                            </AsyncButton>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};


export default connect(mapStateToProps, { loginUser })(Login);