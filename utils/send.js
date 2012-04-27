var faye = require("faye");
var boomerang = require("./boomerang.js");

var client = new faye.Client('http://localhost:8010/faye');
var request = new boomerang(client, false, function() {
                                console.log("request/reply wrapper ready:");
                                console.log("inboxSubject: " + request.getInboxSubject());
                                
                                request.sendRequest('/marvin/test', { text: process.argv[2] || "<empty>" }, function(msg) {
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