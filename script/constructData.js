//getting the XML tag value 
// @Param XML            - the xml document object
// @Param tag            - the tag name
// @Param shift_position - how many position that we want to shift from the array produced
// @return               - return an Array of text extracted from the tag name provided 
function getTagData (XML, tag, shift_position) {
    const datas = ($(XML).find(tag));
    const DATAS = [];
    for (let x=0;x<datas.length;x++) {
        DATAS.push((datas[x].childNodes[0].wholeText).trim());
    }
    return DATAS.slice(shift_position, DATAS.length);
}

//Since image can be storege in multiple tag name, I decided to make another funtion for it
// @Param XML - xml document object
// @Param tag - the tag name that we want to extract data from
// @return    - return an array of tag that contains links for post thumbnail
function getImages (XML, tag) {
    return XML.getElementsByTagName(tag);
}

//Getting the creator of the post
// @Param XML - the website RSS feed in XML form
// @return    - returning an Array of tag that contains the author's name
function getCreator (XML) {
    return XML.getElementsByTagName("dc:creator");
}

//since the date of publishing also contains data like the hour, minutes, second the post is published
//I removed the back part of the data as I dont think user will need to know the exact time of the publishing
// @Param data - The string the contains the exact time when the post is published in the formn of,
//               "Thu, 06 Aug 2020 21:47:36 +0000". So I only take the first 16 character of the string
//               which includes which day is it, date in dd mmm yyyy format
// @return     - returns the nicely modified date
function formatDates (date) {
    return date.slice(0, 16);
}

//limiting the text showed for the feeds that provide post's full description
function formatDescriptionText (text) {
    return `${text.trim().slice(0,500)}...`;
}

//Some website feed provide categories, so might as well show them to user
// @Param XML - The xml object of the feed
// @return    - returns an Array of categories in string form
function getCategories (XML) {
    //since categories is separated by post, we need to get the item tags and loop through
    //the ITEMS array. Then, for each item tag, we then find all the "category" tag available
    //for that item. Once we get the array of category, we then join them together to become
    //a string. Finally, push the string into the array
    const ITEMS = ($(XML).find("item"));
    const CATEGORIES = [];
    for (let i = 0;i< ITEMS.length; i++) {
        let cateArr = getTagData(ITEMS[i], "category", 0);
        //Joining the categories together to prevent showing the comma sign
        cateArr = cateArr.map(item=>`#${item} `).join(" ");
        CATEGORIES.push(cateArr);
    }
    return CATEGORIES;
}

//Parsing the author tag to get the text form
// @Param XML - XML object for the feed
// @return    - returns an array of authors name
function getAuthors (XML) {
    //getting the tags that contains the author name's text
    const authors = getCreator(XML);
    const AUTHORS = [];
    for (let i = 0;i< authors.length; i++) {
        //getting the authors name in text form for each tag found
        AUTHORS.push(authors[i].textContent); 
    }
    return AUTHORS;
}

//card themes dark & light
const card_dark = {
    'width': '500px',
    'background-color': '#1a2634'
}

const card_light = {
    'width': '500px',
    'background-color': 'white'
}


//function for constructing post container
//FreeCodeCamp post construction
function constructFCCData (xmlData) {
    const TITLES = getTagData(xmlData, "title", 2)
    const DESCRIPTIONS = getTagData(xmlData, "description", 1);
    const DATES = getTagData(xmlData, "pubDate", 0);
    const LINKS = getTagData(xmlData, "link", 2);
    const IMAGES = getImages(xmlData, "media:content");

    for (let i = 0; i < TITLES.length;i++) {
        let card = document.createElement("div");
        let image = document.createElement("img");
        let header = document.createElement("div");
        let title = document.createElement("h4");
        let link = document.createElement("a");
        let date = document.createElement("div");
        let body = document.createElement("div");

        $(card).addClass("card m-3");
        $(card).css(darkMode ? card_dark : card_light);
    
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

//Dev.to post construction
function constructDevToData (xmlData) {
    const TITLES = getTagData(xmlData, "title", 1)
    const DESCRIPTIONS = getTagData(xmlData, "description", 1);
    const DATES = getTagData(xmlData, "pubDate", 0);
    const LINKS = getTagData(xmlData, "link", 1);
    const AUTHORS = getTagData(xmlData, "author", 1);

    for (let i = 0; i < TITLES.length;i++) {
        let card = document.createElement("div");
        let header = document.createElement("div");
        let title = document.createElement("h4");
        let link = document.createElement("a");
        let author = document.createElement("p");
        let date = document.createElement("p");
        let body = document.createElement("div");

        $(card).addClass("card m-3");
        $(card).css(darkMode ? card_dark : card_light);
    
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

//Dzone post construction
function constructDZoneData (xmlData) {
    const CATEGORIES = getCategories(xmlData);
    const AUTHORS = getAuthors(xmlData)
    const TITLES = getTagData(xmlData, "title", 1)
    const DATES = getTagData(xmlData, "pubDate", 0);
    const DESCRIPTIONS = getTagData(xmlData, "description", 1);
    const LINKS = getTagData(xmlData, "link", 1);
    const IMAGES = getImages(xmlData, "media:thumbnail");
    
    for (let i = 0; i < TITLES.length;i++) {
        let card = document.createElement("div");
        let header = document.createElement("div");
        let title = document.createElement("h4");
        let link = document.createElement("a");
        let author = document.createElement("p");
        let date = document.createElement("p");
        let image = document.createElement("img");
        let body = document.createElement("div");

        $(card).addClass("card m-3");
        $(card).css(darkMode ? card_dark : card_light);
    
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
        $(body).html(`${CATEGORIES[i]}<div class="container"></div>${formatDescriptionText(DESCRIPTIONS[i])}`);

        $(image).addClass("card-img-top");
        $(image).attr("src", $(IMAGES[i]).attr("url"));

        $(card).append(image);
        $(card).append(header);
        $(card).append(body);
        $("#post-container").append(card);
    } 
}


//ThreatPost post construction
function constructThreatPostData (xmlData) {
    const TITLES = getTagData(xmlData, "title", 2)
    const DESCRIPTIONS = getTagData(xmlData, "description", 1);
    const DATES = getTagData(xmlData, "pubDate", 0);
    const LINKS = getTagData(xmlData, "link", 2);
    const IMAGES = getImages(xmlData, "media:content");

    for (let i = 0; i < TITLES.length;i++) {
        let card = document.createElement("div");
        let image = document.createElement("img");
        let header = document.createElement("div");
        let title = document.createElement("h4");
        let link = document.createElement("a");
        let date = document.createElement("div");
        let body = document.createElement("div");

        $(card).addClass("card m-3");
        $(card).css(darkMode ? card_dark : card_light);
    
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
        $(image).attr("src", $(IMAGES[(i + 1) * 4 ]).attr("url"));

        $(card).append(image);
        $(card).append(header);
        $(card).append(body);
        $("#post-container").append(card);
    }  
}
