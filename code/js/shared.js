// Code for LocationWeatherCache class and other shared code.

// Storage Keys for Local Storage
const APP_PREFIX = "weatherApp";
const CROP_STORAGE_KEY = "CropStorage";
const LOCATION_STORAGE_KEY = "locationStorage";
const WEATHERCACHE_KEY = "WeatherCache";

// API Keys
let darkSkyKey = "613e5733eab51dfa72ab2033a7e38946";

// Getting today's date
let todayDateUnix = new Date(new Date().darkSkyDateString()) / 1000; // In Unix time
let todayDate = new Date().simpleDateString(); // In Date format YYYY/MM/DD
console.log("Today's date is: " + todayDate);

// Variables
let globalDate;
let displayPage;
let index;
let listName;
let listHTML;

// LocationWeatherCache Class
class LocationWeatherCache
{
    // Constructor: _locations: Array of objects
    constructor()
    {
        this._locations = [];

        if (typeof(Storage) !== "undefined")
        {
            if (localStorage.getItem(WEATHERCACHE_KEY))
            {
                this._locations = JSON.parse(localStorage.getItem(WEATHERCACHE_KEY));
            }
        }
        else
        {
            console.log("Error: localStorage is not supported by current browser.");
        }
    }

    /*  Method: gets all weather info of a particular date, returns array of
        object with weather data that matches the date */
    getWeatherInfoByDate(date)
    {
        let weatherInfoArray = [];

        for (let i = 0; i < this._locations.length; i++)
        {
            if (this._locations[i].date = date)
            {
                weatherInfoArray.push(this._locations[i]);
            }
        }

        return weatherInfoArray;
    }

    /*  Method: gets all weather info of a particular location, returns array of
        object with weather data that matches the location */
    getWeatherInfoByLocation(lat, lng)
    {
      let weatherInfoArray = [];

      for (let i = 0; i < this._locations.length; i++)
      {
          if (this._locations[i].locData[0] === lat
          && this._locations[i].locData[1] === lng)
          {
              weatherInfoArray.push(this._locations[i]);
          }
      }

      return weatherInfoArray;
    }

    /*  Method: gets all weather info of a particular location AND date, and
        returns the weather object that matches with the location and date, returns
        null if nothing matches */
    getWeatherInfo(lat, lng, date)
    {
        // Initialize variables
        let cacheMatch = false;
        let counter = 0;

        // Check for matching date and location with localStorage
        while (cacheMatch === false && counter !== this._locations.length)
        {
            if (this._locations[counter].date === date
              && this._locations[counter].locData[0] === lat
              && this._locations[counter].locData[1] === lng)
            {
                // Returns the weather data object if found
                cacheMatch = true;
                console.log("Cache Match is " + cacheMatch);
                return this._locations[counter];
            }

            counter++;
        }

        // If not found, return null
        if (cacheMatch === false)
        {
            console.log("Cache Match is " + cacheMatch);
            return null;
        }
    }

    /* Method: Display weather info of a specific location and date */
    displayWeatherInfo(lat, lng, date)
    {
        // Searches attributes for particular info
        let weatherData = this.getWeatherInfo(lat, lng, date)

        if (displayPage === "main")
        {
            // Checks whether attribute contains relevant weather info
            if (weatherData)
            {
                // Display on web page
                displayLocation(weatherData);
            }
            else
            {
                // If weather info not there, request info from Dark Sky API
                globalDate = date;
                this.darkSkyRequest(lat, lng, date);
            }
        }
        else if (displayPage === "viewLocation")
        {
            // Checks whether attribute contains relevant weather info
            if (weatherData)
            {
                // Display on web page
                this.displayOnWebPage(weatherData);
            }
            else
            {
                // If weather info not there, request info from Dark Sky API
                globalDate = date;
                this.darkSkyRequest(lat, lng, date);
            }
        }
    }

    /*  To display the temperature data of the selected location. Also, it displays
        the crops that are in season as well as their crop yield status */
    displayOnWebPage(weatherData)
    {
        // Initiate variables
        let maxTemp = weatherData.tempData[1];
        let minTemp = weatherData.tempData[0];

        // Printing data
        let listHtml = "";
        listHtml += "<div class=\"output\">";
        listHtml += "<div class=\"line\">" +"Weather" + "</div>";
        listHtml += "<img src=\"images/" + weatherData.weatherData + ".png\">";

        listHtml += "<div class=\"row\">";
        listHtml += "<div class=\"col-25\">";
        listHtml += "<label for=\"max\">Highest Temperature: </label>";
        listHtml += "</div>";
        listHtml += "<div class=\"col-75\">";
        listHtml += "<span class=\"output\">" + maxTemp + "&#8451;" + "</span>";
        listHtml += "</div>";
        listHtml += "</div>";

        listHtml += "<div class=\"row\">";
        listHtml += "<div class=\"col-25\">";
        listHtml += "<label for=\"max\">Lowest Temperature: </label>";
        listHtml += "</div>";
        listHtml += "<div class=\"col-75\">";
        listHtml += "<span class=\"output\">" + minTemp + "&#8451;" + "</span>";
        listHtml += "</div>";
        listHtml += "</div>";
        listHtml += "</div>";

        if (typeof(Storage) !== "undefined")
        {
            // Retrieve Number of Crops stored in local storage
            if (localStorage.getItem(CROP_STORAGE_KEY))
            {
                let cropList = JSON.parse(localStorage.getItem(CROP_STORAGE_KEY));

                for (let i = 0; i < cropList.length; i++)
                {
                    // Initialising Crop class
                    let cropInstance = new Crop();
                    cropInstance.initialiseFromCropPDO(cropList[i]);

                    if (cropInstance.inSeason(weatherData.date))
                    {
                        listHtml += "<br><br>";
                        listHtml += "<div class=\"output\">";
                        listHtml += "<div class=\"row\">";
                        listHtml += "<div class=\"col-25\">";
                        listHtml += "<label id=\"cropHeader\">" + cropList[i]._name + "</label>";
                        listHtml += "</div>";
                        listHtml += "<div class=\"col-75\">";
                        listHtml += "</div>";
                        listHtml += "</div>";

                        listHtml += "<div class=\"row\">";
                        listHtml += "<div class=\"col-25\">";
                        listHtml += "<label for=\"max\">Safety Temperature Range: </label>";
                        listHtml += "</div>";
                        listHtml += "<div class=\"col-75\">";
                        listHtml += "<span class=\"output\">" + "Safety Temperature Range: " + cropList[i]._safeTempRange[0];
                        listHtml += " ~ " + cropList[i]._safeTempRange[1] + "&#8451;" + "</span>";
                        listHtml += "</div>";
                        listHtml += "</div>";

                        listHtml += "<div class=\"row\">";
                        listHtml += "<div class=\"col-25\">";
                        listHtml += "<label for=\"max\">Survival: </label>";
                        listHtml += "</div>";
                        listHtml += "<div class=\"col-75\">";
                        listHtml += "<span class=\"output\">" + cropInstance.cropYield(minTemp, maxTemp) + "</span>";
                        listHtml += "</div>";
                        listHtml += "</div>";
                        listHtml += "</div>";
                    }
                }
            }
        }
        else
        {
            console.log("Error: localStorage is not supported by current browser.");
        }

        tempOutputRef.innerHTML = listHtml;
    }

    /* Method: Setups relevant query information for jsonpRequest */
    darkSkyRequest(lat, lng, date)
    {
        // Converts from date format to Unix time (Dark Sky only accepts Unix time)
        let dateUnix = Math.floor(new Date(date) / 1000);

        let url = "https://api.darksky.net/forecast/" + darkSkyKey +"/";
        let parameter = url + lat + "," + lng + "," + dateUnix;

        // Data of calling API
        let data = {
            exclude: "currently,minutely,hourly,alerts,flag",
            lang: "en",
            units: "si",
            callback: "darkSkyResult"
        }

        this.jsonpRequest(parameter, data);
    }

    /*  To insert data object into URL parameters. Written by Michael Wybrow */
    jsonpRequest(url, data)
    {
         // Build URL parameters from data object.
         let params = "";
         // For each key in data object...
         for (let key in data)
         {
             if (data.hasOwnProperty(key))
             {
                 if (params.length == 0)
                 {
                     // First parameter starts with '?'
                     params += "?";
                 }
                 else
                 {
                     // Subsequent parameter separated by '&'
                     params += "&";
                 }

                 let encodedKey = encodeURIComponent(key);
                 let encodedValue = encodeURIComponent(data[key]);

                 params += encodedKey + "=" + encodedValue;
              }
         }

         console.log(url + params);
         let script = document.createElement('script');
         script.src = url + params;
         document.body.appendChild(script);
    }
}

// Crop class
class Crop
{
    constructor(name, season, minTemp, maxTemp, lowYieldOffset, tolerance)
    {
        // Private Attributes:
        this._name = name;
        this._season = season;
        this._safeTempRange = [minTemp, maxTemp];
        this._lowYieldOffset = lowYieldOffset;
        this._tolerance = tolerance;
    }

    // Getter
    get name()
    {
        return this._name;
    }

    get season()
    {
        return this._season;
    }

    get minTemp()
    {
        return this._safeTempRange[0];
    }

    get maxTemp()
    {
        return this._safeTempRange[1];
    }

    get lowYieldOffset()
    {
        return this._lowYieldOffset;
    }

    get tolerance()
    {
        return this._tolerance;
    }

    // Setter
    set name(newName)
    {
        this._name = newName;
    }

    set season(season)
    {
        if (season === "Spring" || season === "Summer" || season === "Autumn"
        || season === "Winter")
        {
            this._season = season;
        }
        else
        {
            console.log("Invalid season");
        }
    }

    set minTemp(newMinTemp)
    {

        if (isNaN(newMinTemp))
        {
            console.log("Minimum temperature must be a number");
        }
        else if (newMinTemp < this._safeTempRange[1])
        {
            this._safeTempRange[0] = newMinTemp;
        }
        else
        {
            console.log("Invalid minimum temperature");
        }
    }

    set maxTemp(newMaxTemp)
    {

        if (isNaN(newMaxTemp))
        {
            console.log("Maximum temperature must be a number");
        }
        else if (newMaxTemp > this._safeTempRange[0])
        {
            this._safeTempRange[1] = newMaxTemp;
        }
        else
        {
            console.log("Invalid maximum temperature");
        }
    }

    set lowYieldOffset(newLowYieldOffset)
    {
        if(isNaN(newLowYieldOffset))
        {
            console.log("Low Yield Offset must be a number");
        }
        else
        {
            this._lowYieldOffset = newLowYieldOffset;
        }
    }

    set tolerance(newTolerance)
    {
        if(isNaN(newTolerance))
        {
            console.log("Tolerance must be a number");
        }
        else
        {
            this._tolerance = newTolerance;
        }
    }

    initialiseFromCropPDO(cropObject)
    {
        // Initialise the instance via the mutator methods from the PDO object.
        this._name = cropObject._name;
        this._season  = cropObject._season;
        this._safeTempRange = cropObject._safeTempRange;
        this._lowYieldOffset = cropObject._lowYieldOffset;
        this._tolerance = cropObject._tolerance;
    }

    inSeason(date)
    {
        let currentSeason;

        // Getting month from date string and convert it to a number
        let month = Number(date.slice(5, 7));

        /*Spring - the three transition months September, October and November.
          Summer - the three hottest months December, January and February.
          Autumn - the transition months March, April and May.
          Winter - the three coldest months June, July and August.*/

        switch(month)
        {
            case 9: case 10: case 11: currentSeason = "Spring"; break;
            case 12: case 1: case 2: currentSeason = "Summer"; break;
            case 3: case 4: case 5: currentSeason = "Autumn"; break;
            case 6: case 7: case 8: currentSeason = "Winter";
        }

        // Returns if crop is in season or not in season
        if (this._season === currentSeason)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    cropYield(minTempLocation, maxTempLocation)
    {
        // Converting from string to numbers
        let minTempCrop = Number(this._safeTempRange[0]);
        let maxTempCrop = Number(this._safeTempRange[1]);
        let minTempOffset = minTempCrop - Number(this._lowYieldOffset);
        let maxTempOffset = maxTempCrop + Number(this._lowYieldOffset);

        // Checks if temperature range is in which yield condition
        if (minTempLocation > minTempCrop && maxTempLocation < maxTempCrop
        && minTempLocation < maxTempCrop && maxTempLocation > minTempCrop)
        {
            return "High Yield";
        }
        else if (minTempLocation > minTempOffset && maxTempLocation < maxTempOffset
        && minTempLocation < maxTempOffset && maxTempLocation > minTempOffset)
        {
            return "Low Yield but will survive";
        }
        else
        {
            let degreesPast_low = 0;
            let degreesPast_high = 0;
            let degreesPast = 0;

            // If both crop temperature range are above both location temperatures
            if (minTempLocation < minTempOffset && maxTempLocation < minTempOffset)
            {
                degreesPast = minTempOffset - minTempLocation; // Too cold for crop
            }
            // If both crop temperature range are lower than both location temperatures
            else if (minTempLocation > maxTempOffset && maxTempLocation > maxTempOffset)
            {
                degreesPast = maxTempLocation - maxTempOffset; // Too hot for crop
            }
            else
            {
                if (minTempLocation < minTempOffset)
                {
                    degreesPast_low = minTempOffset - minTempLocation;
                }

                if (maxTempLocation > maxTempOffset)
                {
                    degreesPast_high = maxTempLocation - maxTempOffset;
                }

                // Determine which max and min temperature is more extreme
                if (degreesPast_low > degreesPast_high)
                {
                    degreesPast = degreesPast_low;
                }
                else if (degreesPast_high > degreesPast_low)
                {
                    degreesPast = degreesPast_high;
                }
            }

            let survivalDays = this._tolerance / (degreesPast + 1);
            return "This crop will perish within " + survivalDays.toFixed(2) + " days";
        }
    }
}

function darkSkyResult(info)
{
    let weatherData = {
        date : "",
        locData : [],
        tempData : [],
        weatherData : ""
    };

    weatherData.date = globalDate;
    weatherData.locData = [info.latitude, info.longitude];
    weatherData.tempData = [info.daily.data[0].temperatureLow, info.daily.data[0].temperatureHigh];
    weatherData.weatherData = info.daily.data[0].icon;

    // Display data on main page
    if (displayPage === "main")
    {
        displayLocation(weatherData);
    }
    // Display data on view location page
    else if (displayPage === "viewLocation")
    {
        // Instantiate new LocationWeatherCache class to use its' methods
        let weatherCacheInstance = new LocationWeatherCache;
        weatherCacheInstance.displayOnWebPage(weatherData);
    }

    // Creating Storage
    if (typeof(Storage) !== "undefined")
    {
        let weatherCacheArray = [];

        // Test for if Local Storage exist
        if (localStorage.getItem(WEATHERCACHE_KEY))
        {
            // Getting data from localStorage
            weatherCacheArray = JSON.parse(localStorage.getItem(WEATHERCACHE_KEY));
        }
        // Storing cache into Array
        weatherCacheArray.push(weatherData);

        // Store in localStorage
        localStorage.setItem(WEATHERCACHE_KEY, JSON.stringify(weatherCacheArray));
        console.log("Successfully Stored Cache");
    }
    else
    {
        // Error for localStorage not supported
        console.log("Error: localStorage is not supported by current browser.");
    }
}

// Taken from Assignment 1
// This function displays the given message String as a "toast" message at
// the bottom of the screen.  It will be displayed for 2 second, or if the
// number of milliseconds given by the timeout argument if specified.
function displayToastMessage(message, timeout)
{
    if (timeout === undefined)
    {
        // Timeout argument not specifed, use default.
        timeout = 2000;
    }

    if (typeof(message) == 'number')
    {
        // If argument is a number, convert to a string.
        message = message.toString();
    }

    if (typeof(message) != 'string')
    {
        console.log("displayMessage: Argument is not a string.");
        return;
    }

    if (message.length == 0)
    {
        console.log("displayMessage: Given an empty string.");
        return;
    }

    let snackbarContainer = document.getElementById('toast');
    let data = {
        message: message,
        timeout: timeout
    };
    if (snackbarContainer && snackbarContainer.hasOwnProperty("MaterialSnackbar"))
    {
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }
}
