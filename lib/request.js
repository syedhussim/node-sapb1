'use strict';

const https = require('https');
const { parse } = require('url');
const Response = require('./response.js');

module.exports = {

    /** 
     * Executes an HTTP(s) request.
     * @param {string} method - Request method.
     * @param {string} url - Request URL.
     * @param {object} params - Request post parameters.
     * @param {function(object):void} success - The callback that handles a successful connection.
     * @param {function(object):void} error - The callback that handles connection errors.
     * @param {object} cookies - Request cookies.
     * @param {object} ca - An authority certificate.
     */
    execute(method, url, params, success = () => {}, error = () => {}, cookies = {}, cacert){

        var postData = JSON.stringify(params);

        var urlSegments = parse(url);

        var options = {
            hostname : urlSegments.hostname,
            port : urlSegments.port,
            path : url,
            method : method,
            headers : { 'User-Agent' : 'SAPb1Client', 'Content-Type': 'application/json; charset=UTF-8', 'Content-Length': Buffer.byteLength(postData, 'utf8') },
            ca : cacert
        }; console.log(options);

        if(Object.keys(cookies).length > 0){
            options.headers['Cookie'] = 'B1SESSION=' + cookies['B1SESSION'] + ';' + 'ROUTEID=' + cookies['ROUTEID']; 
        }

        var http = require('http');

        if(urlSegments.protocol === 'https:'){
            http = require('https');
            options['path'] = urlSegments.protocol + '//' + urlSegments.hostname + ':443' + urlSegments.path;
        }

        var req = http.request(options, (response) => {
            response.setEncoding('utf8');

            var data = "";
        
            response.on("data", (chunck) => { 
                data += chunck;
            }).on("end", () => {
                success(new Response(response.statusCode, response.headers, data));
            });
        });
        
        req.on('error', err => {
            error(err);
        });
        req.write(postData);
        req.end();
    }
}