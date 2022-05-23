/* * ************************************************************ 
 * Date: 3 Sep, 2018
 * programmer: Shani Mahadeva <shani.mahadeva@blumatter.com>
 * Company : BluMatter Inc.
 * Javascript file index.js
 * *************************************************************** */


module.exports = {
    algolia : require("./algolia"),
    apiclient : require("./apiClient"), 
    aws : require("./aws"),
    errors : require("./errors"),
    eventlog : require("./eventLog"),
    events : require("./events"),
    fb: require("./fb"),
    geo : require("./geocoder"),
    googleapis : require("./googleapis"),
    icom : require("./intercom"),
    linkedin : require("./linkedin"),
    log : require("./xlog"),
    mailer : require("./mailer"),
    makepass : require("./makepass"),
    money : require("./money"),
    noop : function(){},
    notification : require("./notify"),
    processes : require("./processes"),
    renderer : require("./renderer"),
    resumeParser : require("./resumeParser"),
    s3 : require("./s3"),
    service : require("./service"),
    slack : require("./slack"),
    task : require("./task"),
    twilio : require("./twilio"),
    urls : require("./url"),
    validator : require("./jsonSchemaValidator")
};
