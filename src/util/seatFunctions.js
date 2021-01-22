import { Text } from '@react-pdf/renderer';

export const NUM_ROWS = 25;
export const SEATS_PER_ROW = 13;

export const getInitialMap = () => {
    let map = [];
    for (let i = 0; i < NUM_ROWS * SEATS_PER_ROW * 2; i++) {
        const side = i < NUM_ROWS * SEATS_PER_ROW ? 0 : 1;
        let number = Math.abs(-12 * side + 12 - (i % 13));
        if (number === 0) {
            map.push('row-label');
        }
        else {
            map.push('available');
        }
    }
    return map;
}

export const getFullSeatList = list => {
    if (!list) return null;
    const marySeats = list.filter(s => s < NUM_ROWS * SEATS_PER_ROW);
    const josephSeats = list.filter(s => s >= NUM_ROWS * SEATS_PER_ROW);
    return (
        <div>
            {getSeatList(0, marySeats)}
            {getSeatList(1, josephSeats)}
        </div>
    );
};

export const getFullPdfList = list => {
    if (!list) return null;
    const marySeats = list.filter(s => s < NUM_ROWS * SEATS_PER_ROW);
    const josephSeats = list.filter(s => s >= NUM_ROWS * SEATS_PER_ROW);
    return (
        <>
            {getPdfSeatList(0, marySeats)}
            {getPdfSeatList(1, josephSeats)}
        </>
    );
};

export const getPdfSeatList = (side, list) => {
    if (list.length < 1) return null;
    const label = side === 0 ? "Mary's Side" : "Joseph's Side";
    let rows = {};
    
    if (side === 0) {
        list = list.sort((a, b) => b - a);
    }
    else {
        list = list.sort((a,b) => a - b);
    }
    for (let i of list) {
        i -= side * SEATS_PER_ROW * NUM_ROWS;
        const rowLetter = String.fromCharCode(97 + (i / SEATS_PER_ROW));
        let number = Math.abs(-12 * side + 12 - (i % 13));
        if (!rows[rowLetter]) {
            rows[rowLetter] = '' + number;
        }
        else {
            rows[rowLetter] += ', ' + number;
        }
        
    }
    return (
        <>
            <Text style={{fontSize: '4mm', fontWeight: 'heavy', marginBottom: '1mm', marginLeft: '2mm', marginTop: '2mm'}}>
                {label}
            </Text>
            {Object.keys(rows).sort().map(letter =>
                <Text key={letter} style={{fontSize: '4mm', marginBottom: '1mm', marginLeft: '4mm'}}>
                    Row {letter}: {rows[letter]}
                </Text>
            )}
        </>
    );
}

export const getSeatList = (side, list) => {
    if (list.length < 1) return null;
    const label = side === 0 ? "Mary's Side" : "Joseph's Side";
    let rows = {};
    list = list.sort();
    if (side === 0) {
        list = list.reverse();
    }
    for (let i of list) {
        i -= side * SEATS_PER_ROW * NUM_ROWS;
        const rowLetter = String.fromCharCode(97 + (i / SEATS_PER_ROW));
        let number = Math.abs(-12 * side + 12 - (i % 13));
        if (!rows[rowLetter]) {
            rows[rowLetter] = '' + number;
        }
        else {
            rows[rowLetter] += ', ' + number;
        }
    }
    return (
        <>
            <strong>{label}</strong><br />
            {Object.keys(rows).sort().map(letter =>
                <span key={letter}>Row {letter}: {rows[letter]}<br /></span>
            )}
        </>
    );
}

export const getMapForMass = mass => {
    let seats = getInitialMap();

    for (const reservation of mass.reservations) {
        for (const s of reservation.seats) {
            seats[s] = "reserved";
            for (let i = s; i <= s + 3; i++) {
                if (Math.floor(i / SEATS_PER_ROW) !== Math.floor(s / SEATS_PER_ROW)) {
                    break;
                }
                if (seats[i] === 'available') {
                    seats[i] = 'unavailable';
                }
            }
            for (let i = s; i >= s - 3; i--) {
                if (Math.floor(i / SEATS_PER_ROW) !== Math.floor(s / SEATS_PER_ROW)) {
                    break;
                }
                if (seats[i] === 'available') {
                    seats[i] = 'unavailable';
                }
            }
        }
    }
    for (const seat of mass.configuration.seats) {
        seats[seat] = 'unavailable';
    }
    for (const row of mass.configuration.rows) {
        for (let i = 0; i < seats.length; i++) {
            if (Math.floor(i / SEATS_PER_ROW) === row) {
                seats[i] = 'unavailable';
            }
        }
    }
    return seats;
}