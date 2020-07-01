const moment = require('moment-timezone');

const momentToday = () => {
    return moment().tz("America/Chicago").format('YYYY-MM-DD');
}

const momentAddDays = (numDays) => {
    return moment().add(numDays, 'days').tz("America/Chicago").format('YYYY-MM-DD');
}

const normalizeResponseText = (responseText) => {
    responseText = responseText.replace('&', 'and');
    return responseText;
}

const getRelativeCalendarDay = (date) => {
    let momentConverted = moment(date).tz("America/Chicago").calendar();
    if (momentConverted.includes("/")) {
        momentConverted = moment(date).tz("America/Chicago").format("MMMM Do");
    }
    return momentConverted.split(" at")[0];
}

const convertArrayToSpokenList = (array) => {
    if(array.length === 1) {
        return array[0];
    } else if(array.length === 2) {
        return array[0] + " and " + array[1];
    } else {
        return array.slice(0, array.length - 1).join(', ') + ", and " + array.slice(-1);
    }
}

const getPlaceId = () => {
    return "C92B7B20-D7A4-11E7-B707-D8852540C4BA";
}

module.exports = {
    momentToday,
    momentAddDays,
    normalizeResponseText,
    getRelativeCalendarDay,
    convertArrayToSpokenList,
    getPlaceId
}