//handling option choosed
$(".dropdown-menu a").click ((event) => {
    let text = $(event.target).text();
    $(".dropdown .btn-primary").text(text);
    $(".dropdown-menu a").removeClass("active");
    $("#current-website").text(`${text} RSS Feed`);
    $(event.target).addClass("active");
    showRSSFeed(text);
});


function showRSSFeed (website) {
    const websiteUrl = getWebsiteURL(website);
    fetchData(websiteUrl);
}


function constructFCCData (xmlData) {
    let titles = ($(xmlData).find("title"));
    let description = $(xmlData).find("description");
    let links = $(xmlData).find("link");

    const TITLES = titles.slice(2, titles.length);
    const DESCRIPTION = description.slice(1, description.length);
    const IMAGES = xmlData.getElementsByTagName("media:content");
    const DATES = $(xmlData).find("pubDate");
    const LINKS = links.slice(2, links.length);
    
    $("#post-container").html("");

    for (let i = 0; i < TITLES.length;i++) {
        let card = document.createElement("div");
        let header = document.createElement("div");
        let title = document.createElement("h3");
        let link = document.createElement("a");
        let date = document.createElement("div");
        let body = document.createElement("div");

        $(card).addClass("card m-2");
    
        $(header).addClass("card-header");
        $(link).text((TITLES[i].childNodes[0].wholeText).trim());
        $(link).attr("href", (LINKS[0].childNodes[0].wholeText).trim());
        $(title).append(link);
        
        $(header).append(title);
        $(date).addClass("card-text text-right");
        $(date).text((DATES[i].childNodes[0].wholeText).trim().slice(0, 17));
        $(header).append(date);

        $(body).addClass("card-body text-justify");
        $(body).html((DESCRIPTION[i].childNodes[0].wholeText).trim());
        $(card).append(header);
        $(card).append(body);
        $("#post-container").append(card);
    }
}

const URLS = [
                "https://www.freecodecamp.org/news/rss/",
                "https://dev.to/feed"
            ]


function getWebsiteURL (website) {
    let urlPos = -1;
    switch (website) {
        case "FreeCodeCamp":
            urlPos = 0;
            break;
        case "Dev.to":
            urlPos = 1;
            break;
        case "Hackernoon":
            urlPos = 2;
            break;
        case "Dzone":
            urlPos = 3;
            break;
        default:
            console.log("Error occured, unknown website provided");
    }
    return URLS[urlPos];
}


async function fetchData (url) {
    try {
        await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
        .then(response=>response.text())
        .then(data => {
            const XMLParsed = parseXMLData(data);
            constructDataWithImage(XMLParsed);
        });
    }catch (err) {
        console.log(err);
    }
}

function parseXMLData (xml) {
    try {
        if (window.DOMParser) {
            parser = new DOMParser();
            return parser.parseFromString(xml, "text/xml");
        }
        else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            return xmlDoc.loadXML(xml);
        }
    }catch (err){
        console.log(err);
        return false;
    }
} 
