import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

class AsyncButton extends React.Component {
    render() {
        if (this.props.loading) {
            return (
                <Button
                    variant={this.props.variant}
                    type={this.props.type}
                    onClick={this.props.onClick}
                    style={this.props.style}
                    disabled
                >
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    {this.props.children}
                </Button>
            );
        }
        else {
            return (
                <Button
                    variant={this.props.variant}
                    onClick={this.props.onClick}
                    type={this.props.type}
                    style={this.props.style}
                >
                    {this.props.children}
                </Button>
            )
        }
    }
}

export default AsyncButton;