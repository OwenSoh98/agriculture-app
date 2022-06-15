// Code for the Add Crop page.

/*  Function that activates when add crop button is pushed on web page, stores
    crop data entered by user into local storage if all data is complete */
function addCrop()
{
    // Import value
    let cropNameRef = document.getElementById("cropName").value;
    let seasonRef = document.getElementById("seasons").value;
    let minTempRef = document.getElementById("minTemp").value;
    let maxTempRef = document.getElementById("maxTemp").value;
    let lowYieldOffsetRef = document.getElementById("lowYieldOffset").value;
    let toleranceDayRef = document.getElementById("toleranceDay").value;

    // Test for Validation ====================================================
    // Test for Incomplete data input
    if (cropNameRef === "" || minTempRef === "" || maxTempRef === ""
        || lowYieldOffsetRef === "" || toleranceDayRef === "")
    {
        // Pop up for incomplete input
        console.log("Incomplete Input !!");
        displayToastMessage("Incomplete Input !!");
    }
    else if (isNaN(minTempRef))
    {
        // Test if Minimum Temperature is a Number
        document.getElementById("minTempForm").reset();
        console.log("Minimum Temperature must be a Number !!");
        displayToastMessage("Maximum Temperature must be a Number !!");
    }
    else if (isNaN(maxTempRef))
    {
        // Test if Maximum Temperature is a Number
        document.getElementById("maxTempForm").reset();
        console.log("Maximum Temperature must be a Number !!");
        displayToastMessage("Maximum Temperature must be a Number !!");
    }
    else if (isNaN(lowYieldOffsetRef))
    {
        // Test if Low Yield Offset is a Number
        document.getElementById("lowYieldForm").reset();
        console.log("Low Yield Offset must be a Number !!");
        displayToastMessage("Low Yield OffsetRef must be a Number !!");
    }
    else if (isNaN(toleranceDayRef))
    {
        // Test if Tolerance Day is a Number
        document.getElementById("toleranceForm").reset();
        console.log("Tolerance Day must be a Number !!");
        displayToastMessage("Tolerance Day must be a Number !!");
    }
    else if (Number(maxTempRef) < Number(minTempRef))
    {
        // Test for legit data input for min and max of Temperature
        document.getElementById("minTempForm").reset();
        document.getElementById("maxTempForm").reset();
        console.log("Invalid Temperature Range !!");
        displayToastMessage("Maximum temperature must be greater than minimum temperature!!");
    }
    else
    {
        // Adding Crop ==========================================================
        // Creating Crop Instance
        let cropInstance = new Crop (cropNameRef, seasonRef, minTempRef,
                                     maxTempRef, lowYieldOffsetRef,
                                     toleranceDayRef);

        // Creating Storage
        if (typeof(Storage) !== "undefined")
        {
            let arrayObject = [];

            // Test for if Local Storage exist
            if (localStorage.getItem(CROP_STORAGE_KEY))
            {
                // Getting data from localStorage
                arrayObject = JSON.parse(localStorage.getItem(CROP_STORAGE_KEY));
            }
            // Storing crop into Array
            arrayObject.push(cropInstance);
            // Store in localStorage
            localStorage.setItem(CROP_STORAGE_KEY, JSON.stringify(arrayObject));
        }
        else
        {
            // Error for localStorage not supported
            console.log("Error: localStorage is not supported by current browser.");
        }

        // Jump back to main page after Successfully added crop
        location.href = 'index.html';
        alert("Successfully added " + cropNameRef + " to the Crop List");
    }
}
