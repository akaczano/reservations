import React from 'react';

const Info = () => {
    return (
        <div style={{ 
            margin: '10px', 
            fontSize: '12px'
        }}>
            <h3>Tickets for Mass</h3>
            <h5>Instruction for making an online reservation</h5>
            <ul>
                <li>Pull up your desired mass time for the upcoming weekend.</li>
                <li>
                    Find an area that can accommodate your group size while still maintaining social
                    distance. Each “seat” on the chart is the equivalent of a space of 2 feet, and
                    the system will not allow you to reserve seats that violate the social distance rules
                    that have been established.
                </li>
                <li>
                    Green seats are available. Orange seats are already reserved. Gray seats are
                    unavailable to ensure social distancing. You’ll notice entire pews are
                    greyed out, and this is because we are providing sections where seating 
                    will be in every other pew and other sections where seating is in
                    every third pew. This will allow us to maximize attendance while also 
                    taking into consideration everyone’s comfort level in terms of proximity
                    of sitting.
                </li>
                <li>
                    Be aware—the system will grey out 3 seats in between families to ensure 
                    6ft social distancing (each of those seats equals 2 feet in the pew for a
                    total of 6 feet of social distance).
                </li>
                <li>
                    Please help us to maximize seating in the church. Look for seating in
                    areas that fit your group size perfectly if all possible rather than 
                    leaving empty seats in a row that no one can use. <strong>Please choose your seats
                    starting next to an aisle or a grey area whenever possible.</strong>
                </li>
                <li>
                    Once you have chosen your seats, click “Next” at the bottom
                </li>
                <li>
                    On the next page, type in your name in the space provided. You can also enter
                    your email if you wish to receive a confirmation message, but this is not
                    required.
                </li>
                <li>
                    Click “confirm”
                </li>
                <li>
                    The next screen is your confirmation . Please either print the confirmation or take
                    a screen shot of it. You will need this to show to the ushers.
                </li>
            </ul>
            <p>
                Be sure to call the office if you have any issues or would like us to make the
                reservation for you. If you experience difficulty on your phone, try making the
                reservation from a desktop. Ticketing will open each week on Monday morning for
                that following weekend.
            </p>
            <p>
                 If there are no tickets for Mass available, we will be live streaming 
                 10:30am Mass. Feel free to watch the live stream from your vehicle.
                 Father will come out after Mass to distribute Communion. We ask that you put
                 on a mask before you exit your car, sanitize your hands before receiving
                 and maintain social distance.
            </p>
        </div>
    )

};

export default Info;
