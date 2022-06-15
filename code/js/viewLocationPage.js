// Code for the View Location page.

// Variables
let tempOutputRef = document.getElementById("tempOutput");
let dateInputRef = document.getElementById("dateInput");

// Geting values from local storage
let locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");
let locationArray = JSON.parse(localStorage.getItem(LOCATION_STORAGE_KEY));

// Loads calender when page loads
loadCalender();

/* Show map on page load */
if (locationIndex !== null)
{
    // Mapbox API key
    mapboxgl.accessToken = 'pk.eyJ1Ijoib3dlbjEwMDgiLCJhIjoiY2p0eTNieW44MnAyNzRkbTI1cHJyMDlsciJ9.PucSZikBeopCA5l7mMsKkQ';

    // Create map centered around location chosen from location list
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        zoom: 12,
        center: [locationArray[locationIndex].latLng.lng, locationArray[locationIndex].latLng.lat]
    })

    // Header bar title
    let headerName = locationArray[locationIndex].locationName.countryName + ", " + locationArray[locationIndex].locationName.cityName;

    // If a location nickname was specified, use it for header bar title
    if (locationArray[locationIndex].nickName !== null)
    {
        headerName += " (" + locationArray[locationIndex].nickName + ")";
    }

    document.getElementById("headerBarTitle").textContent = headerName;

    // Initialize marker and popup variable
    let marker = new mapboxgl.Marker({
            color: "black"
       });

    let popup = new mapboxgl.Popup({
            offset: 45
       });

    // Content for popup messages
    let popupMessage = locationArray[locationIndex].locationName.countryName + ", ";
    popupMessage += locationArray[locationIndex].locationName.cityName;
    popupMessage += " (" + locationArray[locationIndex].latLng.lat.toFixed(2) + ", ";
    popupMessage += locationArray[locationIndex].latLng.lng.toFixed(2) + ")";

    // Place marker and popup message on map
    marker.setLngLat([locationArray[locationIndex].latLng.lng, locationArray[locationIndex].latLng.lat]).addTo(map);
    popup.setText(popupMessage).addTo(map);
    marker.setPopup(popup);
}

/* Function to delete current location selected */
function deleteLocation()
{
    // To confirm user to delete current location
    if (confirm("Delete current Location?"))
    {
        // Delete location from array of object
        locationArray.splice(locationIndex, 1);
        // Display message to user that location has been deleted
        alert("Location Deleted");
        // Store resultant array of object back into local storage
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationArray));
        // Return to main page
        location.href = 'index.html';
    }
    else
    {
        // Display message to user that deletion has been cancelled
        displayToastMessage("Delete Cancelled");
    }
}

/*  Function that creates a calender with dates limited to the last 12 months
    from today's date being selectable */
function loadCalender()
{
    let dateList = "";
    let dateArray = [];
    let strDateArray = [];

    for (let i = 0; i < 2; i++)
    {
        // Calculations for current and minimum date
        dateArray[i] = (todayDateUnix * 1000) - i * (365 * 24 * 60 * 60 * 1000);

        // To date format Week MM DD YYYY TIME GMT+XXXX
        let dateInstance = new Date(dateArray[i]);

        // To ISO date format YYYY/MM/DD + TIME
        strDateArray[i] = dateInstance.toISOString();
    }

    // Extracts part of the string (YYYY/MM/DD), ignores TIME
    let currentDate = strDateArray[0].substr(0,10);
    let minDate = strDateArray[1].substr(0,10);

    // Display available date to choose from
    dateList += "<input type=\"date\" onkeydown=\"return false\" id=\"dateSelected\" value=\""
    + currentDate + "\" min=\"" + minDate + "\" max=\"" + currentDate + "\">";

    dateInputRef.innerHTML = dateList;
    loadWeather();
}

/*  Function that takes in a date from the calender, and also the Latitute
    and Longitute of this particular location and displays the weather info
    on web page */
function loadWeather()
{
    console.clear(); // Clear console

    // Getting date from calender
    let dateRef = document.getElementById("dateSelected");
    console.log("Date Selected: " + dateRef.value);

    // Getting coordinates from loaction array
    let lat = locationArray[locationIndex].latLng.lat ;
    let lng = locationArray[locationIndex].latLng.lng ;

    // Updating page to be displayed
    displayPage = "viewLocation";

    // Instantiate new LocationWeatherCache class
    let weatherCacheInstance = new LocationWeatherCache;

    // Display weather info on  view location bpage
    weatherCacheInstance.displayWeatherInfo(lat, lng, dateRef.value);
}
