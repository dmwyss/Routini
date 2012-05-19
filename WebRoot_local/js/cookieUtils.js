/**
 * Put a string value into a named cookie.
 * @param sCookieName String to identify the cookie.
 * @param sCookieValue String to set as the value.
 * @param iDaysToLast How long to keep the cookie. 0 will erase the cookie.
 */
function setCookie(sCookieName, sCookieValue, iDaysToLast){
	var dtToday = new Date();
	if(isNaN(iDaysToLast)){
		iDaysToLast = -1;
	}
	if (iDaysToLast != -1){
		iDaysToLast = iDaysToLast * 1000 * 60 * 60 * 24;
	}
	var dtExpiryDate = new Date(dtToday.getTime() + (iDaysToLast));
	var sOut = "";
	sOut += sCookieName + "=" +escape(sCookieValue);
	if(iDaysToLast != -1){
		sOut += ";expires=" + dtExpiryDate.toGMTString();
	}
	document.cookie = sOut;
}

/**
 * Remove a named cookie.
 * @param sCookieName String to identify the cookie.
 */
function deleteCookie(sCookieName){
	setCookie(sCookieName, "", 0);
}

/**
 * Return a string value associated with a named cookie.
 * @param sCookieName String to identify the cookie.
 */
function getCookie(sCookieName){
	var iStartPos = document.cookie.indexOf( sCookieName + "=" );
	var iLength = iStartPos + sCookieName.length + 1;
	if ((!iStartPos) && (sCookieName != document.cookie.substring( 0, sCookieName.length))) {
		return "";
	}
	if (iStartPos == -1) return "";
	var iEndPos = document.cookie.indexOf(";", iLength );
	if (iEndPos == -1) iEndPos = document.cookie.length;
	//a lert("getting cookie " + sCookieName + "\n" + unescape(document.cookie.substring(iLength, iEndPos)));
	return unescape(document.cookie.substring(iLength, iEndPos));
}