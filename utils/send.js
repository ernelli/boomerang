var faye = require("faye");
var boomerang = require("../lib/boomerang.js");

var fayeServer = "http://localhost/faye";
var subject, data;

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
        } else if(!data) {
            data = argv[narg];
        } 
    }
    narg++;
}

if(!subject || !data) {
    console.log("usage: send [-faye server] subject data");
    process.exit(1);
}


var client = new faye.Client(fayeServer);
var request = new boomerang(client, false, function() {
                                console.log("request/reply wrapper ready:");
                                console.log("inboxSubject: " + request.getInboxSubject());
                                
                                request.sendRequest(subject, { data: data }, function(msg) {
                                                        console.log("got reply: ", msg);
                                                        process.exit();
                                                    });
                                console.log("request send, wait for reply");
                            });


/*
console.log("send message to /marvin, text: " + process.argv[2]);
var pub = client.publish('/marvin', { text: process.argv[2] } );

pub.callback(function () {
  console.log("message sent!");
  console.log("clientId: " + client.getClientId());
//  process.exit();
});

*/