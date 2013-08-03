This is a chainable weather underground client for node.js

# Install
    npm install wundergroundnode
    var Wunderground = require('wundergroundnode');
    var myKey = '12312314';
    var wunderground = new Wunderground(myKey);

# How To Use
The syntax follows a simple pattern:
    
    wunderground.[resource calls(s)].request(myQuery, callback);
    
The available resource calls are the following (you must include one in your request):

- conditions
- hourlyForecast
- hourlyTenDayForecast
- forecast
- almanac
- yesterday
- geolookup
- astronomy

The documentation for each resource can be found here: http://www.wunderground.com/weather/api/d/docs?d=index. That also covers how to perform queries against their api.

So to get the current conditions you would use the following code:

    wunderground.conditions().request('84111', function(err, response){
        console.log(response);
    }

Where the real fun comes in, however, is when you want more than one resource in a single call. This functionality is crucial to save on weather underground costs. So extending the example, lets also get the forecast:

    wunderground.conditions().forecast().request('84111', function(err, response){
        console.log(response);
    }

# Simulate Results (Conditions Only)
In addition to pulling from weather undergrounds API there is also an option to simulate results from their service. This simulation gives you a subset of the results you can expect from the conditions data set. This feature allows you to test your code by grabbing a hypothetical hour and test that your code reacts to the changes in temperature, etc, as expected.

The syntax is as follows:

    wunderground.conditions().simulateHour('84111', function(err, response){
        console.log(response);
    }

Each time you call this it will respond with the next hour in time, starting from the present time. At the time of this writing the `conditions()` call is not required but if it's decided to add additional simulations it will be so it's good practice to use it. 

As this is just a simulation the results are limited but the simulation does attempt to give results consistent to what you might see one day at a time. It does this by picking a random high temperature each new simulated day and adjusting them as you would see in the real world.

The following are the simulated subset of results covered from the conditions data set:

Field | Description | Possible Values
--- | --- | ---
local\_tz\_short | Time zone, shortened | MDT
local\_tz\_long | Time zone, long | America/Denver
local\_tz\_offset | Time zone, offset | -0700
temp_f | Current temperature in fahrenheit | 50 - 100
temp_c | Current temperature in celsius | equivalent
wind_dir | Wind direction | SSW
wind_degrees | Wind degrees | 194
wind_mph | Wind speed in mph | 0 - 25
wind_kph | Wind speed in kph | equivalent
precip\_1hr\_in | Precipitation for the hour in inches | 0 - 4, usually 0
precip\_1hr\_metric | Precipitation for the hour in mm | equivalent
relative_humidity | Relative humidity for the hour | 0% - 100%
local_time_rfc822 | Local simulated time | A time string in rfc822

#Running Unit Tests
In order to run unit tests you need to include a file called "devkey" in the test directory. This file must contain only your dev key (no spaces or newlines).

Then simply run this command:

    make test
    
If you have instanbul installed globally you can also run the tests with code coverage results:

    make coverage