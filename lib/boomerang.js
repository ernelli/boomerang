var webservice = require("./webservice");
var utils = require("./utils");

function createTransport(client, options, callback) {
    var transport;
    var id, replySubject;
    var txid = 0;
    var pending = {
    };
    
    if(typeof options === "function") {
        callback = options;
    }

    function _init() {
        id = client.getClientId();
        replySubject = "/inbox/" + id;
        console.log("init done, replySubject: " + replySubject);

        client.subscribe(replySubject, function(inmsg) {
                             var cb = pending[inmsg.txid];
                             if(cb) {
                                 delete pending[inmsg.txid];
                                 cb(inmsg.msg);
                             }
                         });
        
        if(callback) {
            callback(transport);
        }
    }

    transport = {
        sendRequest: function(subject, msg, callback) {
            var outmsg = {
                replySubject: replySubject,
                txid: txid,
                msg: msg
            };

            pending[txid] = callback;
            client.publish(subject, outmsg);
            txid++;
        },

        listen:  function(subject, callback) {
            client.subscribe(subject, function(inmsg) {
                                 callback(inmsg.msg, inmsg);
                             });
        },

        sendReply: function(msg, inmsg) {
            client.publish(inmsg.replySubject, {
                               txid: inmsg.txid,
                               msg: msg
                           });
        },

        getInboxSubject: function() {
            return replySubject;
        },

        getClient: function() {
            return client;
        }
    };

    if(client.getState() !== client.CONNECTED) {
        client.connect(_init);        
    } else {
        _init();
    }

    return transport;
}

// export boomerang as the transport factory
module.exports = createTransport;

// provide the factory as a member
module.exports.transport = createTransport;

// provide a constructor function
module.exports.Transport = function() {
    return utils.merge(this, createTransport.apply(this, arguments));
};

// expose the webservice factory
module.exports.webservice = webservice;

