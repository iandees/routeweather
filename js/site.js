var findme_map = L.map('map')
    .setView([37.7, -97.3], 3),
    osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = 'Map data © OpenStreetMap contributors',
    osm = L.tileLayer(osmUrl, {minZoom: 2, maxZoom: 18, attribution: osmAttrib}).addTo(findme_map),
    category_data = [];

var findme_marker = L.marker([0,0], {draggable:true}).addTo(findme_map);
findme_marker.setOpacity(0);

if (location.hash) location.hash = '';

$("#find").submit(function(e) {
    e.preventDefault();
    $("#couldnt-find").hide();
    var address_to_find = $("#address").val();
    if (address_to_find.length === 0) return;
    var qwarg = {
        format: 'json',
        q: address_to_find
    };
    var url = "http://nominatim.openstreetmap.org/search?" + $.param(qwarg);
    $("#findme h4").text("Searching...");
    $("#findme").addClass("loading");
    $.getJSON(url, function(data) {
        if (data.length > 0) {
            var chosen_place = data[0];
            console.log(chosen_place);

            var bounds = new L.LatLngBounds(
                [+chosen_place.boundingbox[0], +chosen_place.boundingbox[2]],
                [+chosen_place.boundingbox[1], +chosen_place.boundingbox[3]]);

            findme_map.fitBounds(bounds);

            findme_marker.setOpacity(1);
            findme_marker.setLatLng([chosen_place.lat, chosen_place.lon]);

            $('#instructions').html('We found it! Click and drag the marker to sit on your business, then you are ready to <a href="#details">add details to your business listing</a>.');
            $('.step-2 a').attr('href', '#details');
        } else {
            $('#instructions').html('<strong>We couldn\'t find your address.</strong> Try searching for your street or city without the address.');
        }
        $("#findme").removeClass("loading");
    });
});

