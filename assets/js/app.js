let topics = ["gaming", "music", "memes", "blue's clues"];
let topic = "funny";
let gifCount = 0;

// BASE FUNCTIONS

const renderButtons = (arr) => {
    $("#button-row").empty();
    arr.forEach(topic => {
        let button = $("<button>");
        button.text(properCaps(topic));
        button.addClass("gif-button");
        $("#button-row").append(button);
    });
}

const renderGifs = (topic) => {
    $("#gif-box").empty();
    let queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        topic + "&api_key=haVSu9TJ8zunlxRguWBhTX0DCnK6pnQG&limit=10";

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        // After data comes back from the request
        .then(function (response) {
            console.log(queryURL);

            console.log(response);
            // storing the data from the AJAX request in the results
            let results = response.data;

            // Looping through each result item
            for (let i = 0; i < results.length; i++) {

                // Set basic letiables
                let pauseImg = results[i].images.fixed_height_still.url;
                let playImg = results[i].images.fixed_height.url;
                let rating = results[i].rating.toUpperCase();
                let title = properCaps(results[i].title);
                let score = results[i]._score

                // Creating and storing a div tag
                let gifDiv = $("<div>");

                gifDiv.addClass("gif");

                // Creating a paragraph tag with the result item's rating
                let attribs = $("<div>");
                attribs.addClass("attrDiv");
                attribs.append("<p> Title: "+ title + "</p>");
                attribs.append("<p> Rating: "+ rating + "</p>");
                attribs.append("<p> Score: "+ score + "</p>");

                let faveBtn = $("<button>");
                faveBtn.append("<span class='fa fa-heart'></span>");
                faveBtn.addClass("addFave");
                faveBtn.attr("data-play",playImg);

                // Creating and storing an image tag
                let gifImage = $("<img>");
                // Setting the src attribute of the image to a property pulled off the result item
                gifImage.attr("src", pauseImg);
                gifImage.attr("data-pause", pauseImg);
                gifImage.attr("data-play",playImg);
                gifImage.attr("data-state","pause")
                gifImage.addClass("gifImage");

                gifDiv.append(gifImage);
                gifDiv.append(attribs);
                gifDiv.append(faveBtn);

                $("#gif-box").append(gifDiv);
            }
        });
};

const searchGifs = (input) => {
    topic = input.toLowerCase();
    gifCount = 10;
    if(topics.includes(topic)===false){
        topics.push(topic);
    }
    renderButtons(topics);
    renderGifs(topic);
};

const moreGifs = (topic) => {
    gifCount+=10;
    let queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    topic + "&api_key=haVSu9TJ8zunlxRguWBhTX0DCnK6pnQG&limit="+
    gifCount;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    // After data comes back from the request
    .then(function (response) {
        console.log(queryURL);

        console.log(response);
        // storing the data from the AJAX request in the results
        let results = response.data;
        console.log(gifCount)

        // Looping through each result item
        for (let i = gifCount-10; i < results.length; i++) {

            // Set basic letiables
            let pauseImg = results[i].images.fixed_height_still.url;
            let playImg = results[i].images.fixed_height.url;
            let rating = results[i].rating;
            let title = properCaps(results[i].title);
            let score = results[i]._score

            // Creating and storing a div tag
            let gifDiv = $("<div>");

            gifDiv.addClass("gif");

            // Creating a paragraph tag with the result item's rating
            let attribs = $("<div>");
            attribs.addClass("attrDiv");
            attribs.append("<p> Title: "+ title + "</p>");
            attribs.append("<p> Rating: "+ rating + "</p>");
            attribs.append("<p> Score: "+ score + "</p>");

            let faveBtn = $("<button>");
            faveBtn.append("<span class='fa fa-heart'></span>");
            faveBtn.addClass("addFave");
            faveBtn.attr("data-play",playImg);

            // Creating and storing an image tag
            let gifImage = $("<img>");
            // Setting the src attribute of the image to a property pulled off the result item
            gifImage.attr("src", pauseImg);
            gifImage.attr("data-pause", pauseImg);
            gifImage.attr("data-play",playImg);
            gifImage.attr("data-state","pause")
            gifImage.addClass("gifImage");

            gifDiv.append(gifImage);
            gifDiv.append(attribs);
            gifDiv.append(faveBtn);

            $("#gif-box").prepend(gifDiv);
        }
    });
};

const addFavorite = (url) => {
    // $("#favorites").empty();
    let faveImg = $("<img>");
    faveImg.attr("src",url);
    $("#favorites").prepend(faveImg);
};

// UTILITY FUNCTIONS
const properCaps = (str) => {
    if (typeof str !== 'string') return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
};


// RUNTIME

searchGifs(topic);


// LISTENERS

// search new gif topic
$(".search-btn").on("click",function(){
    searchGifs($("#search-box").val());
    $("#search-box").val('');
});

$(".more-btn").on("click",function(){
    moreGifs(topic);
});

$(document).on("click",".addFave",function(){
    addFavorite($(this).attr("data-play"));
});

$(document).on("click",".gif-button",function(){
    topic = $(this).text();
    searchGifs(topic);
});

$(document).on("click",".gifImage",function(){
    var state = $(this).attr("data-state");
    if(state === "pause"){
        $(this).attr("src", $(this).attr("data-play"));
        $(this).attr("data-state", "play");
    } else {
        $(this).attr("src", $(this).attr("data-pause"));
        $(this).attr("data-state", "pause");
    }
});