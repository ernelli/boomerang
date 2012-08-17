var querystring = require("querystring");
var url = require('url');

module.exports = function(transport, options) {

    return {
        requestHandler: function(req, res) {
            var sendRequest, subject, query, parts, params, url, path, i, buf, msg, boomerangPath = options.path || "/request";
            
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
                params = req.params;
            } else {
                // else check if query params is present, and parse them
                query = parts[1];
                
                if(query) {
                    params = querystring.parse(query);
                }
            }

            sendRequest = function() {
                transport.sendRequest(subject, msg, function(reply) {
                                          response.writeHead(200, "OK", { 'content-type' :  'application/json' });
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
                    req.on('end', sendRequest);
                    return;
                }
                
            }
            else if(params) {
                msg = {
                };
                for(i in params) {
                    msg[i] = params[i];
                }
            }

            if(!msg) {
                msg = {};
            }

            sendRequest();
            
        }
    };
};
