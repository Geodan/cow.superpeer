configfile = process.argv[2];
//Enable full path
config = require(configfile);

_ = require('./node_modules/underscore/underscore.js')._
Promise = require('./node_modules/es6-promise').Promise;
Events = require('./events.js');
lzwCompress = require('lzwcompress');

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
core.websocket().on('notice',function(m){
	logger.info(m);
});
core.websocket().on('error',function(m){
	logger.info(m);
});
function start(){
  core.userStore().loaded.then(function(){
	logger.info(core.users().length, ' users loaded');
  });
  core.userStore().localdb._openpromise.then(d=>{
  		logger.info('userstore db opened');
  })
  .catch(e=>{
  		logger.error('userstore db error' + e);
  });

		core.projectStore().loaded.then(function(){
			logger.info(core.projects().length, ' projects loaded');
			core.peer().data('superpeer', true).sync();
			logger.info('My peerid: ', core.peerid());
		});	
	
	
  core.connect()
	.then(connection=>{
		logger.info('connected');
		connection.on('close',d=>{
			//setTimeout(start,2000);
			throw('Connection closed');
		});
		core.messenger().on('notice',d=>{
			logger.info(d);
		});
		
	})
	.catch(d=>logger.warn('problem: '+d));
};

start();
