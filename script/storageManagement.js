//Check if the webstite feed have been previously saved in localStroage.
//If there's saved data in for the website, get it from the storage.
function gotUsableData (website) {
    //check whether localStorage is supported
    if (storgeSupported) {
        try {
            //Then we perform checks for the previous timestamp we saved the feed data
            const saved = localStorage.getItem(website);
            const time = localStorage.getItem(`${website}_time`);
            if (saved != null) {
                //If the feed is from 10 minutes ago, we need to re-fetch the data from the website
                if (getMiliTime() - time < 600000) {
                    console.log("reusing stored data");
                    return saved;
                }else {
                    throw "Data life time exceeded valid time, data need to be re-fetched";
                }
            }else {
                throw `There's no saved data for ${website}`;
            }
        }catch(err) {
            //if the time is exceeded or there's no saved data for the website return false
            //to indicate we need to fetch the data
            console.log(err);
            return false
        }
    }else {
        console.log("Sorry your browser does not support localStorage");
    }
}

//saving the feed data into localStorage, if supported
function saveData (website, data) {
    if (storgeSupported) {
        try {
            localStorage.setItem(website, data);
            localStorage.setItem(`${website}_time`, getMiliTime());
        }catch (err) {
            console.log(`${err} \n\n error while saving data to localStorage`);
        }
    }else {
        console.log("Cannot save data, your browser does not support localStorage.");
    }
}

function getMiliTime () {
    return Date.now();
}

//To check if a browser support localStorage
function storgeSupported () {
    var test = "test";
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(err) {
        return false;
    }
}