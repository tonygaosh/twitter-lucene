'use strict';

console.log('Loading settings..');

const SETTINGS = {
    LUCENE_SERVICES_URI : 'http://localhost:8080/api/', //rest api link
    SERVER_PORT : 3000                              //port for nodejs
};

console.log('App available on port : '+ SETTINGS.SERVER_PORT);
console.log('REST API : '+ SETTINGS.LUCENE_SERVICES_URI);

module.exports = SETTINGS;
