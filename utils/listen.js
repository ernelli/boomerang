var faye = require("faye");
var boomerang = require("./boomerang.js");

var client = new faye.Client('http://localhost:8010/faye');
var request = new boomerang(client, false, function() {
                                console.log("request/reply wrapper ready:");
                                console.log("inboxSubject: " + request.getInboxSubject());
                                
                                request.listen("/marvin/test", function(msg, inmsg) {
                                                   console.log("got message on /marvin/test: ", msg);
                                                   request.sendReply( msg, inmsg);
                                                   console.log("reply sent");
                                               });
                            });




