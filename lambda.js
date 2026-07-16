const serverlessExpress = require('@codegenie/serverless-express');
const {app} = require('./index.js');

exports.handler = serverlessExpress(app);