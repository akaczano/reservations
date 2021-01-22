export const getMassTime = mass => {
    let minutes = ("0" + mass.date.getMinutes()).slice(-2);
    let hours = mass.date.getHours();    
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours > 12 ? hours - 12 : hours;
    return `${hours}:${minutes} ${ampm}`
}


export const getMassTitle = mass => {
    return `${getMassTime(mass)} mass on ${mass.date.toLocaleDateString()}`;
}