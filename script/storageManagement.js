function gotUsableData (website) {
    if (storgeSupported) {
        try {
            const saved = localStorage.getItem(website);
            const time = localStorage.getItem(`${website}_time`);
            if (saved != null) {
                if (getMiliTime() - time < 300000) {
                    console.log("reusing stored data");
                    return saved;
                }else {
                    throw "Data life time exceeded valid time, data need to be re-fetched";
                }
            }else {
                throw `There's no saved data for ${website}`;
            }
        }catch(err) {
            console.log(err);
            return false
        }
    }else {
        console.log("Sorry but localStorage are not supported");
    }
}

function saveData (website, data) {
    if (storgeSupported) {
        try {
            localStorage.setItem(website, data);
            localStorage.setItem(`${website}_time`, getMiliTime());
        }catch (err) {
            console.log(`${err} \n\n error while saving data to localStorage`);
        }
    }
}

function getMiliTime () {
    return Date.now();
}

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