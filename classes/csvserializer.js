"use strict";
class CSVSerializer {
	constructor(options) {
		this.data = {};
		if (options) {
			this.csvMapping = options.csvMapping;
			this.csvSettings = options.csvSettings;
		} else {
			this.csvSettings = {
				headerRow: 0, //Remember this starts on 0
				firstDataRow: 1, //Remember this starts on 0
				delimiter: ",",
				headerRowValue: [],
				key: "",
			};
		}
	}
	parse(d) {
		var csvLine, currentKey, headerLength;
		//Removes \r from windows and splits based on \n also remoes # and #(whitespace)
		try {
			d = d.replace(/\r/g, "").replace(/# /g, "").replace(/"/g, "").replace(/#/g, "").split("\n");
		} catch (err) {
			console.log(err);
		}
		//Creates an array of the headerRow
		this.csvSettings.headerRowValue = d[this.csvSettings.headerRow].split(this.csvSettings.delimiter);
		headerLength = this.csvSettings.headerRowValue.length;
		//If there is a defined key we want to map by
		if (this.csvSettings.key) {
			this.csvSettings.keyNumber = this.csvSettings.headerRowValue.indexOf(this.csvSettings.key);
		} else {
			this.csvSettings.keyNumber = -1;
		}
		//Loops through and maps the headlines to the values		
		if (this.csvMapping) {
			for (let i = 0; i < headerLength; i++) {
				if (this.csvSettings.headerRowValue[i] in this.csvMapping) {
					this.csvSettings.headerRowValue[i] = this.csvMapping[this.csvSettings.headerRowValue[i]];
				}
			}
		}
		for (let i = this.csvSettings.firstDataRow; i < d.length; i++) {
			//Verifies that there is indeed data on the line
			if (d[i].length >= headerLength) { //Length of csvSettings.headerRow
				csvLine = d[i].split(this.csvSettings.delimiter);
				if (this.csvSettings.keyNumber > -1) {
					currentKey = csvLine[this.csvSettings.keyNumber];
				} else {
					currentKey = i;
				}
				this.data[currentKey] = {};
				for (let i = 0; i < headerLength; i++) {
					this.data[currentKey][this.csvSettings.headerRowValue[i]] = csvLine[i];
				}
			}
		}
		return this.data;
	}
}

module.exports = CSVSerializer;