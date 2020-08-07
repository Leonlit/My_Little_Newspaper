//Handling option choosed
$(".dropdown-menu a").click ((event) => {
    //When an option is choosed, the system will change text for the button
    let text = $(event.target).text();
    $(".dropdown button").text(text);
    //change the element that's currently active in the dropdown item
    $(".dropdown-menu a").removeClass("active");
    $("#current-website").text(`${text} RSS Feed`);
    $(event.target).addClass("active");
    //Then pass clicked items website name to showRSSFeed
    let state = showRSSFeed(text);
    //incase error occurs at cors-anywhere 
    if (state == false) {
        console.log("Something wrong while constructing request url");
    }
});

//Array that holds the link for the feeds
const URLS = [
                "https://www.freecodecamp.org/news/rss/",
                "https://dev.to/feed",
                "https://hackernoon.com/feed",
                "http://feeds.dzone.com/home"
            ];

//Array used to store the callback function that we'll be using to construct the post
const CALLBACKS = [constructFCCData, constructDevToData,
                    constructHackernoonData, constructDZoneData
                ];

function showRSSFeed (website) {
    let index;
    
    //whenever the option changed, clear the container content
    $("#post-container").html("");

    //dedtermine which website are clicked, then provide index to be used to get the URl and callback
    //that we will be using for the website choosed
    switch (website) {
        case "FreeCodeCamp":
            index = 0;
            break;
        case "Dev.to":
            index = 1;
            break;
        case "Hackernoon":
            index = 2;
            break;
        case "Dzone":
            index = 3;
            break;
        default:
            console.log("Error occured, unknown website provided");
            return false;
    }
    //check if there's saved data for the website feed
    let checkStorage = gotUsableData (website);
    if (!checkStorage) {
        //if does not have saved data, fetch data using the url and callback with the index as the
        //element position
        fetchData(CALLBACKS[index], URLS[index], website);
    }else {
        //when there's saved data in the storage, use the checkStorage variable as the argument
        //because we return the text of the xml if we've saved data for the feed
        CALLBACKS[index](parseXMLData(checkStorage));
    }
}

//fetching the data
async function fetchData (callback, url, website) {
    try {
        await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
        .then(response=>response.text())
        .then(data => {
            //since we only fetch data when we dont have the data saved or the 
            //data lifespend exceeded 10 minutes we need to resave the data
            saveData(website, data)
            //then provide the callback function with the data
            //Since we're dealing with xml data, we need to parse them by 
            //using the parseXMLData function
            callback(parseXMLData(data));
        });
    }catch (err) {
        //incase there's error while fetching data
        console.log(err);
    }
}

function parseXMLData (xml) {
    try {
        if (window.DOMParser) {
            //any other browser then IE
            let parser = new DOMParser();
            return parser.parseFromString(xml, "text/xml");
        }
        else {
            //for IE
            let XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
            XMLDoc.async = false;
            return XMLDoc.loadXML(xml);
        }
    }catch (err){
        //if the data is not a xml show error
        console.log(err);
        return false;
    }
}

//changing between light and dark mode
let darkMode = true;
function lightDarkMode () {
    let navbar = $("nav").first();
    let placeholder = $(".navbar-nav .nav-item").first();
    let source = $(".navbar-nav .nav-item a");
    let selectionBtn = $(".dropdown button").first();
    let dropdownMenu = $(".dropdown div");
    let dropDownMenuItems = $(".dropdown div a");
    let currWebsite = $("#current-website");
    let postContainer = $("#post-container");

    if (darkMode) {
        darkMode = false;
        $(placeholder).text("Dark Mode");
        navbar.removeClass("bg-dark")
                .addClass("bg-primary");
        placeholder.removeClass("btn-dark")
                    .addClass("btn-primary");
        source.removeClass("btn-dark")
                .addClass("btn-primary");
        selectionBtn.removeClass("bg-dark")
                    .addClass("bg-primary");
        dropdownMenu.removeClass("bg-dark")
                    .addClass("bg-primary")
        dropDownMenuItems.addClass("btn-primary")
        currWebsite.removeClass("text-light")
                    .addClass("text-dark");
        postContainer.removeClass("text-light")
                        .addClass("text-dark");

        $(".card").css("background-color","white");
        $(".card-header").css("border-bottom","1px solid rgba(0,0,0,.125)");
        $("body").css("background-color", "#ffffff");
        $("footer").removeClass("text-light")
                    .addClass("text-dark");
    }else {
        darkMode = true;
        $(placeholder).text("Light Mode");
        navbar.addClass("bg-dark")
                .removeClass("bg-primary");
        placeholder.addClass("btn-dark")
                    .removeClass("btn-primary");
        source.addClass("btn-dark")
                .removeClass("btn-primary");
        selectionBtn.addClass("bg-dark")
                    .removeClass("bg-primary");
        dropdownMenu.addClass("bg-dark")
                    .removeClass("bg-primary")
        dropDownMenuItems.removeClass("btn-primary")
        currWebsite.addClass("text-light")
                    .removeClass("text-dark");
        postContainer.addClass("text-light")
                        .removeClass("text-dark");
                        
        $(".card").css("background-color", "rgb(26, 38, 52)");
        $(".card-header").css("border-bottom","1px solid rgba(255, 255, 255, .125)");
        $("body").css("background-color", "#0d1219");
        $("footer").removeClass("text-dark")
                    .addClass("text-light");
    }
}