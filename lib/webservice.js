var querystring = require("querystring");
var url = require('url');

module.exports = function(transport, options) {

    return {
        requestHandler: function(req, res) {
            var sendRequest, subject, query, parts, url, path, i, buf, msg, boomerangPath = (options ? options.path : false) || "/request";
            
            if(req.url.indexOf(boomerangPath) !== 0) {
                res.writeHead(500);
                res.end("Boomerang webservice, internal failure, URL does not match boomerang path");
                return;
            }
            
            // extract subject from URL
            parts = req.url.split("?");
            path = parts[0];
            subject = path.substring(boomerangPath.length);

            // if params present in req (parsed by earlier handlers, use it)
            if(req.params) {
                msg = req.params;
            } else {
                // else check if query params is present, and parse them
                query = parts[1];
                
                if(query) {
                    msg = querystring.parse(query);
                }
            }

            sendRequest = function(msg) {
                transport.sendRequest(subject, msg, function(reply) {
                                          res.writeHead(200, "OK", { 'content-type' :  'application/json' });
                                          res.write(JSON.stringify(reply));
                                          res.end();
                                      });
            };

            if(req.headers['content-type'] && req.headers['content-type'].indexOf("application/json") === 0) {
                if(req.entity_body) {
                    msg = JSON.parse(req.entity_body);
                } else {
                    buf = '';
                    req.setEncoding('utf8');
                    req.on('data', function(chunk){ buf += chunk; });
                    req.on('end', function() { sendRequest(JSON.parse(buf)); });
                    return;
                }
                
            }

            sendRequest(msg || {});
        }
    };
};
