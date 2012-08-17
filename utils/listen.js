var faye = require("faye");
var boomerang = require("../lib/boomerang.js");

var fayeServer = "http://localhost/faye";
var subject;

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
        } 
    }
    narg++;
}

if(!subject) {
    console.log("usage: listen [-faye server] subject");
    process.exit(1);
}


var client = new faye.Client(fayeServer);
var request = new boomerang(client, false, function() {
                                console.log("request/reply wrapper ready:");
                                console.log("inboxSubject: " + request.getInboxSubject());
                                
                                request.listen(subject, function(msg, inmsg) {
                                                   console.log("got message on /marvin/test: ", msg);
                                                   request.sendReply( msg, inmsg);
                                                   console.log("reply sent");
                                               });
                            });




