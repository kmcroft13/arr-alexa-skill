const axios = require('axios');

const getCollectionEvents = async function(placeId, afterDate, beforeDate) {
    try {
        const collectionResponse = await axios.get(`https://api.recollect.net/api/places/${placeId}/services/323/events?nomerge=1&hide=reminder_only&after=${afterDate}&before=${beforeDate}&locale=en-US`);
        const collectionEvents = collectionResponse.data.events;
        return collectionEvents;
    } catch(err) {
        console.log(err);
        throw err;
    }
}

const locationLookup = async function(address) {
    try{
        const locationLookupResponse = (await axios.get(`https://api.recollect.net/api/areas/Austin/services/323/address-suggest?q=${address}`)).data;
        console.log(`Find location API response:\n${JSON.stringify(locationLookupResponse)}`); // Print the response status code if a response was received
        return locationLookupResponse;
    } catch(err) {
        console.log(err);
        throw err;
    }                  
}

module.exports = { getCollectionEvents, locationLookup }