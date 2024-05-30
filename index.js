const request = require("./lib/request.js");
const Resource = require("./lib/resource.js");

class SAPb1{

    /** 
     * Initializes a new instance of SAPb1.
     * @param {object} config - Configuration options. 
     * @param {string} config.host
     * @param {number} config.port
     * @param {number} config.version
     * @param {object} config.ca
     * @param {object} b1Session - SAP B1 Session data.
     * @param {string} b1Session.B1SESSION
     * @param {string} b1Session.ROUTEID
     */
    constructor(config = {}, b1Session = {}){
        this._config = config;
        this._b1Session = b1Session;
    }

    /** 
     * Creates a new SAP B1 Service Layer Session.  
     * @param {object} config - Configuration options. 
     * @param {string} config.host
     * @param {number} config.port
     * @param {number} config.version
     * @param {string} config.username
     * @param {string} config.password
     * @param {string} config.company
     * @param {object} config.ca
     * @param {function(SAPb1):void} success - The callback that handles a successful SAP response.
     * @param {function(object|number):void} error - The callback that handles connection and SAP errors.
     */
    static createSession(config = {}, success = () => {}, error = () => {}){
        let url = config.host + ':' + config.port + '/b1s/v' + config.version + '/Login';
        request.execute('POST', url, {
                UserName : config.username,
                Password : config.password,
                CompanyDB : config.company
            }, response => {
                if(response.statusCode() === 200){
                    success(new SAPb1(config, response.cookies()));
                }else{
                    error(response, 2);
                }
            }, err => {
                error(err, 1);
            },
            {}, config.ca
        );
    }

    /** 
     * Retruns a new instance of Resource.
     * @param {string} name - The name of the Resource (e.g Orders).
     * @return {Resource}
     */
    resource(name){
        return new Resource(this._config, this._b1Session, name);
    }

    /** 
     * Provides row level filtering.
     * @param {string} query - oData QueryOption.
     * @param {string} path - oData QueryPath.
     * @param {function(object):void} success - The callback that handles a successful SAP response.
     * @param {function(object|number):void} error - The callback that handles connection and SAP errors.
     */
    query(query, path, success = () => {}, error = () => {}){ 
        let url = this._config.host + ':' + this._config.port + '/b1s/v' + this._config.version + '/QueryService_PostQuery';
        request.execute('POST',url, { QueryOption : '"$expand=' + query +'"' , QueryPath : '"$crossjoin(' + path + ')"' }, response => {
            if(response.statusCode() === 200){
                success(response.toJson());
            }else{
                error(response, 2);
            }
        }, err => {
            error(err, 1);
        }, this._b1Session, this._config.ca);
    }

    /** 
     * @description Retruns the SAP B1 Session data.
     * @return {object}
     */
    session(){
        return this._b1Session;
    }
}

module.exports = SAPb1;
