var faye = require("faye");
var boomerang = require("../lib/boomerang.js");

var fayeServer = "http://localhost/faye";
var subject, msg;

var narg = 2;
var argv = process.argv;

while(narg < argv.length) {
    console.log("arg[" + narg + "] = "  + argv[narg] );

    if(argv[narg] == "-faye") {
        fayeServer = argv[++narg];
    }
    else {
        // default args

        if(!subject) {
            subject = argv[narg];
        } else if(!msg) {
            msg = argv[narg];
        }
    }
    narg++;
}

if(!subject) {
    console.log("usage: listen [-faye server] subject [msg]");
    process.exit(1);
}


var client = new faye.Client(fayeServer);
var request = new boomerang.Transport(client, function() {
                                 console.log("request is: ", request);

                                console.log("request/reply wrapper ready, listen to: " + subject);
                                
                                request.listen(subject, function(msg, inmsg) {
                                                   console.log("got message on " + subject + ": ", msg);
                                                   request.sendReply( msg, inmsg);
                                                   console.log("reply sent");
                                               });
                            });




