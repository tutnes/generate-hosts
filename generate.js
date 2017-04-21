
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
var uuidV4 = require('uuid/v4');


var hostTemplate = { '$':
     { id: "",
       name: '',
       description: '',
       address: '',
       site: '',
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
        // Sets the site to the same as the first host in the inputfile
        var site = hostTemplate.$.site = result.dynatrace.hosts[0].host[0].$.site;
        // Finds the 
        var hostgroup = findIdWithName(result.dynatrace.hostgroups[0].hostgroup,"Default");
        csvRaw = openFile(__dirname + '/' + csvList);
        
        let csvParsed = parsedData.parse(csvRaw);
        
        for (let key in csvParsed) {
            result.dynatrace.hosts[0].host.push({ '$':
             { id: uuidV4(),
               name: csvParsed[key].name,
               description: '' ,
               address: csvParsed[key].address,
               site: site,
               hostgroup: hostgroup,
               usethresholds: 'false',
               fqdn: '',
               useprocessconfigs: 'false' },
            processconfigs: [ '' ] });
        }
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





