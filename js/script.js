const cds = {
    lat1: 26.478,
    lng1: 86.342,
    lat2: 25.542,
    lng2: 84.765
};
// var latDOM = document.getElementById('lat1');

//  latDOM.value = '26.45';
// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
    center: [26.345, 85.34],
    zoom: 7,
    zoomControl: true
});

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// const district = L.tileLayer.wms("http://localhost:8080/geoserver/wms?", {
//     layers: 'np:district',
//     format: 'image/png',
//     styles: 'district_css'
// }).addTo(map);

// const localWMS = L.tileLayer.wms("http://geoportal.ntnc.org.np/geoserver/ows?", {
//     layers: 'ntnc:Masked_Palm_civet1',
//     format: 'image/png',
//     // version: '1.1.0',
//     srs: 'EPSG:4326',
//     transparent: true
// }).addTo(map);

var myIcon = L.icon({
    iconUrl: 'image/marker.jpg',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    // shadowUrl: 'my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

const startPt = L.marker([cds['lat1'], cds['lng1']]).addTo(map).bindPopup('Start Point');
const endPt = L.marker([cds['lat2'], cds['lng2']]).addTo(map).bindPopup('End Point');

var from = turf.point([cds['lng1'], cds['lat1']]);
var to = turf.point([cds['lng2'], cds['lat2']]);
var options = { units: 'kilometers' };

var distance = turf.distance(from, to, options);
console.log(distance);

var buffered = turf.buffer(from, 25, { units: 'kilometers' });
// console.log(buffered);

const bufferedGeoJSON = L.geoJSON(buffered).addTo(map);

const turfLine = turf.lineString([from.geometry.coordinates, to.geometry.coordinates], { name: 'Dist Line' });
// console.log(turfLine);

const leafLine = L.geoJSON(turfLine, {}).addTo(map);
leafLine.bindPopup(`The distance is ${distance.toFixed(2)} km`);

const startBtn = document.getElementById('stPoint');
const endBtn = document.getElementById('endPoint');
const calculateBtn = document.getElementById('submit');
const resetBtn = document.getElementById('reset');


startBtn.addEventListener('click', function () {
    try{
        map.removeLayer(startMark);
    }
    catch(err){
        alert(`${err.message}`);
    }

    map.on('click', function (e) {
        startPoint = e.latlng;
        alert(e.latlng);
        document.getElementById('lat1').value = startPoint.lat;
        document.getElementById('lng1').value = startPoint.lng;
        startMark = L.marker([startPoint.lat, startPoint.lng]).addTo(map).bindPopup('Starting Point');
        map.off('click');
    })
});


endBtn.addEventListener('click', function () {
    alert('Click on the map to select the start point');

    map.on('click', function (e) {
        startPoint = e.latlng;
        alert(e.latlng);
        document.getElementById('lat2').value = startPoint.lat;
        document.getElementById('lng2').value = startPoint.lng;
        endMark = L.marker([startPoint.lat, startPoint.lng]).addTo(map).bindPopup('End Point');
        map.off('click');
    })
});

calculateBtn.addEventListener('click', function () {
    const lat1 = document.getElementById('lat1').value;
    const lng1 = document.getElementById('lng1').value;
    const lat2 = document.getElementById('lat2').value;
    const lng2 = document.getElementById('lng2').value;

     var from = turf.point([lng1,lat1]);
     var to = turf.point([lng2,lat2]);
     var options = { units: 'kilometers' };

     var distance = turf.distance(from, to, options);
     alert(`The distance between to points is ${distance}`);
});

resetBtn.addEventListener('click',function(){
    try{
        endMark.remove();
        startMark.remove();
        document.getElementById('lat1').value = '';
        document.getElementById('lng1').value= '';
        document.getElementById('lat2').value= '';
        document.getElementById('lng2').value= '';
    }
    catch(err){

    }
    
});