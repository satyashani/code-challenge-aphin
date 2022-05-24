## User APIs

* [Create User](#create-user)
* [Update User](#update-user)
* [List Users](#list-users)
* [Get a User](#get-a-user)
* [Remove User](#remove-user)


### Create User

**POST** ``` /user ```
 
**REQUEST DATA** 

```js
{
    email :  "string",   // required
    firstname : "String",
    lastname  : "String",
    profilePictureUrl : "String",
    username  : "String"
}
 ```
 
**RESPONSE** 

```js
{ data : <User> }
```
 
----


### Update User

**PUT** ```/user```

**REQUEST DATA** 

```js
{
    email :  "string",   // required
    firstname : "String",
    lastname  : "String",
    profilePictureUrl : "String",
    username  : "String"
}
 ```
 

**RESPONSE**

```js
{ data  : <User> }
```

---- 

### List Users


**GET** ```/user?start=<number>&limit=<number>&sort=<string>```

**REQUEST DATA** 

```js - ```
 

**RESPONSE**

```js
{ data  :  [ <User>  ]}
```

----

### Get A User

`userid` is the field `_id` in User model.

**GET** ```/user/:userid```

**REQUEST DATA**

```-```

**RESPONSE**

```js
{ data : <User> }
```

----


### Remove User

**DELETE** ```/user/:userid```

**REQUEST DATA**

```-```

**RESPONSE**

```js
{ data : { count : Number } }
```

----

