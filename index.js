const axios = require('axios');
const moment = require('moment-timezone');

const placeId = "C92B7B20-D7A4-11E7-B707-D8852540C4BA";

const today = moment().tz("America/Chicago").format('YYYY-MM-DD');
const endEventSearchDate = moment().add(7, 'days').tz("America/Chicago").format('YYYY-MM-DD');

console.log(`Searching for collection events between ${today} thru ${endEventSearchDate}`);
console.log('============================');

function normalizeResponseText(responseText) {
    responseText = responseText.replace('&', 'and');

    return responseText;
}

function getRelativeCalendarDay(date) {
    let momentConverted = moment(date).tz("America/Chicago").calendar();
    if (momentConverted.includes("/")) {
        momentConverted = moment(date).tz("America/Chicago").format("MMMM Do");
    }
    return momentConverted.split(" at")[0];
}

function convertArrayToSpokenList(array) {
    if(array.length === 1) {
        return array[0];
    } else if(array.length === 2) {
        return array[0] + " and " + array[1];
    } else {
        return array.slice(0, array.length - 1).join(', ') + ", and " + array.slice(-1);
    }
}

async function main() {
    try {
        const collectionResponse = await axios.get(`https://api.recollect.net/api/places/${placeId}/services/323/events?nomerge=1&hide=reminder_only&after=${today}&before=${endEventSearchDate}&locale=en-US`);
        const collectionEvents = collectionResponse.data.events;
        console.log(`${collectionEvents.length} total collection events upcoming`);
        console.log('============================');

        const filteredCollectionEvents = collectionEvents.filter( event => event.flags[0].event_type === "pickup" );
        console.log(`${filteredCollectionEvents.length} pickup events upcoming`);
        console.log('============================');

        let conciseCollectionEvents = [];
        filteredCollectionEvents.forEach( (event) => { 
            event.day = `${event.day}T06:00:00-06:00`;
            const existing = conciseCollectionEvents.filter( item => item.date == event.day );
            let servicesArray = [];
            event.flags.forEach( service => servicesArray.push(service.subject) );

            if(existing.length) {
                const existingIndex = conciseCollectionEvents.indexOf(existing[0]);
                conciseCollectionEvents[existingIndex].services = conciseCollectionEvents[existingIndex].services.concat(event.flags[0].subject);
            } else {
                const conciseEvent = {date: event.day, services: servicesArray}
                conciseCollectionEvents.push(conciseEvent);
            }
        });

        console.log(`${conciseCollectionEvents.length} pickup days upcoming`);
        console.log('============================');
        console.log(JSON.stringify(conciseCollectionEvents));
        console.log('============================');
        
        if(conciseCollectionEvents.length === 0) {
            responseMessage = `There are no Austin Refuse pickup events scheduled within the next week`;
            responseMessage = normalizeResponseText(responseMessage);
            console.log(responseMessage);
            //return responseBuilder.speak(responseMessage).getResponse();
        } else if (conciseCollectionEvents.length === 1) {
            responseMessage = `The next Austin Refuse pickup event is ${getRelativeCalendarDay(conciseCollectionEvents[0].date)} and includes ${convertArrayToSpokenList(conciseCollectionEvents[0].services)}`;
            responseMessage = normalizeResponseText(responseMessage);
            console.log(responseMessage);
            //return responseBuilder.speak(responseMessage).getResponse();
        } else {
            let eventsText = '';
            conciseCollectionEvents.forEach( (event,index) => {
                let prefix;
                if(index === 0) {
                    prefix = "The first"
                } else if(index === 1) {
                    prefix = "The second"
                } else if(index === 2) {
                    prefix = "The third"
                } else if(index === 3) {
                    prefix = "The fourth"
                } else if(index === 4) {
                    prefix = "The fifth"
                }
                eventsText = eventsText + ` ${prefix} is on ${getRelativeCalendarDay(event.date)} and includes ${convertArrayToSpokenList(event.services)}.`;
            });
            responseMessage = `There are ${conciseCollectionEvents.length} Austin Refuse pickup events coming up. ${eventsText}`;
            responseMessage = normalizeResponseText(responseMessage);
            console.log(responseMessage);
            //return responseBuilder.speak(responseMessage).getResponse();
        }
        
    } catch(err) {
        console.log(err);
        throw err;
    }

};

main();