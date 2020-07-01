const PERMISSIONS = ['read::alexa:device:all:address'];

const messages = {
    WELCOME: 'Welcome to the Austin Resource Recovery collection schedule skill! You can ask me about your upcoming pickups, including when the next pickup is and what\'s included.',
    WHAT_DO_YOU_WANT: 'What do you want to ask?',
    NOTIFY_MISSING_PERMISSIONS: 'I need access to your address to determine your pickup schedule. Please enable Location permissions in the Alexa app.',
    NO_ADDRESS: 'It looks like you don\'t have an address set. You can set your address from the companion app.',
    ERROR: 'Hmm, looks like something went wrong.',
    LOCATION_FAILURE: 'I ran into a problem getting the address of your device. Please try again.',
    GOODBYE: 'Bye! Thanks for using the Austin Resource Recovery collection schedule skill!',
    UNHANDLED: 'Hmm, this skill doesn\'t support that. Please ask something else.',
    HELP: 'You can use this skill by asking something like: when\'s my next pickup?',
    STOP: 'Bye! Thanks for using the Austin Resource Recovery collection schedule skill',
};

module.exports = { messages, PERMISSIONS }