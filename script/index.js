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
                "https://dev.to/feed",
                "https://hackernoon.com/feed",
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
            fetchData(constructHackernoonData, URLS[2]);
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
        await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
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

function getTagData (XML, tag, shift_position) {
    const datas = ($(XML).find(tag));
    const DATAS = [];
    for (let x=0;x<datas.length;x++) {
        DATAS.push((datas[x].childNodes[0].wholeText).trim());
    }
    return DATAS.slice(shift_position, DATAS.length);
}

function getImages (XML) {
    return XML.getElementsByTagName("media:content");
}

function getCreator (XML) {
    return XML.getElementsByTagName("dc:creator");
}

function formatDates (date) {
    return date.slice(0, 17);
}

function formatDescriptionText (text) {
    return `${text.trim().slice(0,500)}...`;
}

function getCategories (XML) {
    const ITEMS = ($(XML).find("item"));
    const CATEGORIES = [];
    for (let i = 0;i< ITEMS.length; i++) {
        let cateArr = getTagData(ITEMS[i], "category", 0);
        cateArr = cateArr.map(item=>`#${item}\t\t`);
        CATEGORIES.push(cateArr);
    }
    return CATEGORIES;
}

function getAuthors (XML) {
    const authors = getCreator(XML);
    const AUTHORS = [];
    for (let i = 0;i< authors.length; i++) {
        AUTHORS.push(authors[i].textContent);
        
    }
}

function constructFCCData (xmlData) {

    const TITLES = getTagData(xmlData, "title", 2)
    const DESCRIPTIONS = getTagData(xmlData, "description", 1);
    const DATES = getTagData(xmlData, "pubDate", 0);
    const LINKS = getTagData(xmlData, "link", 2);
    const IMAGES = getImages(xmlData);
    
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
        $(link).text(TITLES[i]);
        $(link).attr("href", (LINKS[i]));
        $(link).attr("target","_blank");
        $(title).append(link);
        $(header).append(title);

        $(date).addClass("card-text text-right");
        $(date).text(formatDates(DATES[i]));
        $(header).append(date);

        $(body).addClass("card-body text-justify");
        $(body).html(DESCRIPTIONS[i]);
        
        $(image).addClass("card-img-top");
        $(image).attr("src", $(IMAGES[i]).attr("url"));

        $(card).append(image);
        $(card).append(header);
        $(card).append(body);
        $("#post-container").append(card);
    }
}

function constructDevToData (xmlData) {

    const TITLES = getTagData(xmlData, "title", 1)
    const DESCRIPTIONS = getTagData(xmlData, "description", 1);
    const DATES = getTagData(xmlData, "pubDate", 0);
    const LINKS = getTagData(xmlData, "link", 1);
    const AUTHORS = getTagData(xmlData, "author", 1);
    
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
        $(link).text(TITLES[i]);
        $(link).attr("href", (LINKS[i]));
        $(link).attr("target","_blank");
        $(title).append(link);
        $(header).append(title);

        $(author).addClass("card-text text-left inline mt-2");
        $(author).text(AUTHORS[i]);
        $(date).addClass("card-text text-right inline");
        $(date).text(formatDates(DATES[i]));
        $(header).append(author);
        $(header).append(date);

        $(body).addClass("card-body text-justify");
        $(body).html(formatDescriptionText(DESCRIPTIONS[i]));

        $(card).append(header);
        $(card).append(body);
        $("#post-container").append(card);
    }
}

function constructHackernoonData (xmlData) {

    const CATEGORIES = getCategories(xmlData);
    const AUTHORS = getAuthors(xmlData)

    const TITLES = getTagData(xmlData, "title", 1)
    const DATES = getTagData(xmlData, "pubDate", 1);
    const LINKS = getTagData(xmlData, "link", 1);
    
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
        $(link).text(TITLES[i]);
        $(link).attr("href", (LINKS[i]));
        $(link).attr("target","_blank");
        $(title).append(link);
        $(header).append(title);

        $(author).addClass("card-text text-left inline mt-2");
        $(author).text(AUTHORS[i]);
        $(date).addClass("card-text text-right inline");
        $(date).text(formatDates(DATES[i]));
        $(header).append(author);
        $(header).append(date);

        $(body).addClass("card-body text-justify");
        $(body).text(CATEGORIES[i]);

        $(card).append(header);
        $(card).append(body);
        $("#post-container").append(card);
    } 
}

