
function parseIntSafe(vIn, iDefault){
	if (typeof iDefault == "undefined") {
		iDefault = 0;
	}
	if (typeof iDefault == "undefined") {
		return iDefault;
	}
	if(isNaN(vIn)) {
		return iDefault;
	}
	if(typeof vIn == "string"){
		while((vIn.length > 1) && (vIn.charAt(0) == "0")){
			vIn = vIn.substring(1);
		}
	}
	return parseInt(vIn);
}