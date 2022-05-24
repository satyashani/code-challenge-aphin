## General Documentation


### Request Format

**Content-Type** 

The content-type header must be `application/json`.

### Listing APIs

All listing apis provide following query parameters - 

**start** - For selecting the start of the response
**limit** - The number of results to return
**sort**  - The mongodb format sort key - e.g. `(+|-)<fieldName>`


### Response Format

The response from APIs is as follows -

**Create/Update**

``` { data : <Data Object> } ```

**Get List**

``` { data : [ <Data Object Array> ] } ```

**Remove Data**

``` { data : { count : Number } } ```

**Error**

``` { error : "ErrorCode" } ```