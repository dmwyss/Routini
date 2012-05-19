
function DateConstantsObject(){
	this.monthsShort = new Array("jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec");
	this.daysShort = new Array("sun", "mon", "tue", "wed", "thu", "fri", "sat");
	this.daysFull = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
}

function formatToLength(iIn, iLength){
    if(typeof iIn == "undefined"){
        iIn = 0;
    }
    var sIn = "" + iIn;
    if(sIn == ""){
        sIn = "0";
    }
    var sOut = sIn;
    while (sOut.length < iLength) {
    	sOut = "0" + sOut;
	}
    return sOut;
}

/**
 * Get a formatted date as int.
 * @param dtToShow Date to show. If no date passed, uses today.
 * @return Date like 20110321
 */
function getDateAsInt(dtToShow){
	if(typeof dtIn == "undefined"){
		dtToShow = new Date();
	}
	var iOut = dtToShow.getFullYear() * 10000;
	iOut += (dtToShow.getMonth() + 1) * 1000;
	return iOut + dtToShow.getDate();
}

var DateConstants = new DateConstantsObject();
