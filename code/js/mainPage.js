// Code for the main app page (locations list).

// Variables
let cropList = [];
let locationListOutputRef = document.getElementById("addLocationHere");

// Load both location and crop list whenever main page is loaded
loadCrop();
loadLocation();

/* Function that redirects user to viewLocation page of the location selected */
function viewLocation(locationName)
{
    // Save the desired location to local storage
    localStorage.setItem(APP_PREFIX + "-selectedLocation", locationName);

    // And load the view location page.
    location.href = 'viewLocation.html';
}

/*  Function that loads crop using data from lcaol storage and displays in
    Only the web page*/
function loadCrop()
{
    // Checks if browser supports local storage
    if (typeof(Storage) !== "undefined")
    {
        // Initialize Variables
        let listHTML = "";
        let cropListOutputRef = document.getElementById("cropList");

        // Retrieve Number of Crops stored in local storage
        if (localStorage.getItem(CROP_STORAGE_KEY))
        {
            cropList = JSON.parse(localStorage.getItem(CROP_STORAGE_KEY));
        }

        console.log("Total Crop: " + cropList.length);

        // Output List of Crops on HTML
        listHTML += "<tr><th>" + "Crop " + "<img width=\"26px\" height=\"26px\" src=\"https://www.iconsdb.com/icons/preview/white/wheat-xxl.png\">";
        listHTML += "</th><th>Season</th><th>Temperature Range (&#8451;)</th></tr>";

        for (let i = 0; i < cropList.length; i++)
        {
            // Initialising Crop class
            let cropInstance = new Crop();
            cropInstance.initialiseFromCropPDO(cropList[i]);

            // Output command
            listHTML += "<tr onclick=\"deleteCrop("+i+")\">";
            listHTML += "<td>" + cropList[i]._name + "</td>";
            listHTML += "<td>" + cropList[i]._season + "</td>";
            listHTML += "<td>" + cropList[i]._safeTempRange[0] + "&#8451; ~ " + cropList[i]._safeTempRange[1] + "&#8451;" + "</td></tr>";
        }

        cropListOutputRef.innerHTML = listHTML;
    }
    else
    {
        console.log("Error: localStorage is not supported by current browser.");
    }
}

/*  Function that loads location using data from lcaol storage and displays in
    Only the web page*/
function loadLocation()
{
    // Checks if browser supports local storage
    if (typeof(Storage) !== "undefined")
    {
        // Initiating variables
        let locationList = [];
        listHTML = "";

        // Getting array of location objects from local storage
        if (localStorage.getItem(LOCATION_STORAGE_KEY))
        {
            locationList = JSON.parse(localStorage.getItem(LOCATION_STORAGE_KEY));
        }

        console.log("Total Location: " + locationList.length);

        for (let i = 0; i < locationList.length; i++)
        {
            let lat = locationList[i].latLng.lat;
            let lng = locationList[i].latLng.lng;

            // List name
            listName = locationList[i].locationName.countryName + ", " + locationList[i].locationName.cityName;

            // If a location nickname was specified, use it for list name
            if (locationList[i].nickName !== null)
            {
                listName += " (" + locationList[i].nickName + ")";
            }

            // Updating variables to be displayed
            index = i;
            displayPage = "main";

            // Instantiate new LocationWeatherCache class to use its functions
            let weatherCacheInstance = new LocationWeatherCache;

            // Display location and weather summary on main page
            weatherCacheInstance.displayWeatherInfo(lat, lng, todayDate);
        }
    }
    else
    {
        console.log("Error: localStorage is not supported by current browser.");
    }
}

/* Function that displays location on the main page */
function displayLocation(weatherData)
{
    listHTML += "<li class=\"mdl-list__item mdl-list__item--two-line\" onclick=\"viewLocation("+index+")\">";
    listHTML += "<span class=\"mdl-list__item-primary-content\">";
    listHTML += "<img class=\"mdl-list__item-icon list-avatar\" src=\"https://img.icons8.com/windows/32/000000/visible.png\">";
    listHTML += "<span>" + listName + "</span>";
    listHTML += "<span id=\"weather2\" class=\"mdl-list__item-sub-title\">" + weatherData.tempData[0]
    + " ~ " + weatherData.tempData[1] + "&#8451;" + "</span>";
    listHTML += "<img></span></li>";

    locationListOutputRef.innerHTML = listHTML;
}

/*  Function that deletes a crop from web page and all its' data from local
    storage */
function deleteCrop(i)
{
    // Checks if browser supports local storage
    if (typeof(Storage) !== "undefined")
    {
        // Getting confirmiation from user to delete a crop
        if (confirm("Delete Crop: " + cropList[i]._name + "?"))
        {
            console.log("Confirmed Delete");

            // Remove selected corp
            cropList.splice(i, 1);
            localStorage.removeItem("CropStorage" + cropList[i]);
            displayToastMessage("Crop Deleted");

            // Re-store data into localStorage
            cropListJSON = JSON.stringify(cropList);
            localStorage.setItem(CROP_STORAGE_KEY, cropListJSON);

            //Reload List
            loadCrop();
        }
        else
        {
            displayToastMessage("Delete Canceled");
            console.log("Delete Crop Canceled");
        }
    }
    else
    {
        console.log("Error: localStorage is not supported by current browser.");
    }
}
