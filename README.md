# generate-hosts
This is a tool to generate hosts for the infrastructure.config.xml in Dynatrace
It takes as input the original infrastructure.config file, the output file and then the csvlist with the hosts that it wants to add



Installation:
git clone the repo
npm install

## Usage:
node generate.js <original xmlfile> <output xml file> <csvfile>
## Example:
node generate.js infrastructure.config.original.xml infrastructure.config.xml serverlist.csv
