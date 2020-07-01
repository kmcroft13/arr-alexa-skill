/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const { intents } = require('./lib');

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        intents.standard.LaunchRequest,
        intents.custom.CollectionScheduleIntent,
        intents.standard.SessionEndedRequest,
        intents.standard.HelpIntent,
        intents.standard.CancelIntent,
        intents.standard.StopIntent,
        intents.standard.UnhandledIntent,
    )
    .addErrorHandlers(intents.standard.GetAddressError)
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();