//handling option choosed
$(".dropdown-menu a").click ((event) => {
    let text = $(event.target).text();
    $(".dropdown button").text(text);
    $(".dropdown-menu a").removeClass("active");
    $("#current-website").text(`${text} RSS Feed`);
    $(event.target).addClass("active");
    showRSSFeed(text);
});


const URLS = [
                "https://www.freecodecamp.org/news/rss/",
                "https://dev.to/feed",
                "https://cors-anywhere.herokuapp.com/https://hackernoon.com/feed",
                "http://feeds.dzone.com/home"
            ]

function showRSSFeed (website) {
    $("#post-container").html("");
    switch (website) {
        case "FreeCodeCamp":
            fetchData(constructFCCData ,URLS[0]);
            break;
        case "Dev.to":
            fetchData(constructDevToData, URLS[1]);
            break;
        case "Hackernoon":
            fetchData(constructHackernoonData, URLS[2]);
            break;
        case "Dzone":
            fetchData(constructDZoneData, URLS[3]);
            break;
        default:
            console.log("Error occured, unknown website provided");
            return false;
    }
}


async function fetchData (callback, url) {
    try {
        await fetch(url)
        .then(response=>response.text())
        .then(data => {
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

    if (darkMode) {
        darkMode = false;
        navbar.removeClass("bg-dark").addClass("bg-primary");
        placeholder.removeClass("btn-dark").addClass("btn-primary");
        source.removeClass("btn-dark").addClass("btn-primary");
        selectionBtn.removeClass("bg-dark").addClass("bg-primary");
        dropdownMenu.removeClass("bg-dark").addClass("bg-primary")
        dropDownMenuItems.addClass("btn-primary")
        currWebsite.removeClass("text-light").addClass("text-dark");
        document.body.style.backgroundColor = "white";
    }else {
        darkMode = true;
        document.body.style.backgroundColor = "#0d1219";
    }
}