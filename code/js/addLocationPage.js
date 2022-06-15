// Code for the Add Location page.

// Global variables
let countryNameRef = document.getElementById("countryName");
let cityNameRef = document.getElementById("cityName");
let nickNameRef = document.getElementById("nickName");
let marker = null;
let popup = null;
let locationObject;
let latLng;

// API Keys for mapbox and mapquest
L.mapquest.key = 'lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24';
mapboxgl.accessToken = 'pk.eyJ1Ijoib3dlbjEwMDgiLCJhIjoiY2p0eTNieW44MnAyNzRkbTI1cHJyMDlsciJ9.PucSZikBeopCA5l7mMsKkQ';

// Create map when page is loaded
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    zoom: 12,
    center: [0, 0]
})

/* Function that searches a location and returns its latitude and
longitude values as well as pans to that location and mark it with marker */
function searchLocation()
{
    if (countryNameRef.value === "" || cityNameRef.value === "")
    {
        alert("Invalid Entry");
        map.panTo([0, 0]);
    }
    else
    {
        L.mapquest.geocoding().geocode({
            country: countryNameRef.value,
            city: cityNameRef.value,
        }, geocodingCallback);

        /* Callback function for geocoding */
        function geocodingCallback(error, result)
        {
            console.clear();
            console.log(result);

            // Checks if there is a marker on map
            if (marker)
            {
                marker.remove(); // If so, remove marker
            }

            // Checks if location is less accurate than city level
            if (result.results[0].locations[0].geocodeQuality !== "COUNTY" &&
            result.results[0].locations[0].geocodeQuality !== "STATE" &&
            result.results[0].locations[0].geocodeQuality !== "COUNTRY")
            {
                locationObject = result.results[0].locations[0];
                latLng = result.results[0].locations[0].latLng;

                // Pans map to the location searched
                map.panTo([latLng.lng, latLng.lat]);

                // Popup message content
                let popupMessage = locationObject.adminArea1 + ", " + locationObject.adminArea5;
                popupMessage += " (" + latLng.lat.toFixed(2) + ", " + latLng.lng.toFixed(2) + ")";

                // Place marker and popup message on map
                marker = new mapboxgl.Marker({
                        color: "black"
                   });

                popup = new mapboxgl.Popup({
                        offset: 45
                   });

                marker.setLngLat([latLng.lng, latLng.lat]).addTo(map);
                popup.setText(popupMessage).addTo(map);
                marker.setPopup(popup);
            }
            else
            {
                alert("Invalid position for Location!");
                map.panTo([0, 0]);
            }
        }
    }
}

function addLocation()
{
    if (countryNameRef.value === "" || cityNameRef.value === "")
    {
        alert("Invalid Entry!");
    }
    else
    {
        if (typeof(Storage) !== "undefined")
        {
            L.mapquest.geocoding().geocode({
                country: countryNameRef.value,
                city: cityNameRef.value,
            }, geocodingCallback);

            /* Callback function for geocoding */
            function geocodingCallback(error, result)
            {
                // Checks if location is less accurate than city level
                if (result.results[0].locations[0].geocodeQuality !== "COUNTY" &&
                result.results[0].locations[0].geocodeQuality !== "STATE" &&
                result.results[0].locations[0].geocodeQuality !== "COUNTRY")
                {
                    let nickName = null;
                    let locationArray = [];
                    locationObject = result.results[0].locations[0];
                    latLng = result.results[0].locations[0].latLng;

                    // Checks if there is a nickname entered by user
                    if (nickNameRef.value !== "")
                    {
                        nickName = nickNameRef.value;
                    }

                    // LocationInstance object to be stored
                    let locationInstance = {
                        locationName: {
                            countryName: locationObject.adminArea1,
                            cityName: locationObject.adminArea5,
                        },
                        latLng: latLng,
                        nickName: nickName,
                    };

                    // Checks if local storage exists for location storage
                    if (localStorage.getItem(LOCATION_STORAGE_KEY))
                    {
                        // If so, get the location storage data from local storage
                        locationArray = JSON.parse(localStorage.getItem(LOCATION_STORAGE_KEY));
                    }

                    // Storing location into an array
                    locationArray.push(locationInstance);

                    // Storing location array into local storage
                    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationArray));

                    // Notify user that location has been added successfully
                    alert("Successfully added " + locationInstance.locationName.countryName
                    + ", " + locationInstance.locationName.cityName + " to the Location List");

                    // Return to main page after location is added successfully
                    location.href = 'index.html';
                }
                else
                {
                    alert("Invalid position for Location!");
                    map.panTo([0, 0]);
                }
            }
        }
        else
        {
            console.log("Error: localStorage is not supported by current browser.");
        }
    }
}
