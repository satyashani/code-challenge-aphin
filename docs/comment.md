## Comment APIs

* [Create Comment](#create-comment)
* [Update Comment](#update-comment)
* [List Comments](#list-comments)
* [Get a Comment](#get-a-comment)
* [Remove Comment](#remove-comment)


### Create Comment

**POST** ``` /comment ```
 
**REQUEST DATA** 

```js
{
    hashtags  : [ "String" ],
    mentions  : [ "String" ],
    text      : "String",
    user      : "String"         // user._id
}
 ```
 
**RESPONSE** 

```js
{ data : <Comment> }
```
 
----


### Update Comment

**PUT** ```/comment```

**REQUEST DATA** 

```js
{
    _id       : "String",      // comment id
    hashtags  : [ "String" ],
    mentions  : [ "String" ],
    text      : "String"
}
 ```
 

**RESPONSE**

```js
{ data  : <Comment> }
```

---- 

### List Comments


**GET** ```/comment?start=<number>&limit=<number>&sort=<string>```

**REQUEST DATA** 

```js - ```
 

**RESPONSE**

```js
{ data  :  [ <Comment>  ]}
```

----

### Get A Comment

`commentid` is the field `_id` in Comment model.

**GET** ```/comment/:commentid```

**REQUEST DATA**

```-```

**RESPONSE**

```js
{ data : <Comment> }
```

----


### Remove Comment

**DELETE** ```/comment/:commentid```

**REQUEST DATA**

```-```

**RESPONSE**

```js
{ data : { count : Number } }
```

----

