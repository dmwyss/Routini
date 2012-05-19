

function trim(sIn){
	return trimStart(trimEnd(sIn));
}

function trimStart(sIn){
	while(sIn.charAt(0) == " "){
		sIn = sIn.substring(1);
	}
	return sIn;
}

function trimEnd(sIn){
	while(sIn.charAt(sIn.length - 1) == " "){
		sIn = sIn.substring(0, sIn.length - 2);
	}
	return sIn;
}

function toLeadUppercase(sIn){
	sIn = "" + sIn;
	return sIn.charAt(0).toUpperCase() + sIn.substring(1);
}

