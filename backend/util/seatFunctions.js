const {rowSize, rows} = require('../config/keys');

const getSeatList = (side, list) => {

    let str = '';
    for (let seat of list) {
        seat -= side * rowSize * rows;
        const rowLetter = String.fromCharCode(97 + (seat / rowSize));
        let number = Math.abs(-12 * side + 12 - (seat % 13));
        if (str.length > 0) {
            str += ', '
        }
        str += rowLetter + number;
    }    
    return str.length < 1 ? 'None' : str;
};

module.exports = { getSeatList }