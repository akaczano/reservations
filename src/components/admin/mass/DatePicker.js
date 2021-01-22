import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';

function Wrapper(props) {
    return (
        <DatePicker
            className='form-control' 
            selected={props.value} 
            onChange={props.onChange}            
        />
    );
}

export default Wrapper;