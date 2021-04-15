var year = undefined;
var launch_success = false;
var landing_success = false;

$(document).ready(function () {
    init();
});

function init() {
    getData({});
    createButtons();
    clearFilters();
}

function getDataByYear($event) {
    $(".something").removeClass("highlight");
    $(this).addClass("highlight");
    year = $event.innerHTML;
    let filters = { year: year};
    launch_success ? filters.launch_success = true : filters;
    landing_success ? filters.landing_success = true : filters;
    getData(filters);
}

function getDataByLaunch($event) {
    launch_success = $.parseJSON($event.innerHTML.toLowerCase());
    if (launch_success) {
        $('#launch-true').addClass('highlight');
    } else {
        $('#launch-false').removeClass('highlight');
    }
    let filters = {};
    launch_success ? filters.launch_success = true : filters;
    landing_success ? filters.landing_success = true : filters;
    if (year != undefined) {
        filters.year = year;
    }
    getData(filters);
}

function getDataByLanding($event) {
    landing_success = $.parseJSON($event.innerHTML.toLowerCase());
    if (landing_success) {
        $('#landing-true').addClass('highlight');
    } else {
        $('#landing-false').removeClass('highlight');
    }
    let filters = {};
    launch_success ? filters.launch_success = true : filters;
    landing_success ? filters.landing_success = true : filters;
    if (year != undefined) {
        filters.year = year;
    }
    getData(filters);
}

function getData(dataSet) {
    let params = Object.keys(dataSet).length > 0 ? dataSet : {};
    $.ajax("https://api.spacexdata.com/v3/launches?limit=100", {
        type: "GET",
        dataType: "json",
        data: params,
        success: function (data) {
            createCard(data);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });
};

function clearFilters() {
    $('.something').removeClass("highlight");
    $('.launch-success').removeClass("highlight");
    $('.landing-success').removeClass("highlight");
    year = undefined;
    launch_success = false;
    landing_success = false;
}

function createButtons() {
    let date = new Date();
    let year = date.getFullYear();
    let years = [];
    for (let i = year; i > year - 16; i--) {
        years.push(i);
    }
    for (var i = years.length; i > 0; i--) {
        var buttons = $('<button class="something">' + years[i] + '</button>')
        buttons.appendTo('#years');
    }
    $('.something').on('click', function () {
        getDataByYear(this);
    });
}

function createCard(dataSet) {
    $('#data-container').empty();
    for (let data in dataSet) {
        let obj = dataSet[data];
        let displayImage = obj.links.mission_patch;
        let cardTitle = obj.mission_name + ' #' + obj.flight_number;
        let missionIds = obj.mission_id.length > 0 ? obj.mission_id : "No Ids";
        let launchYear = obj.launch_year;
        let launchSuccess = obj.launch_success;

        let $div = $("<div>", { class: "box" })
        $div.append(
            $('<div/>', { 'class': 'box-wrap' }).
                prepend($('<img>', { id: 'theImg', src: displayImage, width: "100%" }))
                .append($('<h4>', { class: "mission-title", text: cardTitle }))
                .append($('<span>', { class: "mission-id", text: missionIds }))
                .append($('<p>', { text: launchYear })
                    .prepend($('<span>', { class: "launch-year", text: "Launch Year: " })))
                .append($('<p>', { text: launchSuccess })
                    .prepend($('<span>', { class: "launch-success", text: "Successful Launch: " })))
                .append($('<p>', { text: "" })
                    .prepend($('<span>', { class: "launch-landing", text: "Successful Landing: " })))
        );

        $("#data-container").append($div);
    }
}