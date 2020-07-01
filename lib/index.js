module.exports = {
    intents: {
        custom: require('./intents/custom.js'),
        standard: require('./intents/standard.js')
    },
    helpers: require('./helpers'),
    constants: require('./constants'),
}