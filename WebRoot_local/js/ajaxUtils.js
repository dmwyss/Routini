
/* NOTE: you need to create a method called processXmlDoc(xmlDoc); */

var httpxmlRequest;

/*
Sample of submission...
function doSubmit(){
    httpxmlRequest = createXMLHttpRequest();
    var sXmlUrl = g_sBaseLocation + "playerPriceAdminData.jsp";
    startRequestPost(httpxmlRequest, sXmlUrl, handleStateChangeAjaxCall, serialize("taRawData"));
}
*/

/*
 * Convert a field into a serialized string.
 */
function serialize(sFieldName){
	var sOut = "";
	sOut += sFieldName + "=" + escape(document.forms[0][sFieldName].value);
	return sOut;
}

/*
 * Call made when AJAX call returns.
 * NOTE: you need to create a method called processXmlDoc(xmlDoc);
 */
function handleStateChangeAjaxCall() {
    if(httpxmlRequest.readyState == 4) {
        if(httpxmlRequest.status == 200) {
            var xmlDocTemp = httpxmlRequest.responseXML;
            processXmlDoc(xmlDocTemp);
        } else if(httpxmlRequest.status == 0) {
        	//alert("HttpXmlRequest.status: " + httpxmlRequest.status + "\n\n" + httpxmlRequest.responseXML);
        	var xmlDocTemp = httpxmlRequest.responseXML;
        	processXmlDoc(xmlDocTemp);
        }
    }
}

 /* Sample of processXmlDoc:
function processXmlDoc(xmlDoc){
    var nodliRuleSet = xmlDoc.getElementsByTagName("priceupdate");
    var sSuccessCount = nodliRuleSet[0].getAttribute("successCount");
    var sFailCount = nodliRuleSet[0].getAttribute("failCount");

    var sErrorList = "";
    var iErrorsToDisplay = 5
    var iErrorCount = nodliRuleSet[0].getElementsByTagName("error").length;
    for(var iR = 0; iR < Math.min(iErrorsToDisplay, iErrorCount); iR++){
        var nodliDatabaseDataTop = nodliRuleSet[0].getElementsByTagName("error")[iR];
        sErrorList += "<br/><span style=\"color:red;\">" + nodliDatabaseDataTop.getAttribute("description");
        sErrorList += " [" + nodliDatabaseDataTop.getAttribute("playerId") + "]</span>";
    }
    if(iErrorCount > iErrorsToDisplay){
        sErrorList += "<br/><span style=\"color:red;\">(" + (iErrorCount - iErrorsToDisplay) + " more errors not shown here)</span>";
    }

    if(sFailCount == "0"){
        sFailCount = "";
    } else {
        sFailCount = "<br/><span style=\"color:red;\">" + sFailCount + " had errors!</span>"
    }
    showStatus("Processed Data.<br/>" + sSuccessCount + " players processed correctly." + sFailCount + "<br/>" + sErrorList);
    setUiLock(false);
}
*/

/**
 * Create an XML Request object. This works for all browsers.
 * @return Object as conduit to server, in form of an ActiveXObject or an XMLHttpRequest.
 */
function createXMLHttpRequest() {
    var xmlHttpOut;
    if (window.ActiveXObject) {
        xmlHttpOut = new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        xmlHttpOut = new XMLHttpRequest();
    }
    return xmlHttpOut;
}

/**
* Begin the call process to retrive XML.
* This includes setting up for when the XML is returned.
* @param xmlHttpTemp XML Loading object, different in IE and FireFox etc.
* @param sXmlUrl URL of the XML object.
* @param functionToHandleStateChange Name of the method to call when the state changes.
*/
function startRequest(xmlHttpTemp, sXmlUrl, functionToHandleStateChange) {
	xmlHttpTemp.onreadystatechange = functionToHandleStateChange;
	xmlHttpTemp.open("GET", sXmlUrl, true);
	xmlHttpTemp.send(null);
}

/*
 * Begin the call process to post data and return results XML.
 * @param xmlHttpTemp XML Loading object, different in IE and FireFox etc.
 * @param sXmlUrl URL of the XML object.
 * @param functionToHandleStateChange Name of the method to call when the state changes.
 * @param sParams URI format String, eg "username=Joe%20Bloggs&age=20".
 */
function startRequestPost(xmlHttpTemp, sXmlUrl, functionToHandleStateChange, sParams) {
    xmlHttpTemp.onreadystatechange = functionToHandleStateChange;
    xmlHttpTemp.open("POST", sXmlUrl, true);
    xmlHttpTemp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttpTemp.setRequestHeader("Content-length", sParams.length);
    xmlHttpTemp.setRequestHeader("Connection", "close");
    xmlHttpTemp.send(sParams);
}
