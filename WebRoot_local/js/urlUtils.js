

function getQueryStringParameter(sParamName, sDefault){
	if(typeof sDefault == "undefined"){
		sDefault = "";
	}
	var sLocCurr = window.location.href;
	var iPosQ = sLocCurr.indexOf("?");
	if(iPosQ == -1){
		return sDefault;
	}
	var sQS = sLocCurr.substring(iPosQ + 1); 
	var asQS = sQS.split("&");
	//a lert("loc " + sQS + " as loc [" + asQS.join("\n") + "]");
	for(var iE = 0; iE < asQS.length; iE++){
		var sElemTemp = asQS[iE];
		if(sElemTemp.indexOf(sParamName + "=") == 0){
			return sElemTemp.substring(sElemTemp.indexOf("=") + 1);
		}
	}
	return sDefault;
}