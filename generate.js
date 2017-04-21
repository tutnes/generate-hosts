
var csvSettings = {
            headerRow: 0,
            firstDataRow: 1,
            delimiter: ",",
            headerRowValue: "",
            key: "Host Name" //Key before the mapping is done
        };
var csvMapping = {
            "Host Name" : "name",
            "FQDN" : "address"
        };


var CSVSerializer = require('./classes/csvserializer.js');
var inputFile = process.argv[2];
var outputFile = process.argv[3];
var csvList = process.argv[4];

var fs = require('fs'),
    xml2js = require('xml2js');
const uuidV1 = require('uuid/v1');


var host = { '$':
     { id: uuidV1(),
       name: '',
       description: '',
       address: '',
       site: '17962df8-0e9e-4301-a3c9-9af508fb5839',
       hostgroup: 'a5e3ac7c-37ef-4e4c-b6a0-f8cae3d43e93',
       usethresholds: 'false',
       fqdn: '',
       useprocessconfigs: 'false' },
    processconfigs: [ '' ] };

var parsedData = new CSVSerializer({
                    csvSettings: csvSettings,
                    csvMapping: csvMapping
});


function openFile (file) {
    var d;
    try {
        d = fs.readFileSync(file,"utf8");
        }catch(er){
        console.log("Could not find the file: " + file);
    }
        return d;
}



var parser = new xml2js.Parser();
var builder = new xml2js.Builder();
fs.readFile(__dirname + '/' + inputFile, function(err, data) {
    parser.parseString(data, function (err, result) {
        var site = result.dynatrace.hosts[0].host[0].$.site;
        


        csvRaw = openFile(__dirname + '/' + csvList);
        //console.log(csvRaw);
        let csvParsed = parsedData.parse(csvRaw);
        for (key in csvParsed) {
            
        }
        
        //var hostgroup = findIdWithName(result.dynatrace.hostgroups[0].hostgroup,hostgroupName);
        
        
               
        var xml = builder.buildObject(result);
        fs.writeFile(__dirname + '/' + outputFile, xml, function(err, data) {
            if(err) {
                console.log(err);
            }
        });
        
        
    });
});



//Takes an data object and Name as parameters
function findIdWithName (d, name) {
    //console.log(d);
    var id = "No ID Found";
    for (let i = 0; i < d.length; i++) {
        console.log(d[i].$.name)
        if (d[i].$.name == name) {
            id = d[i].$.id;
        }
    }
    return id;
}





