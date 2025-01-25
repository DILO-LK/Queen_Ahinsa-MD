const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "OVFlRQZC#cXxtxmh-DyZi4jhPYvmyDt1IxNXwyqXApsoMxcvAh9A",
MONGODB: process.env.MONGODB || "mongodb://mongo:ppCQkKmZZgRQukSxAvFcDBVvIqcFVlWW@:",
};
