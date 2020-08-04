//handling option choosed
$(".dropdown-menu a").click ((event) => {
    let text = $(event.target).text();
    $(".dropdown .btn-primary").text(text);
    $(".dropdown-menu a").removeClass("active");
    $("#current-website").text(`${text} RSS Feed`);
    $(event.target).addClass("active");
    showRSSFeed(text);
});


const URLS = [
                "https://www.freecodecamp.org/news/rss/",
                "https://dev.to/feed"
            ]

function showRSSFeed (website) {
    switch (website) {
        case "FreeCodeCamp":
            fetchData(constructFCCData ,URLS[0]);
            break;
        case "Dev.to":
            fetchData(constructDevToData, URLS[1]);
            break;
        case "Hackernoon":
            fetchData(URLS[2]);
            break;
        case "Dzone":
            fetchData(URLS[3]);
            break;
        default:
            console.log("Error occured, unknown website provided");
            return false;
    }
}


async function fetchData (callback, url) {
    try {
        await fetch(`${url}`)
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
        let image = document.createElement("img");
        let header = document.createElement("div");
        let title = document.createElement("h4");
        let link = document.createElement("a");
        let date = document.createElement("div");
        let body = document.createElement("div");

        $(card).addClass("card m-3");
    
        $(header).addClass("card-header");
        $(link).text((TITLES[i].childNodes[0].wholeText).trim());
        $(link).attr("href", (LINKS[i].childNodes[0].wholeText).trim());
        $(link).attr("target","_blank");
        $(title).append(link);
        $(header).append(title);

        $(date).addClass("card-text text-right");
        $(date).text((DATES[i].childNodes[0].wholeText).trim().slice(0, 17));
        $(header).append(date);

        $(body).addClass("card-body text-justify");
        $(body).html((DESCRIPTION[i].childNodes[0].wholeText).trim());
        
        $(image).addClass("card-img-top");
        $(image).attr("src", $(IMAGES[i]).attr("url"));

        $(card).append(image);
        $(card).append(header);
        $(card).append(body);
        $("#post-container").append(card);
    }
}

function constructDevToData (xmlData) {
    let titles = ($(xmlData).find("title"));
    let description = $(xmlData).find("description");
    let links = $(xmlData).find("link");
    let authors = $(xmlData).find("author");

    const TITLES = titles.slice(1, titles.length);
    const DESCRIPTION = description.slice(1, description.length);
    const AUTHORS = authors.slice(1, authors.length);
    const DATES = $(xmlData).find("pubDate");
    const LINKS = links.slice(1, links.length);
    
    $("#post-container").html("");

    for (let i = 0; i < TITLES.length;i++) {
        let card = document.createElement("div");
        let header = document.createElement("div");
        let title = document.createElement("h4");
        let link = document.createElement("a");
        let author = document.createElement("p");
        let date = document.createElement("p");
        let body = document.createElement("div");

        $(card).addClass("card m-3");
    
        $(header).addClass("card-header");
        $(link).text((TITLES[i].childNodes[0].wholeText).trim());
        $(link).attr("href", (LINKS[i].childNodes[0].wholeText).trim());
        $(link).attr("target","_blank");
        $(title).append(link);
        $(header).append(title);

        $(author).addClass("card-text text-left inline mt-2");
        $(author).text((AUTHORS[i].childNodes[0].wholeText).trim());
        $(date).addClass("card-text text-right inline");
        $(date).text((DATES[i].childNodes[0].wholeText).trim().slice(0, 17));
        $(header).append(author);
        $(header).append(date);

        $(body).addClass("card-body text-justify");
        $(body).html(((DESCRIPTION[i].childNodes[0].wholeText).trim()).slice(0,200).concat(`\.\.\.`));

        $(card).append(header);
        $(card).append(body);
        $("#post-container").append(card);
    }
}

