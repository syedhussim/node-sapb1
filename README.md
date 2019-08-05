# SAPb1
A simple and easy to use library for SAP Business One Service Layer API.

## Installation

```
npm install node-sapb1
```
## Usage
Create an object to store your SAP Business One Service Layer configuration details. If you are using an https connection, you can attach the certificate by specifying the ca property of the configuration object as shown below.

```js
var config = {
    host : 'http(s): ip or hostname',
    port : 50000,
    version : 2,
    username : 'SAP usernmae',
    password : 'SAP password',
    company : 'Company name',
    ca : fs.readFileSync('/path/to/certificate.crt')
}
```

Login to the Service Layer to obtain a session as shown below.

```js
const SAPb1 = require('node-sapb1');

SAPb1.createSession(config, sap => {
    // Success 
}, (error, type) => {
    // Error
    // type = 1, Connection errors
    // type = 2, SAP response errors.
});
```

If the connection is successful, the success callback function is called and passed a new instance of SAPb1 as the callback argument. The SAPb1 object provides a `resource(name)` method which returns a new instance of Resource with the specified name. Using this Resource object you can perform CRUD actions.

### Querying A Service

The following code sample demonstrates how to query a Sales Order service and return a JSON object with multiple entries using the `queryBuilder()` method. The `queryBuilder()` method returns a new instance of Query.

```js
SAPb1.createSession(config ,  sap => {
    sap.resource('Orders')
        .queryBuilder()
        .select('DocNum, DocEntry, CardCode, DocumentLines')
        .orderBy('DocNum', 'asc')
        .findAll(data => {
            console.log(data);
        }, (error, type) => {
            console.log(error, type);
        });
}, (error, type) =>{
    console.log(error, type);
});
```
To return a single entry, use the `find(id, success, error)` method as shown below.

```js
SAPb1.createSession(config ,  sap => {
    sap.resource('Orders')
        .queryBuilder()
        .select('DocNum, DocEntry, CardCode, DocumentLines')
        .orderBy('DocNum', 'asc')
        .find(1474, data => {
            console.log(data);
        }, (error, type) => {
            console.log(error, type);
        });
}, (error, type) =>{
    console.log(error, type);
});
```
Depending on the service, **id** may be a numeric value or a string. 

### Creating A Service

The following code sample shows how to create a new Sales Order using the `create()` method of the Resource object.

```js
SAPb1.createSession(config ,  sap => {
    sap.resource('Orders').create({
        CardCode: "BP Card Code",
        DocDueDate: "Doc due date",
        DocumentLines: [
            {
                ItemCode: "Item Code",
                Quantity: "200",
            }
        ]
    }, (data) => {
        console.log(data);
    }, (error, type) => {
        console.log(error, type);
    });
}, (error, type) =>{
    console.log(error, type);
});
```
You must provide any User Defined Fields that are required in the create object. If successful, the newly created Sales Order will be returned as a JSON object.

### Updating A Service

The following code sample demonstrates how to update a service using the `update()` method of the Resource object.

```js
SAPb1.createSession(config ,  sap => {
    sap.resource('Orders').update(19165, {
        Comments: "This is a comment",
    }, (data) => {
        console.log(data);
    }, (error, type) => {
        console.log(error, type);
    });
}, (error, type) =>{
    console.log(error, type);
});
```
Note that the first argument to the `update()` method is the **id** of the entity to update. In the case of a Sales Order the **id** is the DocEntry field. If the update is successful and empty JSON object is returned.

You can find more examples and the full documentation at https://syedhussim.com/sap-b1/node-sapb1-library-documentation-v1.html

Please report any issues on the github repository https://github.com/syedhussim/node-sapb1/issues
