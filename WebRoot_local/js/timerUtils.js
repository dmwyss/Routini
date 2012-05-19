
/*
 * Manage the substitutions page.
 * This script fetches and displays AJAX data.
 * @param {Object} srcObject
 */
var intervalTimer_timer;

function IntervalTimer(){
	//
	//this.h_iReloadIntervalSeconds = (5 * 60);
	//this.setReloadSeconds = function(iToSet){
	//	this.h_iReloadIntervalSeconds = iToSet;
	//};
	//
	this.start = function(sMethodToCallName, iSeconds){
		intervalTimer_timer = self.setInterval(sMethodToCallName, iSeconds);
	};
}

