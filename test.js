var context = require("./DataModelsAPI/controllers/functions/context");
var fetch = require("node-fetch");
var zoneM = require("./DataModelsAPI/models/zone.model")
var ngsi = require("ngsi-parser")
var cb = require('ocb-sender')
cb.config('http://200.23.5.142:1026/v2')

var create = (data) => {

        var tempLocation = [];
        data.location.map((coors) => {
            let latitude = coors[0];
            let longitude = coors[1];
            tempLocation.push([longitude, latitude])
        })
        
        data.location  = {
            value: {
                type: "Polygon",
                coordinates: [  tempLocation  ]
            },
            type: "geo:json"
        }
        delete data.centerPoint
        createEntity("Zone", data, (status, entity) => {
            if(status){
                console.log(entity)
            }
            else{
                console.log(entity)
            }
        })
} 

var createEntity = (type, json, callback) => {
    json["id"] = json[`id${type}`]
        delete json[`id${type}`] ;
        delete json["status"]
        json["dateCreated"] = new Date(json.dateCreated),
        json["dateModified"] = new  Date(json.dateModified)	
        let NGSIentity = ngsi.parseEntity(json)
        cb.createEntity(NGSIentity)
            .then((result) => {
                callback(result.status, NGSIentity);
            })
            .catch((err) => {
                callback(false, {message: err});
            })
}

var createZone = ()=>{
	let type = "Zone";
	//body[`id${type}`] = `${type}_${Date.now()}`;
    zoneM.findAll({status : 1})
    .then((result)=> {
		result.map((zone) =>{
			let json = zone.get({
				plain: true
			})
			json["name"] = json["owner"];
            json["refBuildingType"] = "Zone";
			create(json);
        })  
    });	
}

var deleteZones = ()=>{

    cb.getEntityListType("Building")
    .then(async zones => {
        await zones.map(async zone =>{
            var zoneid = zone["id"];
            console.log("Deleting ->" + zone["id"])
            delete zone["id"];
            delete zone["type"];
            await cb.deleteEntity(zoneid)
            .then(console.log)
            .catch(console.log)
        })
    })
    
}

//deleteZones();

createZone();

/*var j = require("./test.json")

var tempj = [];

j.location.value.coordinates.map(tuple => {
    console.log(tuple)
    var t = [];
    t.push(tuple[1])
    t.push(tuple[0])
    tempj.push(t)
})

console.log(tempj)

j.location.value.coordinates = tempj;
*/
