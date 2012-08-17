var faye = require("faye");
var boomerang = require("../lib/boomerang.js");

var fayeServer = "http://localhost/faye";
var subject, msg;

var narg = 2;
var argv = process.argv;
while(narg < argv.length) {
    //console.log("arg[" + narg + "] = "  + argv[narg] );

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

if(!subject || !msg) {
    console.log("usage: send [-faye server] subject data");
    process.exit(1);
}


var client = new faye.Client(fayeServer);
var request = new boomerang(client, false, function() {
                                console.log("request/reply wrapper ready:");
                                console.log("inboxSubject: " + request.getInboxSubject());

                                console.log("send request to: " + subject);
                                console.log("message: " + msg);
                                
                                request.sendRequest(subject, JSON.parse(msg), function(msg) {
                                                        console.log("got reply: ", msg);
                                                        process.exit();
                                                    });
                                console.log("request send, wait for reply");
                            });

