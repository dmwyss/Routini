var g_sImgBase = "img/";
function showNav(){
	var aas = [
		{"id":1, "label":"MyDojang", "url":"routini2.5.0.htm"}
		, {"id":2, "label":"Settings", "url":"routini2.5.0.settings.htm"}
	];
	var tagNav = document.getElementById("area-nav");
	var sOut = "";

	sOut += "<div class=\"navFoot-spaceReplacer\">&nbsp;</div>";
	sOut += "<div class=\"navFoot-wrapper\">";

	sOut += "";
	for(var iE = 0; iE < aas.length; iE++){
		sOut += "<div class=\"navFoot-item\" onclick=\"document.location = \'";
		sOut += aas[iE].url + "?stamp=";
		sOut += Math.round(Math.random()* 10000);
		sOut += "\'\">";
		sOut += "<img src=\"" + g_sImgBase + "imgIKwonDo_logoGrey00.png\" class=\"\"/><br>";
		sOut += "";
		sOut += "";
		sOut += "";
		sOut += "" + aas[iE].label;
		sOut += "&nbsp;";
		sOut += "</div>";
	}
	sOut += "";
	sOut += "";
	sOut += "</div>";
	tagNav.innerHTML = sOut;
}

function showMainContent(){
	var tagOut = document.getElementById("areaMainContent");
	if(!tagOut){
		return;
	}
	var sOut = "";
	sOut += "<div class=\"navtable-blockWrapper\">\n";
	sOut += "<div class=\"navTable-rowTop rhWhite\">Training Times</div>\n";
	sOut += "<div class=\"navTable-row\">\n";
	sOut += "<div class=\"navTable-rowHead\">\n";
	sOut += "Adult White Belt";
	sOut += "</div>\n";
	sOut += "<div class=\"navTable-rowDetail\">\n";
	sOut += "7:30pm Thursday";
	sOut += "</div>\n";
	sOut += "</div>\n";
	sOut += "<div class=\"navTable-rowBottom\">\n";
	sOut += "<div class=\"navTable-rowHead\">\n";
	sOut += "Adult White Belt";
	sOut += "</div>\n";
	sOut += "<div class=\"navTable-rowDetail\">\n";
	sOut += "7:30pm Thursday";
	sOut += "</div>\n";
	sOut += "</div>\n";
	sOut += "</div>\n";
	sOut += "<br/>\n";
	sOut += "";	
	tagOut.innerHTML = sOut;
}

function doOnLoad(){
//alert("page[" + document.location.src + "]");
	showMainContent();
	showNav();
}
