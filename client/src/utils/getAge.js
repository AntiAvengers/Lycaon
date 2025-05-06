export const getMonths = (timestamp) => {
    const d1 = new Date(timestamp);
    const d2 = new Date();
  
    let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());

    // Adjust if the end date's day is earlier than the start date's day
    if (d2.getDate() < d1.getDate()) {
        months--;
    }

    return months;
}

export const getAge = (timestamp) => {
    if(isNaN(timestamp)) throw new Error("Timestamp must be a number");
    const age = Date.now() - timestamp;

    const days = Math.floor(age / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(age / (1000 * 60 * 60 * 24 * 7));
    const months = getMonths(timestamp);
    const years = Math.floor(age / (1000 * 60 * 60 * 24 * 365));

    let output = '';
    if(years >= 1) {
        output = `${years} year${years == 1 ? '' : 's'} old`;
    } else if(months >= 1) {
        output = `${months} month${months == 1 ? '' : 's'} old`;
    } else if(weeks >= 1) {
        output = `${weeks} week${weeks == 1 ? '' : 's'} old`;
    } else if(days >= 1) {
        output = `${days} day${days == 1 ? '' : 's'} old`;
    } else {
        output = 'Less than a day old';
    }
    return output;
}