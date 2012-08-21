var boomerang = require('boomerang');
var faye = require('faye');
var http = require('http');

var fayeServer = "http://localhost/faye";
var port = 9989;

var narg = 2;
var argv = process.argv;

while(narg < argv.length) {
    console.log("arg[" + narg + "] = "  + argv[narg] );

    if(argv[narg] == "-faye") {
        fayeServer = argv[++narg];
    }
    else if(argv[narg] == "-port") {
        port = 1*argv[++narg];
    } else {
        console.log("usage: listen [-faye server] [-port port]");
        process.exit(1);
    }
    narg++;
}




var client = new faye.Client(fayeServer);
var transport = new boomerang.Transport(client, function() {
                                            var webservice = boomerang.webservice(transport, {});
                                            http.createServer(webservice.requestHandler).listen(port);
                                            console.log("request/reply webservice started, listening on: http://localhost:" + port + "/request");
                                        });

