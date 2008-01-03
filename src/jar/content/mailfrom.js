var oMailFrom = {
	
	// Localised string properties bundle
	strings: null,
	urlRE: new RegExp("mailto\\:", "i"),
	replaceTo: "$TO",
	
	/*
	 * Initialise the addon, setup event listeners
	 */
	init: function() {
		oMailFromUtil.init()
		oMailFromUtil.debug("Entered init()")
		
		oMailFrom.strings = document.getElementById("mailfrom-string-bundle")
		
		// Get the browser component and add an event listener
		if (typeof(gBrowser) != "undefined") {
			gBrowser.addEventListener("load", oMailFrom.analyseContent, true)
			oMailFromUtil.debug("Setup browser event listener")
		}
		
		// Get the context menu and add an event listener
		var contextMenu = document.getElementById("contentAreaContextMenu")
		if (contextMenu) {
			contextMenu.addEventListener("popupshowing", oMailFrom.mailfromShowHideServices, false)
			oMailFromUtil.debug("Setup context menu event listener")
		}
		
		oMailFromUtil.debug("Exiting init()")
		return true
	},
	
	/*
	 * Analyse content and look for mailto links and text email address
	 */
	analyseContent: function(oEvent) {
		oMailFromUtil.debug("Entered analyseContent()")
		
		// Get the document for the loaded window
		oDocument = oEvent.originalTarget
		
		// Get all the anchor tags
		aAnchorTags = oDocument.getElementsByTagName('a')
		
		for (var i=0;i<aAnchorTags.length;i++) {
			// Work out how to handle mailto links
			var href = aAnchorTags[i].href
			//if (href.search(oMailFrom.urlRE) != -1) {
			if (oMailFrom.isMailtoLink(href) != -1) {
				// Modify the anchor
				oMailFrom.updateMailtoUrl(aAnchorTags[i])
			}
		}
		oMailFromUtil.debug("Exiting analyseContent()")
	},
	
	// Is link a mailto link?	
	isMailtoLink: function(sHref) {
		return sHref.search(oMailFrom.urlRE)
	},
	
	updateMailtoUrl: function(oAnchor) {
		oMailFromUtil.debug("Entered updateMailtoURL()")
		
		// Get the email address
		var sEmail = oAnchor.href.substring(7)
		
		// TODO If there is a query string, strip it from the email
		// TODO Extract the subject from the query string 

		oMailFromUtil.debug("sEmail: " + sEmail)

		// Get the preferred mail service
		var preferredServiceUrl = oMailFromUtil.getPreferenceServiceUrl(oMailFromUtil.getPreferenceDefaultServiceKey())
		
		// Zero length service URL implies the default service, so don't modify the mailto href
		if (preferredServiceUrl.length != 0) {
			// Replace the email address
			preferredServiceUrl = preferredServiceUrl.replace(oMailFrom.replaceTo, sEmail)
			
			// Get the preferred URL target
			var iOpenIn = oMailFromUtil.getPreferenceOpenIn()
			
			switch (iOpenIn) {
				case 0: // New window
					oAnchor.setAttribute("onclick", "window.open('" + preferredServiceUrl + "', null); return false")
					break
				/* case 1: // New tab - doesn't work from a browser window because of security model, so open in current window
					oAnchor.href = preferredServiceUrl
					break */
				default: // New current tab
					oAnchor.setAttribute("onclick", "window.location='" + preferredServiceUrl + "'; return false")
			}
		} // Else, this is the default local email service, so do not modify the behaviour
		oMailFromUtil.debug("Exiting updateMailtoURL(): " + oAnchor.href)
		return preferredServiceUrl
	},
	
	mailfromShowHideServices: function(oEvent) {
		oMailFromUtil.debug("Entered mailfromShowHideServices: " + oEvent.target.id)
		if (gContextMenu.onMailtoLink && oEvent.target.id == "contentAreaContextMenu") {
			// If this is a mailto link, show the mailfrom context menu option
			document.getElementById("context-mailfrom").collapsed = false
		} else if (oEvent.target.id == "context-mailfrom-popup") {
			// TODO Populate the services list
			var availableServices = oMailFromUtil.getPreferenceAvailableServices()
			var aAvailableServices = availableServices.split(",")
			aAvailableServices.forEach(oMailFrom.appendMailService)

		} else if (!gContextMenu.onMailtoLink) {
			document.getElementById("context-mailfrom").collapsed = true
		}
		oMailFromUtil.debug("Exiting mailfromShowHideServices")
	},
	
	appendMailService: function(sServiceKey) {
		if (oMailFromUtil.getPreferenceServiceEnabled(sServiceKey)) {
			var sServiceName = oMailFromUtil.getPreferenceServiceName(sServiceKey)
			// Create a new menuitem
			var menuitem = document.createElement("menuitem")
			menuitem.id = "context-mailfrom-" + sServiceKey
			menuitem.setAttribute("label", sServiceKey)

			// Add the menuitem to the popup
			document.getElementById("context-mailfrom-popup").appendChild(menuitem)
		}
	}
}

// Initialise the object when a page loads
window.addEventListener('load', oMailFrom.init, false)
