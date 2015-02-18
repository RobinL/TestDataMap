//https://github.com/Leaflet/Leaflet.markercluster
//http://consumerinsight.which.co.uk/maps/hygiene
//


var FSA_APP = {}



$(function() {

    createMap()

    $(".checkbox").change(function() {
        showHideLayers(this)
    })

    promise1 = $.get('topo_json/eer.json', addGeoJson, 'json');

    generateMarkers()

    Promise.all([promise1]).then(showHideLayers)
 

})


function showHideLayers(click_object) {

    layersArr = []
    layersArr.push({
        "selector": "#prosecutions",
        "layer": FSA_APP.layers.markers
    })
    layersArr.push({
        "selector": "#local_authorities",
        "layer": FSA_APP.layers.local_authorities
    })
    layersArr.push({
        "selector": "#FHRS_score",
        "layer": FSA_APP.layers.FHRS_circles
    })


    for (var i = 0; i < layersArr.length; i++) {
        //Has it been added to map yet?
        debugger;

        var d = layersArr[i]
        if ($(d["selector"]).is(':checked')) {
            FSA_APP.map.addLayer(d["layer"])
        } else {
            FSA_APP.map.removeLayer(d["layer"])
        }

    };




}


function addGeoJson(geoData) {

    FSA_APP.layers.local_authorities = L.geoJson(geoData, {
        style: style,
        onEachFeature: bindFunction
    })

    function bindFunction(feature, layer) {
        layer.bindPopup(feature.properties.EER13NM);
    }

    function style(feature) {
        return {
            "weight": feature.properties.EER13NM.length / 8
        }

    }

    FSA_APP.layers.local_authorities.addTo(FSA_APP.map);
    map.removeLayer(FSA_APP.layers.local_authorities)

}


function generateMarkers() {

    m = []
    m.push(L.marker([51.5, -0.09])
        .bindPopup('This is one of the businesses'))

    m.push(L.marker([51.5, -0.10])
        .bindPopup('This is another of the businesses'))

    FSA_APP.layers.markers = L.featureGroup(m)
        .addTo(map)
    map.removeLayer(FSA_APP.layers.markers)


}

function createMap() {

    FSA_APP.map = L.map('map').setView([51.505, -0.09], 5);
    map = FSA_APP.map
    // map.locate({
    //     setView: true,
    //     maxZoom: 8
    // });



    FSA_APP.layers = {}
    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    }).addTo(map);

    highlightMapCentre()

}

function highlightMapCentre() {

    pix = FSA_APP.map.latLngToLayerPoint([51.505, -0.09])
    $(document.elementFromPoint(pix[0], pix[1])).click();


}