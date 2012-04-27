function Boomerang(client, options, callback) {
    var id, replySubject;
    var txid = 0;
    var pending = {
    };

    function _init() {
        id = client.getClientId();
        replySubject = "/inbox/" + id;
        console.log("init done, replySubject: " + replySubject);

        client.subscribe(replySubject, function(inmsg) {
                             console.log("request/reply, got msg: ", inmsg);
                             var cb = pending[inmsg.txid];
                             if(cb) {
                                 delete pending[inmsg.txid];
                                 
                                 cb(inmsg.msg);
                             }
                             
                         });
        
        if(callback) {
            callback();
        }
    }
    
    if(client.getState() !== client.CONNECTED) {
        console.log("connecting client");
        client.connect(_init);        
    } else {
        _init();
    }
  
    this.sendRequest = function(subject, msg, callback) {
        var outmsg = {
            replySubject: replySubject,
            txid: txid,
            msg: msg
        };

        pending[txid] = callback;
        console.log("sendRequest: ", outmsg);
        client.publish(subject, outmsg);
        txid++;
    };

    this.listen = function(subject, callback) {
        client.subscribe(subject, function(inmsg) {
                             console.log("listener got message on " + subject + ": ", inmsg);
                             callback(inmsg.msg, inmsg);
                         });
    };

    this.sendReply = function(msg, inmsg) {
        console.log("send reply: ", msg, " using inmsg: ", inmsg);
        console.log("send reply to: " + inmsg.replySubject);
        client.publish(inmsg.replySubject, {
                           txid: inmsg.txid,
                           msg: msg
                       });
    };

    this.getInboxSubject = function() {
        return replySubject;
    };
}

module.exports = Boomerang;
