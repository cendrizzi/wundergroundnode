var request = require('request');
var _       = require('underscore');
var moment  = require('moment');

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



    /**
     * SIMULATION CODE
     */

    /**
     * Current moment in time for the simulation
     *
     * @type {boolean|Moment}
     */
    var currentSimulationMoment = false;

    /**
     * The current simulated days high temperature
     *
     * @type {int}
     */
    var dayHighTemp         = false;

    /**
     * Coefficients used to gradually change the days temperatures
     *
     * @type {Array}
     */
    var dayCoefficient   = [
        0.85,   // 12 am
        0.83,   // 1 am
        0.81,   // 2 am
        0.79,   // 3 am
        0.77,   // 4 am
        0.75,   // 5 am
        0.75,   // 6 am
        0.77,   // 7 am
        0.79,   // 9 am
        0.81,   // 10 am
        0.85,   // 11 am
        0.89,   // 12 pm
        0.94,   // 1pm
        0.96,   // 2pm
        0.98,   // 3pm
        1,      // 4pm
        1,      // 5pm
        0.99,   // 6pm
        0.96,   // 7pm
        0.92,   // 8pm
        0.90,   // 9pm
        0.88,   // 10pm
        0.86    // 11pm
    ];

    /**
     * Grabs a randomized high temp
     *
     * @returns {number}
     */
    var getRandomHighTemp = function(){
        return Math.floor(Math.random() * 50) + 50;
    };

    /**
     * Grabs a randomized wind speed
     *
     * @returns {number}
     */
    var getRandomWmph = function(){
        return Math.floor(Math.random() * 25);
    };

    /**
     * Grabs a randomized precipitation and humidity reading
     *
     * @returns {object}
     */
    var getRandomPrecipitationAndHumidity = function(){
        var precipitation = 0;
        var humitidy      = null;
        if (Math.random() > 0.6){
            precipitation = Math.floor(Math.random() * 4);
        }
        if (precipitation > 0){
            humitidy = 100;
        } else {
            humitidy =  Math.floor(Math.random() * 50) + Math.floor(Math.random() * 30);
        }

        return {
            humidity        : humitidy,
            precipitation   : precipitation
        }
    };

    /**
     * Converts from F to C
     *
     * @param tempF
     * @returns {number}
     */
    var convertFtoC = function(tempF) {
        return (5/9)*(tempF-32)
    };

    /**
     * Converts from mph to kph
     *
     * @param kph
     * @returns {number}
     */
    var convertMphToKph = function(mph){
        return mph * 1.609344;
    };

    /**
     * Converts inches to MM's
     *
     * @param inches
     * @returns {number}
     */
    var convertInToMm = function(inches){
        return inches / .03937
    }

    /**
     * The subset of conditions data set that we simulate
     *
     * @type {object}
     */
    var baseObject = {
        local_tz_short      : 'MDT',
        local_tz_long       : 'America/Denver',
        local_tz_offset     : '-0600',
        temp_f	            : 0,
        temp_c	            : 0,
        wind_dir            : 'SSW',
        wind_degrees	    : 194,
        wind_mph            : 0,
        wind_kph            : 0,
        precip_1hr_in       : 0,
        precip_1hr_metric   : 0,
        relative_humidity   : 0
    };

    /**
     * Performs the simulated request
     *
     * @param query
     * @param callback
     */
    that.simulateHour = function(query, callback){
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

        if (!currentSimulationMoment){
            currentSimulationMoment = moment();
        }

        var returnDataset = {};
        var currentHour = currentSimulationMoment.hour();


        // Current Conditions
        if (_.contains(this.chainedRequests, 'conditions/')){
            if (currentHour === 0 || dayHighTemp === false){
                dayHighTemp = getRandomHighTemp();
            }

            console.log('dayHighTemp: ', dayHighTemp);

            var currentPrecAndHum = getRandomPrecipitationAndHumidity();
            var currentDataset = {};
            currentDataset.local_time_rfc822 = currentSimulationMoment.format('ddd, DD MMM YYYY HH:mm:ss') + ' ' + baseObject.local_tz_offset;
            currentDataset.temp_f = parseFloat( (dayHighTemp * dayCoefficient[currentHour]).toPrecision(4) );
            currentDataset.temp_c = parseFloat( convertFtoC(currentDataset.temp_f).toPrecision(4) );
            currentDataset.wind_mph = getRandomWmph();
            currentDataset.wind_kph = parseInt(convertMphToKph(currentDataset.wind_mph));
            currentDataset.precip_1hr_in = parseInt(currentPrecAndHum.precipitation);
            currentDataset.precip_1hr_metric = parseInt(convertInToMm(currentDataset.precip_1hr_in));
            currentDataset.relative_humidity = currentPrecAndHum.humidity+'%';

            returnDataset.current_observation = _.extend({}, baseObject, currentDataset);
        }

        // Hourly Forecast
        // Current Conditions
        if (_.contains(this.chainedRequests, 'hourly/')){
            returnDataset.hourly = {};
        }

        currentSimulationMoment.add(1, 'hour');
        callback.call(that, false, returnDataset);
    }
};

module.exports = Wunderground;