var g_eventManager = null;
var g_sBaseLocation = "";
var g_iSecondsBetweenRefreshes = 15;

function Event(){
	this.id = g_eventManager.getNextTaskId();
	this.tstart = "";
	this.tstartInt = 0;
	this.tend = "";
	this.tendInt = 0;
	this.color = "";
	this.minutesUntilNext = 0;
	this.getEventTimeStatus = function(iNow){
		//alert(iNow);
		//tstartInt = getAsMinutes(this.tstart);
		if(iNow < this.tstartInt){
			sOut = "before"; // Not happened yet
		} else if(iNow >= this.tendInt){
				sOut = "after"; // Already happened
		} else {
			sOut = "current"; // Happening now
		}
		return sOut; // + " now" + iNow + " starg:" + this.tstartInt + " end:" + this.tendInt + "";
	};
	this.tasks = new Array();
	this.addTask = function(taskToAdd){
		this.tasks[this.tasks.length] = taskToAdd;
	};
}

function Task(){
	this.id = g_eventManager.getNextTaskId();
	this.title = "";
	this.isDone = false;
	this.isGap = function(){
		return (this.title == "");
	}
}

function EventManager(){
	this.timeblocks = new Array();
	this.iLastTimeBlockDisplayedAsCurrent = -1;
	this.iLastTaskId = 99;
	this.getNextTaskId = function(){
		this.iLastTaskId++;
		return this.iLastTaskId;
	}
	this.setTimeInts = function(){
		for ( var iTB = 0; iTB < this.timeblocks.length; iTB++) {
			var tb = this.timeblocks[iTB];
			tb.tstartInt = getAsMinutes(tb.tstart);
			tb.tendInt = getAsMinutes(tb.tend);
		}
		
		
		for(var iTBReverse = (this.timeblocks.length - 1); iTBReverse > 0 ; iTBReverse--) {
			var tbNext = this.timeblocks[iTBReverse];
			var tbThis = this.timeblocks[iTBReverse - 1];
			//tbThis.tstartInt = getAsMinutes(tb.tstart);
			var iTbThisEndOld = tbThis.tendInt;
			if(tbThis.tendInt == 0){
				tbThis.tendInt = tbNext.tstartInt;
			} else {
				tbThis.tendInt = Math.min(tbThis.tendInt, tbNext.tstartInt);
			}
			// If there is a gap, put a fake one in...
			if(tbThis.tendInt < tbNext.tstartInt){
				tbThis.minutesUntilNext = tbNext.tstartInt - tbThis.tendInt;
				var evtNew = new Event();
				var taskToAdd = new Task(); //taskToAdd.title = "";
				evtNew.addTask(taskToAdd);
				evtNew.tstartInt = tbThis.tendInt;
				evtNew.tstart = getAsHoursMinutesString(tbThis.tendInt);
				evtNew.tendInt = tbNext.tstartInt;
				evtNew.tend = getAsHoursMinutesString(tbNext.tstartInt);
				this.timeblocks.splice(iTBReverse, 0, evtNew);
			}
			

			if(iTbThisEndOld != tbThis.tendInt){
				// End time has been changed.
				tbThis.tend = getAsHoursMinutesString(tbThis.tendInt);
			}
		}
		
		
		//return sOut;
	};
	
	this.getNowInMinutes = function(){
		var dtNow = new Date();
		return (dtNow.getHours() * 60) + dtNow.getMinutes();
	}
	
	this.getTimeblocksAsHtml = function(){
		this.setTimeInts();
		var sOut = "";

		sOut += "<div id=\"areaRoutiniHeader\" class=\"timeblockWrapper timeblockHeader\" onclick=\"toggleRoutiniImage();\">&nbsp;Routini</div>"; // style=\"background-color:" + tb.color + "\">";
		
		var iNow = this.getNowInMinutes();
		
		//iNow = getAsMinutes("07:03");
		
		for ( var iTB = 0; iTB < this.timeblocks.length; iTB++) {
			sOut += this.decorateTimeblock(this.timeblocks[iTB], iNow);
		}
		return sOut;
	};
	
	
	this.decorateTimeblock = function(tb, iNow){
		var sOut = "";
		sOut += "<div class=\"timeblockWrapper timeblockStatus-" + tb.getEventTimeStatus(iNow) + "\">"; // style=\"background-color:" + tb.color + "\">";
		sOut += "<table class=\"timeBlock\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><td class=\"timeBlock-startTime\">";	
		sOut += tb.tstart;
		sOut += "</td><td class=\"timeBlock-tasks\">";
		//sOut += tb.tend;
		//sOut += "<br/>";
		//sOut += tb.getEventTimeStatus(iNow);
		//sOut += "<br/>";
		for ( var iT = 0; iT < tb.tasks.length; iT++) {
			if(tb.tasks[iT].isGap()){
				sOut += "<br/>";
			} else {
				sOut += "<div class=\"timeBlock-taskWrapper\" onclick=\"g_eventManager.toggleDoneFlag(" + tb.tasks[iT].id + ");\">";
				if(tb.tasks[iT].isDone){
					sOut += "<img src=\"img/icnStarDone.png\"";
				} else {
					sOut += "<img src=\"img/icnStar.png\"";
				}
				sOut += " id=\"imgDoneFlag_" + tb.tasks[iT].id + "\"/>";
				sOut += tb.tasks[iT].title;
				sOut += "</div>";
			}
		}
		sOut += "</td></tr></table></div>";
		/*
		if(tb.minutesUntilNext > 0){
			var sHrsMins = getAsHoursMinutesString(tb.minutesUntilNext);
			var as = sHrsMins.split(":");
			sHrsMins = as[0] + " hours " + as[1] + " mins."
			sOut += "Break " + sHrsMins + "<br/>";
		}
		*/
		return sOut;
	};
	
	this.isRefreshRequired = function(){
		var iRealCurrent = 0;
		/*
		var iNow = this.getNowInMinutes();
		for ( var iTB = 0; iTB < this.timeblocks.length; iTB++) {
			var tbTemp = this.timeblocks[iTB];
			if((iNow >= tbTemp.tstartInt) && (iNow < tbTemp.tendInt)){
				alert(tbTemp.id + "\n" + this.getCTB().id);
				iRealCurrent = iTB;
				break;
			}
		}
		*/
		if(this.timeblocks.length > 0){
			var x = this.getCTB();
			iRealCurrent = x.id;
		}
		var bOut = (iRealCurrent != this.iLastTimeBlockDisplayedAsCurrent);
		this.iLastTimeBlockDisplayedAsCurrent = iRealCurrent;
		return bOut;
	};
	
	this.setDoneFlagsFromCookie = function(){
		var sDoneFlags = getCookie("done_flags");
		var sDateInt = getDateAsInt() + ",";
		if(sDoneFlags.indexOf(sDateInt) == 0){
			for ( var iTB = 0; iTB < this.timeblocks.length; iTB++) {
				var tbTemp = this.timeblocks[iTB];
				for ( var iTask = 0; iTask < tbTemp.tasks.length; iTask++) {
					if(sDoneFlags.indexOf("," + tbTemp.tasks[iTask].id + ",") != -1){
						tbTemp.tasks[iTask].isDone = true;
					}
				}
			}
		} else {
			// Date of done flags was not today. Reset to today
			setCookie("done_flags", sDateInt + ",");
		}
	};
	
	this.toggleDoneFlag = function(iIdOfTask){
		var sDoneFlags = getCookie("done_flags");
		var isNowDone = true;
		if(sDoneFlags.indexOf("," + iIdOfTask + ",") == -1){
			// The task is not done. No record in cookie - add it.
			sDoneFlags = sDoneFlags + iIdOfTask + ",";
		} else {
			// The task IS done.
			sDoneFlags = sDoneFlags.split(iIdOfTask + ",").join("");
			isNowDone = false;
		}
		var tbTemp = this.getTaskById(iIdOfTask);
		if(tbTemp != null){
			tbTemp.isDone = isNowDone;
		}
		setCookie("done_flags", sDoneFlags);
		document.getElementById("imgDoneFlag_" + iIdOfTask).src = "img/icnStar" + ((isNowDone) ? "Done" : "") + ".png";
	};
	
	this.getTaskById = function(iId){
		for ( var iTB = 0; iTB < this.timeblocks.length; iTB++) {
			var tbTemp = this.timeblocks[iTB];
			for ( var iTask = 0; iTask < tbTemp.tasks.length; iTask++) {
				if(tbTemp.tasks[iTask].id == iId){
					return tbTemp.tasks[iTask];
				}
			}
		}
		return null;
	};

/////


	this.getCTB = function(){
		var iNow = this.getNowInMinutes();
		for ( var iTB = 0; iTB < this.timeblocks.length; iTB++) {
			var tbTemp = this.timeblocks[iTB];
			if((iNow >= tbTemp.tstartInt) && (iNow < tbTemp.tendInt)){
				return tbTemp;
			}
		}
		return this.timeblocks[this.timeblocks.length - 1];
	};
	
	this.scrollToCurrent = function(){
		var iIdCurrent = this.timeblocks[0].id; //this.getCTB().id;
		//document.getElementById("areaTimeblock_" + iIdCurrent).scrollIntoView();
	}



//////

}

function toggleRoutiniImage(){
	var divTrg = document.getElementById("areaRoutiniHeader");
	if(divTrg.className.indexOf("bgRoutiniImage") == -1){
		divTrg.className = divTrg.className + " bgRoutiniImage";
		divTrg.innerHTML = "";
	} else {
		divTrg.className = divTrg.className.split(" bgRoutiniImage").join("");
		divTrg.innerHTML = "&nbsp;Routini";
	}
}

function showEvents(){
	//document.location.href = g_sBaseLocation + "data/events.xml";
    httpxmlRequest = createXMLHttpRequest();
    var sXmlUrl = g_sBaseLocation + "data/events.xml";
    startRequest(httpxmlRequest, sXmlUrl, handleStateChangeAjaxCall);
    
}

function getAsHoursMinutesString(iIn){
	var iMinutes = (iIn % 60);
	var iHours = Math.round((iIn - iMinutes) / 60);
	return formatToLength(iHours, 2) + ":" + formatToLength(iMinutes, 2);
}

function getAsMinutes(sIn){
	if((sIn.length == 0) || (sIn.indexOf(":") == -1)){
		return 0;
	}
	var asIn = sIn.split(":");
	var iOut = (parseIntSafe(asIn[0]) * 60) + parseIntSafe(asIn[1]);
	return iOut;
}

function processXmlDoc(xmlDoc){
    var nodliRoot = xmlDoc.getElementsByTagName("events");
    //var nodliLevelTwo = nodliRoot[0].getElementsByTagName("timeblock")[iR];
    var nodliLevelTwo = nodliRoot[0].getElementsByTagName("timeblock");
    var aev = new Array();
    for ( var iTimeBlock = 0; iTimeBlock < nodliLevelTwo.length; iTimeBlock++) {
    	var nodeTB = nodliLevelTwo[iTimeBlock];
		var evTemp = new Event();
		evTemp.tstart = nodeTB.getAttribute("tstart");
		evTemp.tend = nodeTB.getAttribute("tend");
		evTemp.color = nodeTB.getAttribute("color");
		
		var nodliLevelThree = nodeTB.getElementsByTagName("task");
		for ( var iTask = 0; iTask < nodliLevelThree.length; iTask++) {
			var nodeT = nodliLevelThree[iTask];
			//a lert(nodeT.getAttribute("title"));
			var taskTemp = new Task();
			taskTemp.title = nodeT.getAttribute("title");
			evTemp.addTask(taskTemp);
		}
		aev[aev.length] = evTemp;
	}
    g_eventManager.timeblocks = aev;
    g_eventManager.setDoneFlagsFromCookie();
    showTimeBlocks();
}
function showTimeBlocks(){
	var sOut = "";
	sOut += g_eventManager.getTimeblocksAsHtml();
	document.getElementById("areaTimeblocks").innerHTML = sOut;
}

function doRefreshPulse(){
	var dtNow = new Date();
	var sOut = "Time now: " + formatToLength(dtNow.getHours(), 2) + ":" + formatToLength(dtNow.getMinutes(), 2); // + ":" + formatToLength(dtNow.getSeconds(), 2); 
	document.getElementById("areaCurrentTimeHeader").innerHTML = sOut; // + " &nbsp; &nbsp; " + Math.round(Math.random() * 1000);
	if (g_eventManager.isRefreshRequired()) {
		showTimeBlocks();
	}
	document.getElementById("areaCurrentTimeHeader").innerHTML = sOut; // + " &nbsp; &nbsp; " + Math.round(Math.random() * 1000);
}

var h_refresh_timer;
var h_refresh_interval = (1000 * g_iSecondsBetweenRefreshes);
function startRefresh(){
	doRefreshPulse();
	h_refresh_timer = setInterval("doRefreshPulse()", h_refresh_interval);
}

function initGlobalObjects(){	
	g_eventManager = new EventManager();
}
/*
function playAudio(){
	var audio = new Audio("audio/sound.mp3");
	audio.play();
}
*/
function doOnLoadski(){
	initGlobalObjects();
	showEvents();
	startRefresh();
}