# cow.superpeer
Superpeer instance that connects cow to a postgres server.


#Dependencies:
run bower install

install node modules:
	underscore
	es6-promise

#Change config:
```
{
        "dbUrl": "tcp://<user>:<pass>@<ip address>/<dbase>",
        "herdname":"<herdname>",
        "protocol": "<ws or wss>",
        "ip": "<socket ip>",
        "port": <socket port nr>,
        "dir": "<socket dir>"
}
```

#Running:
```
nodejs superpeer.js './config.json'
```
