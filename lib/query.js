const request = require("./request.js");
const Filter = require("./filters.js").Filter;

class Query{

    /** 
     * Initializes a new instance of Query.
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
        this._query = {};
        this._filters = [];
        this._baseUrl = config.host + ':' + config.port + '/b1s/v' + config.version + '/';
    }

    /** 
     * The entity fields to return. 
     * @param {string} fields - Comma separated field names.
     */
    select(fields){
        fields = fields === '' ? '*' : fields;
        this._query['$select'] = fields;
        return this;
    }

    /** 
     * Adds a filter to the filter collection. This method performs an AND operation.
     * @param {Filter} filter - The filter to apply.
     */
    where(filter){

        if(!(filter instanceof Filter)){
            throw new Error('The specified filter must be an instance of Filter.');
        }

        filter.setOperator('and');
        this._filters.push(filter);
        return this;
    }

    /** 
     * Adds a filter to the filter collection. This method performs an OR operation.
     * @param {Filter} filter - The filter to apply.
     */
    orWhere(filter){

        if(!(filter instanceof Filter)){
            throw new Error('The specified filter must be an instance of Filter.');
        }

        filter.setOperator('or');
        this._filters.push(filter);
        return this;
    }

    /** 
     * Limits the results.
     * @param {number} top - The number of rows to fetch.
     * @param {number} [skip=0] - The number of rows to skip.
     */
    limit(top, skip = 0){
        this._query['$top'] = top;
        this._query['$skip'] = skip;
        return this;
    }

    /** 
     * Includes the count of matched entities in the result.
     */
    inlineCount(){
        this._query['$inlinecount'] = 'allpages';
        return this;
    }

    /** 
     * Orders the results by the specified field and order direction.
     * @param {string} field - Orders the results using the entity field name.
     * @param {string} [direction='asc'] - The order direction (asc|desc).
     */
    orderBy(field, direction = 'asc'){
        this._query['$orderby'] = field + ' ' + direction;
        return this;
    }

    /** 
     * Returns a count of entities.
     * @param {function(object):void} success - The callback that handles a successful SAP response.
     * @param {function(object|number):void} error - The callback that handles connection and SAP errors.
     */
    count(success = () => {}, error = () => {}){
        this._execute(this._baseUrl + this._resourceName + '/$count', success, error);
        return this;
    }

    /** 
     * Returns all matches.
     * @param {function(object):void} success - The callback that handles a successful SAP response.
     * @param {function(object|number):void} error - The callback that handles connection and SAP errors.
     */
    findAll(success = () => {}, error = () => {}){
        this._execute(this._baseUrl + this._resourceName, success, error);
    }

    /** 
     * Returns a single match.
     * @param {function(object):void} success - The callback that handles a successful SAP response.
     * @param {function(object|number):void} error - The callback that handles connection and SAP errors.
     */
    find(id, success = () => {}, error = () => {}){
        if(typeof id === 'string'){
            id = "'"  + id.replace(/'/g, "''") + "'";
        }
        this._execute(this._baseUrl + this._resourceName + '(' + id + ')', success, error);
    }

    _execute(url, success = () => {}, error = () => {}){
        let requestQuery = '?';

        for(let key in this._query){
            requestQuery += key + '=' + encodeURIComponent(this._query[key]) + '&';
        }

        if(this._filters.length > 0){
            requestQuery += '$filter=' + this._filters.map((filter, i) => {
                let op = (i > 0) ? ' ' + filter.getOperator() + ' ' : '';
                return op + encodeURIComponent(filter);
            }).join('');
        }

        request.execute('GET', url + requestQuery, {}, response => {
            if(response.statusCode() === 200){
                success(response.toJson());
            }else{
                error(response, 2);
            }
        }, err => {
            error(err, 1);
        }, this._b1Session, this._config.ca);
    }
}

module.exports = Query;