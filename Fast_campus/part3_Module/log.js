const log = {
    info: function(info) {
        console.log('Info ' + info);
    },
    warning: function(warning) {
        console.long('Warning ' + warning);
    },
    error: function(error) {
        console.log('Error ' + error);
    }
}

module.exports = log;