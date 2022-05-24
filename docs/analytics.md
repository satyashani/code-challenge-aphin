## Analytics APIs

* [Top Hashtags](#top-hashtags)
* [Top Mentions](#top-mentions)


### Top Hashtags


**GET** ```/analytics/hashTags?start=<number>&limit=<number>```

**REQUEST DATA**

```-```

**RESPONSE**

```js
{ 
    data : [ 
        { _id : "hashtag-string", count : "number" } ,
        ...
    ]
}
```

----


### Top Mentions


**GET** ```/analytics/mentions?start=<number>&limit=<number>```

**REQUEST DATA**

```-```

**RESPONSE**

```js
{ 
    data : [ 
        { _id : "mention-string", count : "number" } ,
        ...
    ]
}
```
