class Response{

    /** 
     * Initializes a new instance of Response.
     * @param {number} statusCode - The HTTP response code.
     * @param {object} headers - The response headers.
     * @param {string} body - The response body.
     */
    constructor(statusCode, headers, body){
        this._statusCode = statusCode;
        this._headers = headers;
        this._body = body;
        this._cookieJar = {};
        var that = this;

        if(this._headers.hasOwnProperty('set-cookie')){
            this._headers['set-cookie'].forEach(element => {
                let segments = element.split(';');
    
                if(segments[0].indexOf('=') > -1){
                    let pair = segments[0].split('=');
    
                    if(pair.length == 2){
                        that._cookieJar[pair[0]] = pair[1];
                    }
                }
            });
        }
    }

    /** 
     * Gets the response code.
     * @return {number}
     */
    statusCode(){
        return this._statusCode;
    }

    /** 
     * Gets the response headers.
     * @return {object}
     */
    headers(){
        return this._headers;
    }

    /** 
     * Gets the response cookies.
     * @return {object}
     */
    cookies(){
        return this._cookieJar;
    }

    /** 
     * Gets the response body.
     * @return {string}
     */
    body(){
        return this._body;
    }

    /** 
     * Gets the response body as a JSON object.
     * @return {object}
     */
    toJson(){
        if(this._body.length > 0){
            return JSON.parse(this._body);
        }
        return {};
    }
}

module.exports = Response;