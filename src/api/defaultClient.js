import axios from 'axios'

export default axios.create({
    baseURL: 'http://www.reserve-stthomas.com/api'
    //baseURL: 'http://localhost:5000/api'
});