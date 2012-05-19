
var g_eventManager = null;
var g_sBaseLocation = "";
var g_iSecondsBetweenRefreshes = 15;
var g_iEasterEggCounter = 0;
var g_sAmPmCurrent = ((new Date()).getHours() > 12) ? "Pm" : "Am";

function Timeblock(){
	this.id = g_eventManager.getNextTimeblockId();
	this.tstart = "";
	this.tstartInt = 0;
	this.tend = "";
	this.tendInt = 0;
	this.color = "";
	this.minutesUntilNext = 0;
	this.isGap = false;
	this.getTimeblockTimeStatus = function(iNow){
		//a lert(iNow);
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
	};
}

function EventManager(){
	this.timeblocks = new Array();
	this.iIdLastTimeblockDisplayedAsCurrent = -1;
	this.iLastTaskId = 99;
	this.getNextTimeblockId = function(){
		return this.getNextTaskId();
	};
	this.getNextTaskId = function(){
		this.iLastTaskId++;
		return this.iLastTaskId;
	};
	this.setTimeInts = function(){
		for ( var iTB = 0; iTB < this.timeblocks.length; iTB++) {
			var tb = this.timeblocks[iTB];
			tb.tstartInt = getAsMinutes(tb.tstart);
			tb.tendInt = getAsMinutes(tb.tend);
		}
		
		// Set the end time of the last timeblock to midnight.
		var sMidnight = "23:59";
		var timeblockLast = this.timeblocks[this.timeblocks.length - 1];
		if(timeblockLast){
			timeblockLast.tend = sMidnight;
			timeblockLast.tendInt = getAsMinutes(sMidnight);
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
				var evtNew = new Timeblock();
				var taskToAdd = new Task(); //taskToAdd.title = "";
				evtNew.addTask(taskToAdd);
				evtNew.tstartInt = tbThis.tendInt;
				evtNew.tstart = getAsHoursMinutesString(tbThis.tendInt);
				evtNew.tendInt = tbNext.tstartInt;
				evtNew.tend = getAsHoursMinutesString(tbNext.tstartInt);
				evtNew.isGap = true;
				this.timeblocks.splice(iTBReverse, 0, evtNew);
			}
			

			if(iTbThisEndOld != tbThis.tendInt){
				// End time has been changed.
				tbThis.tend = getAsHoursMinutesString(tbThis.tendInt);
			}
		}
		if(this.timeblocks.length > 0){
			this.iIdLastTimeblockDisplayedAsCurrent = this.getCurrentTimeblock().id;
		}
	};
	
	this.getNowInMinutes = function(){
		var dtNow = new Date();
		return (dtNow.getHours() * 60) + dtNow.getMinutes();
	};
	
	this.getTimeblocksAsHtml = function(){
		this.setTimeInts();
		var sOut = "";
		sOut += "<div id=\"areaRoutiniHeader\" class=\"timeblockWrapper timeblockHeader" + g_sAmPmCurrent + "\" onclick=\"toggleRoutiniImage();\">&nbsp;Routini";
	    var sPersonInUrl = getQueryStringParameter("person");
		if(sPersonInUrl != ""){
			sOut += " &nbsp;" + toLeadUppercase(sPersonInUrl);
		}
		sOut += "</div>"; // style=\"background-color:" + tb.color + "\">";
		
		var iNow = this.getNowInMinutes();
		
		//iNow = getAsMinutes("07:03");
		
		for ( var iTB = 0; iTB < this.timeblocks.length; iTB++) {
			sOut += this.decorateTimeblock(this.timeblocks[iTB], iNow);
		}
		return sOut;
	};
	
	
	this.decorateTimeblock = function(tb, iNow){
		var sOut = "";
		sOut += "<div id=\"areaTimeblock_" + tb.id + "\" class=\"timeblockWrapper";
		if(tb.isGap){
			sOut += "Gap";
		}
		sOut += " timeblockStatus-" + tb.getTimeblockTimeStatus(iNow) + g_sAmPmCurrent + "\">"; // style=\"background-color:" + tb.color + "\">";
		
		
		if(tb.isGap){
			sOut += "<div class=\"timeblockGap\"></div>";
		} else {
		
			sOut += "<table class=\"timeblock\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><td class=\"timeblock-startTime\">";	
			sOut += tb.tstart;
			sOut += "</td><td class=\"timeblock-tasks\">";
			
			//sOut += tb.isGap;
			//sOut += tb.tend;
			//sOut += "<br/>";
			//sOut += tb.getTimeblockTimeStatus(iNow);
			//sOut += "<br/>";
			for ( var iT = 0; iT < tb.tasks.length; iT++) {
				if(tb.tasks[iT].isGap()){
					sOut += "<br/>";
				} else {
					sOut += "<div class=\"timeblock-taskWrapper\" onclick=\"g_eventManager.toggleDoneFlag(" + tb.tasks[iT].id + ");\">";
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
			sOut += "</td></tr></table>";

		
		}
		
		
		sOut += "</div>";
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
		var iIdRealCurrent = 0;
		if(this.timeblocks.length > 0){
			iIdRealCurrent = this.getCurrentTimeblock().id;
		}
		var bOut = (iIdRealCurrent != this.iIdLastTimeblockDisplayedAsCurrent);
		this.iIdLastTimeblockDisplayedAsCurrent = iIdRealCurrent;
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
		if (isNowDone) {
			g_iEasterEggCounter++;
			if(g_iEasterEggCounter == 3){
				playSound("laser.mp3");
			} else if(g_iEasterEggCounter == 5){
				playSound("r2d2Whistle.mp3");
			} else if(g_iEasterEggCounter == 6){
				playSound("miaw.mp3");
			} else if(g_iEasterEggCounter == 9){
				playSound("jawaHoutini.mp3");
			} else if(g_iEasterEggCounter == 12){
				playSound("starwars_wookie.mp3");
			} else if(g_iEasterEggCounter == 14){
				playSound("r2d2Scream.mp3");
				g_iEasterEggCounter = 0;
			} else {
				//p laySound("routini.mp3");
				playSound("starwars_sabre.mp3");
			}
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
	
	this.getCurrentTimeblock = function(){
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
		if(this.timeblocks.length > 0){
			//a lert("STC");
			var iIdCurrent = this.getCurrentTimeblock().id;
			document.getElementById("areaTimeblock_" + iIdCurrent).scrollIntoView();
		}
	}
}

function playSound(sSoundFileName){
	var sOut = "<audio autoplay=\"autoplay\">";
	sOut += "<source src=\"audio/" + sSoundFileName + "\" type=\"audio/mpeg\" />";
	sOut += "</audio>";
	document.getElementById("areaAudioPlayer").innerHTML = sOut;
}

function toggleRoutiniImage(){
	var divTrg = document.getElementById("areaRoutiniHeader");
	if(divTrg.className.indexOf("bgRoutiniImage") == -1){
		divTrg.className = divTrg.className + " bgRoutiniImage";
		divTrg.innerHTML = "";
		//p laySound("starwars_darthBreathing.mp3");
		playSound("jawaHoutini.mp3");
	} else {
		divTrg.className = divTrg.className.split(" bgRoutiniImage").join("");
		divTrg.innerHTML = "&nbsp;Routini";
	}
}

function showTimeblocks(){
	var sOut = "";
	sOut += g_eventManager.getTimeblocksAsHtml();
	document.getElementById("areaTimeblocks").innerHTML = sOut;
	g_eventManager.scrollToCurrent();
}

function startPageSetup(){ //////
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
    var dtNow = (new Date());
    var nodliLevelTwo = nodliRoot[0].getElementsByTagName("timeblock");
    var sMonthCurrent = DateConstants.monthsShort[(dtNow.getMonth())];
    var sDayCurrent = DateConstants.daysShort[(dtNow.getDay())];
    
    var iHourCurrent = dtNow.getHours();
    //a lert("Hour now: " + iHourCurrent);
    var sAmPmCurrent = ((iHourCurrent < 12) ? "am" : "pm");
    //a lert(sDayCurrent + " " + (dtNow.getDay()));

    var sPersonInUrl = getQueryStringParameter("person");
    //a lert("sPerson " + sPersonInUrl);
    
    var aev = new Array();
    for ( var iTimeblock = 0; iTimeblock < nodliLevelTwo.length; iTimeblock++) {
    	var nodeTB = nodliLevelTwo[iTimeblock];

    	var sShowTimeblockDays = getAttributeSafe(nodeTB, "days");
    	var isShowTimeblockDays = ((sShowTimeblockDays == "") || (sShowTimeblockDays.indexOf(sDayCurrent) != -1))
    	
    	var sShowTimeblockHours = getAttributeSafe(nodeTB, "hours");
    	var isShowTimeblockHours = ((sShowTimeblockHours == "") || (sShowTimeblockHours.indexOf(sAmPmCurrent) != -1))
    	
    	var sShowTimeblockPerson = getAttributeSafe(nodeTB, "person");
    	//var isShowTimeblockPerson = ((sPersonInUrl == "") || (sShowTimeblockPerson == sPersonInUrl));
    	var isShowTimeblockPerson = (sShowTimeblockPerson == sPersonInUrl);
    	

    	if(isShowTimeblockDays && isShowTimeblockHours && isShowTimeblockPerson){
    		
			var evTemp = new Timeblock();
			evTemp.tstart = getAttributeSafe(nodeTB, "tstart");
			evTemp.tend = getAttributeSafe(nodeTB, "tend");
			
			var nodliLevelThree = nodeTB.getElementsByTagName("task");
			for ( var iTask = 0; iTask < nodliLevelThree.length; iTask++) {
				var nodeT = nodliLevelThree[iTask];
				
				var sShowTaskDays = getAttributeSafe(nodeT, "days");
				var isShowTaskDays = ((sShowTaskDays == "") || (sShowTaskDays.indexOf(sDayCurrent) != -1));
				
				var sShowTaskMonths = getAttributeSafe(nodeT, "months");
				var isShowTaskMonths = ((sShowTaskMonths == "") || (sShowTaskMonths.indexOf(sMonthCurrent) != -1));
	
				//var sShowTaskPerson = getAttributeSafe(nodeT, "person");
				//var isShowTaskPerson = (isShowTimeblockPerson || (sShowTaskPerson == "") || (sShowTaskPerson == sPersonInUrl));
				
				if(isShowTaskDays && isShowTaskMonths){ // && isShowTaskPerson){
					var taskTemp = new Task();
					taskTemp.title = nodeT.getAttribute("title");
					evTemp.addTask(taskTemp);
				}
			}
			aev[aev.length] = evTemp;
    	}
	}
    g_eventManager.timeblocks = aev;
    g_eventManager.setDoneFlagsFromCookie();
    showTimeblocks();
}

function getAttributeSafe(nodeSrc, sAttributeName){
	if(nodeSrc == null){
		return "";
	}
	var sOut = nodeSrc.getAttribute(sAttributeName);
	if(sOut == null){
		return "";
	}
	return sOut;
}

function doRefreshPulse(){
	var dtNow = new Date();
	var sDayOfWeek = DateConstants.daysFull[((new Date()).getDay())];
	g_sAmPmCurrent = ((new Date()).getHours() > 12) ? "Pm" : "Am";
	var sTimeText = sDayOfWeek + "&nbsp; " + formatToLength(dtNow.getHours(), 2) + ":" + formatToLength(dtNow.getMinutes(), 2); // + ":" + formatToLength(dtNow.getSeconds(), 2); 
	var sOut = "<div id=\"areaCurrentTimeTextBg\">" + sTimeText + "</div>"
	sOut += "<div id=\"areaCurrentTimeTextFg\">" + sTimeText + "</div>"
	if(top != self){
		// We are in a window
		top.document.getElementById("areaCurrentTimeHeader").innerHTML = sOut;
	} else {
		// Not inside an iFrame
		var divHead = document.getElementById("areaCurrentTimeHeader");
		divHead.innerHTML = sOut;
		divHead.className = "header" + g_sAmPmCurrent;
	}
		
	if (g_eventManager.isRefreshRequired()) {
		playSound("jawaHoutini.mp3");
		showTimeblocks();
	}
	//document.getElementById("areaCurrentTimeHeader").innerHTML = sOut; // + " &nbsp; &nbsp; " + Math.round(Math.random() * 1000);
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

function doOnLoadski(){
	initGlobalObjects();
	startPageSetup();
	startRefresh();
	//g_eventManager.scrollToCurrent();
}