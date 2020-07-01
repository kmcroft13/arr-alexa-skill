const logger = require('./../logger');
const constants = require('./../constants');


const LaunchRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.speak(constants.messages.WELCOME)
        .reprompt(constants.messages.WHAT_DO_YOU_WANT)
        .getResponse();
    },
};


const SessionEndedRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    },
};


const UnhandledIntent = {
    canHandle() {
        return true;
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
        .speak(constants.messages.UNHANDLED)
        .reprompt(constants.messages.UNHANDLED)
        .getResponse();
    },
};


const HelpIntent = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
        .speak(constants.messages.HELP)
        .reprompt(constants.messages.HELP)
        .getResponse();
    },
};


const CancelIntent = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
        .speak(constants.messages.GOODBYE)
        .getResponse();
    },
};


const StopIntent = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
        .speak(constants.messages.STOP)
        .getResponse();
    },
};


const GetAddressError = {
    canHandle(handlerInput, error) {
        return error.name === 'ServiceError';
    },
    handle(handlerInput, error) {
        if (error.statusCode === 403) {
            return handlerInput.responseBuilder
                .speak(constants.messages.NOTIFY_MISSING_PERMISSIONS)
                .withAskForPermissionsConsentCard(constants.PERMISSIONS)
                .getResponse();
        }
        return handlerInput.responseBuilder
        .speak(constants.messages.LOCATION_FAILURE)
        .reprompt(constants.messages.LOCATION_FAILURE)
        .getResponse();
        },
};

module.exports = {
    LaunchRequest,
    SessionEndedRequest,
    UnhandledIntent,
    HelpIntent,
    CancelIntent,
    StopIntent,
    GetAddressError
}