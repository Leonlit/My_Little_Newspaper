//handling option choosed
$(".dropdown-menu a").click ((event) => {
    let text = $(event.target).text();
    $(".dropdown button").text(text);
    $(".dropdown-menu a").removeClass("active");
    $("#current-website").text(`${text} RSS Feed`);
    $(event.target).addClass("active");
    let state = showRSSFeed(text);
    if (state == false) {
        console.log("Something wrong while constructing request url");
    }
});


const URLS = [
                "https://www.freecodecamp.org/news/rss/",
                "https://dev.to/feed",
                "https://hackernoon.com/feed",
                "http://feeds.dzone.com/home"
            ];

const CALLBACKS = [constructFCCData, constructDevToData,
                    constructHackernoonData, constructDZoneData
                ];

function showRSSFeed (website) {
    let index;
    $("#post-container").html("");

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
    let checkStorage = gotUsableData (website);
    if (!checkStorage) {
        fetchData(CALLBACKS[index], URLS[index], website);
    }else {
        reuseData(checkStorage, CALLBACKS[index]);
    }
}

function reuseData (data, callback) {
    callback(parseXMLData(data));
}


async function fetchData (callback, url, website) {
    try {
        await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
        .then(response=>response.text())
        .then(data => {
            saveData(website, data)
            callback(parseXMLData(data));
        });
    }catch (err) {
        console.log(err);
    }
}

function parseXMLData (xml) {
    try {
        if (window.DOMParser) {
            let parser = new DOMParser();
            return parser.parseFromString(xml, "text/xml");
        }
        else {
            let xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            return xmlDoc.loadXML(xml);
        }
    }catch (err){
        console.log(err);
        return false;
    }
}

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