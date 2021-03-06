
// INITIALIZATION OF THE MAP
var map = L.map("mapid").setView([0, -0], 2);

// MAPBOX STYLE ON THE MAP
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaGFpZGVlIiwiYSI6ImNqOXMwenczMTBscTIzMnFxNHVyNHhrcjMifQ.ILzRx4OtBRK7az_4uWQXyA', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiaGFpZGVlIiwiYSI6ImNqOXMwenczMTBscTIzMnFxNHVyNHhrcjMifQ.ILzRx4OtBRK7az_4uWQXyA'
}).addTo(map);

//GLOBAL VARIABLES 
var coordinatesConverted = []; 
var polylineArrayCoordinates = [];
var pointMap = [];
var idZoneSelected;
var editableLayers = new L.FeatureGroup();
var zone = null;

map.addLayer(editableLayers);

//DRAW CONTROLS OF MAP
var drawControl = new L.Control.Draw({
    position: 'topleft',
    draw: {
        marker: {
          icon: L.icon({
            iconUrl: '../static/css/images/marker-icon.png',
            shadowUrl: '../static/css/images/marker-shadow.png'
          })
        },
        polygon:{   
            shapeOptions: {
                color: '#ff6666'
            },        
            showArea: true
        },
        polyline: {
            shapeOptions: {
                color: '#008B8B',
                weight: 8
            }
        },
        circle: false,
        circlemarker: false
    },
    edit: {
        featureGroup: editableLayers, //REQUIRED!!
        edit: false
    }
});
map.addControl(drawControl);

//FUNCTION TO CONTROLS THE DRAWING OF A SHAPE.

map.on('draw:created', function (e) {
   var type = e.layerType;
   console.log(type);
   var layer = e.layer;
   if (type === 'marker'){
        console.log("CREANDO MARCADOR");
        let coordinates = layer.getLatLng();
        console.log(coordinates);
    }
    if (type === 'polygon') {
        console.log("CREANDO POLÍGONO");
        var polygon = layer.toGeoJSON();
        
        var polygonCoordinates = polygon['geometry']['coordinates'];
        //CONVERT COORDINATES [LON,LAT] GeoJSON IN [LAT,LON] COORDINATES.
        coordinatesConverted = [];
        for(let i=0; i<polygonCoordinates.length;i++){
          for(let j=0; j<polygonCoordinates[i].length;j++){
            coordinatesConverted.push([polygonCoordinates[i][j][1],polygonCoordinates[i][j][0]]);         
          }
        }
        zone = coordinatesConverted;
        console.log(JSON.stringify(polygon));
        console.log(polygonCoordinates);
        console.log("Coordenadas  [lat,long] del polígono ");
        console.log(coordinatesConverted);  
        //Obtiene el centro del poligono 

        layer.addTo(map)
        console.log(layer.getCenter())
    }
    if(type === 'polyline'){
        console.log("CREANDO POLILÍNEA");
        var polylineCoordinates = layer.getLatLngs();
        //CONVERT POLYLINE COORDINATES INTO ARRAY OF COORDINATES 
        polylineCoordinates.forEach(element => {
            polylineArrayCoordinates.push([element['lat'],element['lng']])
        });
        console.log(polylineCoordinates);
        console.log(polylineArrayCoordinates);
    }
    if(type === 'rectangle'){
        console.log("CREANDO RECTANGULO");
    }
   // Do whatever else you need to. (save to db; add to map etc)
   editableLayers.addLayer(layer);
   //drawnItems.addLayer(layer);
});


function searchZones(){
    fetch("https://smartsecurity-webservice.herokuapp.com/api/zone", {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Methods':'GET, POST, OPTIONS, PUT, PATCH, DELETE'
        },
    })
    .then((res) => res.json())
    .then((data)=> {
        console.dir(data)    
        data.forEach(element =>{
            $('#zoneReference').append($('<option>', {
                value: element['idZone'],
                text: element['name']
            })); 
        })
    })
}
$('#zoneReference').change(function() {
    idZoneSelected = $(this).val()
    //GET ALL INFORMATION OF A SPECIFIC ZONE
    fetch("https://smartsecurity-webservice.herokuapp.com/api/zone/"+idZoneSelected, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Methods':'GET'
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        map.setView(new L.LatLng(data['centerPoint'][0], data['centerPoint'][1]), 18);
        polyline = L.polyline(data['location'], {color: '#ff6666'}).addTo(map);
    })
});
// FUNCTION TO CLEAR THE ADDRESS INPUT OF ZONE
function clearAddress(){
    $("#zoneAddress").val("");    
    map.setView(new L.LatLng(0,0), 2);
    return;
}
//FUNCTION TO CLEAR THE ALL THE INPUTS OF ZONE  
function clearInputsZone(){
    $("#zoneName").val("");
    $("#zoneAddress").val("");    
    $('select[name=zoneCategories]').val("select an option");
    $('#zoneDescription').val("");
    map.setView(new L.LatLng(0,0), 2);
    return;
}

// FUNCTION TO SAVE THE ZONE INFORMATION
function saveZone(){
    let zone = {
        name: $("#zoneName").val(),
        address:  $("#zoneAddress").val(),
        description: $('#zoneDescription').val(),
        centerPoint: pointMap,
        location: coordinatesConverted
    };
    console.log(zone);
    fetch("https://smartsecurity-webservice.herokuapp.com/api/zone", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods':'POST, OPTIONS'
        },
        body : JSON.stringify(zone)
    })
    .then((respuesta) => {
        if(respuesta.status != 201){
            alert("An error has ocurred to save the subzone entity");
            clearInputsZone();
        }
        else{
            console.log(respuesta);
            alert("Zone save successfully");
            clearInputsZone();
        }
    })
    return;
}

//CODE OF MAP VIEWER ADD

var loadZonesOnMap = () =>{
    fetch("https://smartsecurity-webservice.herokuapp.com/api/zone?status=1", {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Methods':'GET'
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        data.map((zone) => {
            map.setView(new L.LatLng(zone['centerPoint'][0], zone['centerPoint'][1]), 18);
            L.polygon (zone['location'], {color: '#34495e'}).addTo(map);
        });
        
    })
}

var loadRoadSegments = () =>{
    fetch("https://smartsecurity-webservice.herokuapp.com/api/roadSegment?status=1", {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Methods':'GET'
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        data.map((roadSegment) => {
            L.polyline (roadSegment['location'], {color: '#27ae60'}).addTo(map);
        });
        
    })
}


var loadParkings = () =>{
    fetch("https://smartsecurity-webservice.herokuapp.com/api/parking?status=1", {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Methods':'GET'
        },
    })
    .then((res) => res.json())
    .then((data) => { 
        console.log(data)
        data.map((parking) => {
            L.polyline (parking['location'], {color: '#2980b9'}).addTo(map);
        });
        
    })
}

///DINAMIC CONSULT OF ROADS OF OSM WITH OVERPASS API

var buildOverpassApiUrl =  (overpassQuery, coord) =>  {
    var bounds =map.getBounds().getSouth() + ',' + map.getBounds().getWest() + ',' + map.getBounds().getNorth() + ',' + map.getBounds().getEast();
    var wayQuery = 'way[' + overpassQuery + '](' + bounds + ');';
    var query = '?data=[out:json][timeout:15];('  + wayQuery  + ');out body geom; out skel qt;';
    var baseUrl = 'https://overpass-api.de/api/interpreter';
    var resultUrl = baseUrl + query;
    console.log(resultUrl)
    return resultUrl;
}

var convertOSMCoordinates = (coords) =>{
    var temp = []
    coords.map((coor)=>{
        temp.push([coor.lat, coor.lon])
    })
    return temp
}

//FUNCTION TO SEARCH THE ADDRESS SPECIFIED.
function searchAddress(){
    $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent($("#zoneAddress").val()) + "&key=AIzaSyDCflB_l_yiXG9F29g65Q33boBrCJTepmM", function(data){
        if (data.status !== "OK") { 
            throw new Error("Unable to geocode address"); 
        }
        else{
            pointMap[0] = data.results[0].geometry.location.lat;
            pointMap[1] = data.results[0].geometry.location.lng;
            console.log(pointMap)
            map.setView(new L.LatLng(pointMap[0], pointMap[1]), 18);          
        }
    });
    if(pointMap){
        return pointMap;
    }  
}

var drawRoads = () =>{
    var overpassQuery =  buildOverpassApiUrl("highway")

    fetch(overpassQuery, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Methods':'GET'
        },
    })
    .then((res) => res.json())
    .then((data) => { 
        let a = 0;
        data.elements.map((way)=>{
           
            if (way.geometry){
                a++;
                
                console.log(way.tags.name, a)
                console.log("COORDINATES", JSON.stringify(convertOSMCoordinates(way.geometry)))
                
                let poli = L.polyline (
                    convertOSMCoordinates(way.geometry),
                    {
                     color: "#"+(( 1<< 24) *Math.random() | 0 ).toString( 16 ),
                     weight: 6
                    }
                )
                .on('click', ()=> {
                    console.log("PREESS", a)
                })
                .addTo(map);

                if (way.tags.name){
                    poli.bindPopup(way.tags.name + a).openPopup();
                }

            }
        })
    })
    return;  

}


loadZonesOnMap()
loadRoadSegments()
loadParkings()

