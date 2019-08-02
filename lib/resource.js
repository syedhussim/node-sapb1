const request = require("./request.js");
const Query = require("./query.js");

class Resource{

    /** 
     * Initializes a new instance of Resource.
     * @param {object} config - Configuration options. 
     * @param {string} config.host
     * @param {number} config.port
     * @param {number} config.version
     * @param {object} config.ca
     * @param {object} b1Session - SAP B1 Session data.
     * @param {string} b1Session.B1SESSION
     * @param {string} b1Session.ROUTEID
     * @param {string} name - Resource name.
     */
    constructor(config, b1Session, name){
        this._config = config;
        this._b1Session = b1Session;
        this._resourceName = name;
        this._baseUrl = config.host + ':' + config.port + '/b1s/v' + config.version + '/';
    }

    /** 
     * Posts data to the resource to be created.
     * @param {object} data - Entity data.
     * @param {function(object):void} success - The callback that handles a successful HTTP 201 response.
     * @param {function(object,number):void} error - The callback that handles connection and SAP errors.
     */
    create(data, success = () => {}, error = () => {}){
        let url = this._baseUrl + this._resourceName;
        this._execute('POST', url, data, 201, success, error);
    }

    /** 
     * Posts data to the resource to be updated using the specified id.
     * @param {(number|string)} id - The id of the entity to update.
     * @param {object} data - Entity data.
     * @param {function(object):void} success - The callback that handles a successful HTTP 204 response.
     * @param {function(object,number):void} error - The callback that handles connection and SAP errors.
     */
    update(id, data, success = () => {}, error = () => {}){
        let url = this._baseUrl + this._resourceName + '(' + this._escape(id) + ')';
        this._execute('PATCH', url, data, 204, success, error);
    }

    /** 
     * Deletes an entity from the resource using the specified id.
     * @param {number|string} id - The id of the entity to delete.
     * @param {function(object):void} success - The callback that handles a successful HTTP 204 response.
     * @param {function(object,number):void} error - The callback that handles connection and SAP errors.
     */
    delete(id, success = () => {}, error = () => {}){
        let url = this._baseUrl + this._resourceName + '(' + this._escape(id) + ')';
        this._execute('DELETE', url, {}, 204, success, error);
    }

    /** 
     * Executes an action on the resource using the specified id.
     * @param {number|string} id - The id of the entity the action is applied to.
     * @param {string} action - The name of the action to execute.
     * @param {function(object):void} success - The callback that handles a successful HTTP 204 response.
     * @param {function(object,number):void} error - The callback that handles connection and SAP errors.
     */
    action(id, action, success = () => {}, error = () => {}){
        let url = this._baseUrl + this._resourceName + '(' + this._escape(id) + ')/' + action;
        this._execute('POST', url, {}, 204, success, error);
    }

    /** 
     * Returns a new instance of Query.
     * @return {Query}
     */
    queryBuilder(){
        return new Query(this._config, this._b1Session, this._resourceName);
    }

    _execute(httpMethod, url, data, statusCode, success = () => {}, error = () => {}){
        request.execute(httpMethod, url, data, response => {
            if(response.statusCode() === statusCode){
                success(response.toJson());
            }else{
                error(response, 2);
            }
        }, err => {
            error(err, 1);
        }, this._b1Session, this._config.ca);
    }

    _escape(value){
        if(typeof value === 'string'){
            return "'"  + value.replace(/'/g, "''") + "'";
        }
        return value;
    }
}

module.exports = Resource;