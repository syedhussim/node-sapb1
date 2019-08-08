/** 
 * Abstract Filter class.
 */
class Filter{

    constructor(){}

    setOperator(op){
        this._op = op;
    }

    getOperator(){
        return this._op;
    }

    escape(value){
        if(typeof value === 'string'){
            value = value.replace(/'/g, "''");
            return "'"  + value + "'";
        }
        return value;
    }
}

class Equal extends Filter{

    /** 
     * This filter checks if the specified field is equal to the specified value.
     * @param {string} field - The entity field name.
     * @param {string} value - The filter value.
     */
    constructor(field, value){
        super();
        this.field = field;
        this.value = value;
    }

    toString(){
        return this.field + " eq "  + this.escape(this.value);
    }
}

class NotEqual extends Filter{

    /** 
     * This filter checks if the specified field is NOT equal to the specified value.
     * @param {string} field - The entity field name.
     * @param {string} value - The filter value.
     */
    constructor(field, value){
        super();
        this.field = field;
        this.value = value;
    }

    toString(){
        return this.field + " ne "  + this.escape(this.value);
    }
}

class LessThan extends Filter{

    /** 
     * This filter checks if the specified field is less than the specified value.
     * @param {string} field - The entity field name.
     * @param {string} value - The filter value.
     */
    constructor(field, value){
        super();
        this.field = field;
        this.value = value;
    }

    toString(){
        return this.field + " lt "  + this.escape(this.value);
    }
}

class LessThanEqual extends Filter{

    /** 
     * This filter checks if the specified field is less than or equal to the specified value.
     * @param {string} field - The entity field name.
     * @param {string} value - The filter value.
     */
    constructor(field, value){
        super();
        this.field = field;
        this.value = value;
    }

    toString(){
        return this.field + " le "  + this.escape(this.value);
    }
}

class MoreThan extends Filter{

    /** 
     * This filter checks if the specified field is more than the specified value.
     * @param {string} field - The entity field name.
     * @param {string} value - The filter value.
     */
    constructor(field, value){
        super();
        this.field = field;
        this.value = value;
    }

    toString(){
        return this.field + " gt "  + this.escape(this.value);
    }
}

class MoreThanEqual extends Filter{

    /** 
     * This filter checks if the specified field is more than or equal to the specified value.
     * @param {string} field - The entity field name.
     * @param {string} value - The filter value.
     */
    constructor(field, value){
        super();
        this.field = field;
        this.value = value;
    }

    toString(){
        return this.field + " ge "  + this.escape(this.value);
    }
}

class StartsWith extends Filter{

    /** 
     * This filter checks if the specified field starts with the specified value.
     * @param {string} field - The entity field name.
     * @param {string} value - The filter value.
     */
    constructor(field, value){
        super();
        this.field = field;
        this.value = value;
    }

    toString(){
        return 'startswith(' + this.field + ",'" + this.escape(this.value) + "')";
    }
}

class EndsWith extends Filter{

    /** 
     * This filter checks if the specified field ends with the specified value.
     * @param {string} field - The entity field name.
     * @param {string} value - The filter value.
     */
    constructor(field, value){
        super();
        this.field = field;
        this.value = value;
    }

    toString(){
        return 'endswith(' + this.field + ",'" + this.escape(this.value) + "')";
    }
}

class Contains extends Filter{

    /** 
     * This filter checks if the specified field contains the specified value.
     * @param {string} field - The entity field name.
     * @param {string} value - The filter value.
     */
    constructor(field, value){
        super();
        this.field = field;
        this.value = value;
    }

    toString(){
        return 'contains(' + this.field + ",'" + this.escape(this.value) + "')";
    }
}

class InArray extends Filter{

    /** 
     * This filter checks if the specified field contains one or more of the values in the specified collection.
     * @param {string} field - The entity field name.
     * @param {array} collection - The array filter value.
     */
    constructor(field, collection){
        super();
        this.field = field;
        this.collection = collection;
    }

    toString(){
        let group = '';

        for(let i=0; i < this.collection.length; i++){
            let op = (i < (this.collection.length-1)) ? ' or ' : '';
            group += this.field + " eq "  + this.escape(this.collection[i]) + op;
        }
        return '(' + group + ')';
    }
}

class NotInArray extends Filter{

    /** 
     * This filter checks if the specified field does NOT contain one or more of the values in the specified collection.
     * @param {string} field - The entity field name.
     * @param {array} collection - The array filter value.
     */
    constructor(field, collection){
        super();
        this.field = field;
        this.collection = collection;
    }

    toString(){
        let group = '';

        for(let i=0; i < this.collection.length; i++){
            let op = (i < (this.collection.length-1)) ? ' and ' : '';
            group += this.field + " ne "  + this.escape(this.collection[i]) + op;
        }
        return '(' + group + ')';
    }
}

module.exports.Filter = Filter;
module.exports.Equal = Equal;
module.exports.NotEqual = NotEqual;
module.exports.LessThan = LessThan;
module.exports.LessThanEqual = LessThanEqual;
module.exports.MoreThan = MoreThan;
module.exports.MoreThanEqual = MoreThanEqual;
module.exports.StartsWith = StartsWith;
module.exports.EndsWith = EndsWith;
module.exports.Contains = Contains;
module.exports.InArray = InArray;
module.exports.NotInArray = NotInArray;
