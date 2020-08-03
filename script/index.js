//handling option choosed
$(".dropdown-menu a").click ((event) => {
    let text = $(event.target).text();
    $(".dropdown .btn-primary").text(text);
    $(".dropdown-menu a").removeClass("active");
    $("#current-website").text(`${text} RSS Feed`);
    $(event.target).addClass("active");
    //showRSSFeed($(text);
});

const URLS = [
                "https://www.freecodecamp.org/news/rss/",
                "https://dev.to/feed"
            ]
function getWebsiteURL (website) {
    let urlPos = null;
    switch (website) {
        case "FreeCodeCamp":
            urlPos = 0;
            break
    }

    
}


async function fetchData (url) {
    try {
        await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
        .then(response=>response.text())
        .then(data => {
            let XMLData = parseXMLData(data);
            if (XMLData) {
                //construct data
            }
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
