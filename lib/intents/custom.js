const helpers = require('./../helpers');
const logger = require('./../logger');
const constants = require('./../constants');
const recollectInterface = require('./../recollectInterface');


const CollectionScheduleIntent = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'CollectionScheduleIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope, serviceClientFactory, responseBuilder } = handlerInput;

        const consentToken = requestEnvelope.context.System.user.permissions
            && requestEnvelope.context.System.user.permissions.consentToken;
        if (!consentToken) {
            return responseBuilder
            .speak(constants.messages.NOTIFY_MISSING_PERMISSIONS)
            .withAskForPermissionsConsentCard(constants.PERMISSIONS)
            .getResponse();
        }
        
        try {
            let response;
            const { deviceId } = requestEnvelope.context.System.device;
            const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
            const address = await deviceAddressServiceClient.getFullAddress(deviceId);

            console.log(`Device ID: ${deviceId} | Address: ${JSON.stringify(address)}`);
            
            if (address.addressLine1 === null && address.stateOrRegion === null) {
                return responseBuilder.speak(constants.messages.NO_ADDRESS).getResponse();
            } else {
                response = await getCollectionScheduleResponse(10, address.addressLine1);
                return responseBuilder.speak(response).getResponse();
            }
        } catch (error) {
            if (error.name !== 'ServiceError') {
            const response = responseBuilder.speak(constants.messages.ERROR).getResponse();
            return response;
            }
            throw error;
        }
    },
};


const getCollectionScheduleResponse = async function(collectionHorizonDays, address) {
    let responseMessage;
    
    console.log(`Searching for collection events between ${helpers.momentToday()} thru ${helpers.momentAddDays(collectionHorizonDays)}`);
    console.log('============================');

    try {
        //const placeId = helpers.getPlaceId();
        const locationLookupResponse = await recollectInterface.locationLookup(address);

        let placeId;
        if(locationLookupResponse.length === 0) {
            console.log(`Did not find a matching collection location`);
            return `Sorry, I didn't find a collection location matching your address.`;
        } else if (locationLookupResponse.length === 1) {
            placeId = locationLookupResponse[0].place_id;
        } else {
            console.log(`Found more than 1 matching collection location`);
            return `Hmm, I found multiple collection locations matching your address, so I can't determine your collection schedule.`;
        }
                

        const collectionEvents = await recollectInterface.getCollectionEvents(placeId, helpers.momentToday(), helpers.momentAddDays(collectionHorizonDays));
        console.log(`${collectionEvents.length} total collection events upcoming`);
        console.log('============================');

        const filteredCollectionEvents = collectionEvents.filter( event => event.flags[0].event_type === "pickup" );
        console.log(`${filteredCollectionEvents.length} pickup events upcoming`);
        console.log('============================');

        let conciseCollectionEvents = [];
        filteredCollectionEvents.forEach( (event) => { 
            event.day = `${event.day}T06:00:00-06:00`;
            const existing = conciseCollectionEvents.filter( item => item.date === event.day );
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
            responseMessage = `There are no Austin Resource Recovery pickup events scheduled within the next week`;
            responseMessage = helpers.normalizeResponseText(responseMessage);
            console.log(responseMessage);
            return responseMessage;
        } else {
            let eventsText = '';
            let events = 1;
            conciseCollectionEvents.forEach( (event,index) => {
                if(events > 3) { return; }
                let prefix;
                switch(index) {
                    case 0: 
                        prefix = "Your next pickup";
                        break;
                    case 1:
                        prefix = "The following pickup";
                        break;
                    case 2:
                        prefix = "The last pickup";
                        break;
                    default:
                        prefix = "The next";
                }
                eventsText = eventsText + ` ${prefix} is on ${helpers.getRelativeCalendarDay(event.date)} and includes ${helpers.convertArrayToSpokenList(event.services)}.`;
                events++;
            });
            console.log(conciseCollectionEvents.length)
            responseMessage = `${conciseCollectionEvents.length === 1 ? '' : `There are ${conciseCollectionEvents.length < 4 ? `${conciseCollectionEvents.length}` : 'multiple'} pickup events coming up${conciseCollectionEvents.length <= 3 ? '.' : ', here are the next 3.'}`}${eventsText}`;
            responseMessage = helpers.normalizeResponseText(responseMessage);
            console.log(responseMessage);
            return responseMessage;
        }      
    } catch(err) {
        console.log(err);
        throw err;
    }
};

module.exports = { CollectionScheduleIntent }