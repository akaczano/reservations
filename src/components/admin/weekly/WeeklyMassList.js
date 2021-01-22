import React from 'react';
import { connect } from 'react-redux';
import { Spinner, ListGroup, Button } from 'react-bootstrap';
import { loadList, selectItem, deleteItem } from '../../../actions/weeklyActions';
import { BsTrashFill, BsPencil } from 'react-icons/bs';
import { days } from '../../../util/util';

class WeeklyMassList extends React.Component {

    componentDidMount() {
        this.props.loadList();
    }


    getTitle(entry) {

        let displayMinute = entry.minute.toString();
        displayMinute = displayMinute.length > 1 ? displayMinute : '0' + displayMinute;

        let ampm = entry.hour >= 12 ? 'PM' : 'AM';
        let displayHour = entry.hour >= 12 ? entry.hour - 12 : entry.hour;

        return `${days[entry.day]} at ${displayHour}:${displayMinute} ${ampm}`;
    }

    getButtonContents(entry) {
        if (this.props.deleting === entry._id) {
            return <Spinner animation="border" />
        }
        else {
            return (
                <Button variant="info" onClick={() => this.props.deleteItem(entry)}>
                <BsTrashFill />
            </Button>
            );
        }
    }

    render() {
        if (this.props.listError) {
            return <h3>Failed to load weekly masses</h3>
        }
        else if (!this.props.list) {
            return (
                <div>
                    <h3>Loading items</h3>
                    <Spinner animation="border" />
                </div>
            );
        }
        return (
            <div style={{marginRight: '15px'}}>
                <h3>Weekly Masses</h3>
                <ListGroup>
                    {this.props.list.map(entry => {
                        return (
                            <ListGroup.Item key={entry._id}>
                                <h4>{this.getTitle(entry)}</h4>
                                <Button 
                                    variant="info" 
                                    style={{marginRight: '10px'}}
                                    onClick={() => this.props.selectItem(entry)}
                                >
                                    <BsPencil />
                                </Button>
                                {this.getButtonContents(entry)}
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
                <Button 
                    style={{marginTop: '15px'}}
                    onClick={() => {this.props.selectItem()}}
                >
                    Add Weekly Mass
                </Button>
            </div>
        );
    }
}

const mapStateToProps = state => {    
    return {
        list: state.admin.weeklyMassForm.list,
        listError: state.admin.weeklyMassForm.listError,
        deleting: state.admin.weeklyMassForm.deleting
    };
};

export default connect(mapStateToProps, { loadList, selectItem, deleteItem })(WeeklyMassList);
