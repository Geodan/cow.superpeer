configfile = process.argv[2];
//Enable full path
config = require(configfile);

_ = require('./node_modules/underscore/underscore.js')._
Promise = require('./node_modules/es6-promise').Promise;
Events = require('./events.js');


WebSocket = require('websocket').client;
pg = require('pg').native;
//Set global dbUrl
GLOBAL.dbUrl = config.dbUrl;
//Set env var to accept all certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
Cow = require('./bower_components/cow/dist/cow.node.js');

const winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: false,
    })
  ]
});
logger.level = 'debug';
logger.info('Starting log');

core = new Cow.core({
    herdname: config.herdname,
    maxage: 1000 * 60 * 60 * 24 * 365 //one year 
});
if (!core.socketservers('default')){
   core.socketservers({
        _id: 'default', 
        data: {
        	protocol: config.protocol,
        	ip: config.ip, 
        	port: config.port,
        	dir: config.dir}
      });
};
core.socketserver('default');
core.connect();
core.userStore().loaded.then(function(){
	logger.info(core.users().length, ' users loaded');
});

core.projectStore().loaded.then(function(){
	logger.info(core.projects().length, ' projects loaded');
	core.peer().data('superpeer', true).sync();
	logger.info('My peerid: ', core.peerid());
});
