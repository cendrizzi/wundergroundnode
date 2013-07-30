var request = require('request');
var _       = require('underscore');

var Wunderground = function(apikey) {
    "use strict";

    var that = this;

    that.chainedRequests = [];
    var format = ".json";

    that.conditions = function() {
        this.chainedRequests.push("conditions/");
        return this;
    };

    that.hourlyForecast = function() {
        this.chainedRequests.push("hourly/");
        return this;
    };

    that.hourlyTenDayForecast = function(){
        this.chainedRequests.push('hourly10day/');
        return this;
    };

    that.forecast = function() {
        this.chainedRequests.push("forecast/");
        return this;
    };

    that.almanac = function() {
        this.chainedRequests.push("almanac/");
        return this;
    };

    that.yesterday = function() {
        this.chainedRequests.push("yesterday/");
        return this;
    };

    that.geolookup = function() {
        this.chainedRequests.push("geolookup/");
        return this;
    };

    that.astronomy = function() {
        this.chainedRequests.push("astronomy/");
        return this;
    };

    /**
     * Performs the actual request
     *
     * @param query
     * @param callback
     */
    that.request = function(query, callback){
        // console.log('request called ', query, this.chainedRequests.length);

        // A little pre-query validation
        if (!query){
            callback(true, "You must supply a query");
            return;
        }else if (!that.chainedRequests.length){
            callback(true,  "You must specify a resource to request first (e.g., wu.conditions().req...)");
            return;
        }else if (!_.isFunction(callback)){
            throw "The second argument must be a function";
        }

        // Construct the url
        var url = 'http://api.wunderground.com/api/' + apikey + '/' + this.chainedRequests.join('') + 'q/'+query + format;
        console.log('url', url);

        // Request the url
        request(url, function (error, response, body) {
            that.chainedRequests = [];
            if (!error && response.statusCode == 200) {
                callback.call(that, error, JSON.parse(body));
                return;
            } else if (error) {
                callback.call(that, error, false);
                return;
            }

        });
    }
};

module.exports = Wunderground;