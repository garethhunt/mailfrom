var oMailFrom = {
	
	contextSeparator: null,
	
	// Localised string properties bundle
	strings: null,
	urlRE: new RegExp("mailto\\:", "i"),
	replaceBcc: "$BCC",
	replaceBody: "$BODY",
	replaceCc: "$CC",
	replaceTo: "$TO",
	replaceSubject: "$SUBJECT",
	
	/*
	 * Initialise the addon, setup event listeners
	 */
	init: function() {
		oMailFromUtil.init()
		oMailFromUtil.debug("Entered init()")
		
		oMailFrom.contextSeparator = document.getElementById("mailfrom-context-separator")
		
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
			if (oMailFrom.isMailtoLink(aAnchorTags[i].href) != -1) {
				// Modify the anchor
				oMailFromUtil.debug("Anchor: " + i + ", " + aAnchorTags[i])
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
		oMailFromUtil.debug("Entered updateMailtoURL(): " + oAnchor.href)
		
		// If this is the System Demail Mail Client
		if (oMailFromUtil.getPreferenceDefaultServiceKey() != "default") {
			// Replace the email address
			var preferredServiceUrl = oMailFrom.setServiceUrlWithParams(oMailFromUtil.getPreferenceDefaultServiceKey(), oAnchor.href)
			
			// Get the preferred URL target
			var iOpenIn = oMailFromUtil.getPreferenceOpenIn()
			
			switch (iOpenIn) {
				case 0: // New window
					oAnchor.setAttribute("onclick", "window.open('" + preferredServiceUrl + "', null); return false")
					break
				/* case 1: // New tab - doesn't work from a browser window because of security model, so open in current window
					oAnchor.href = preferredServiceUrl
					break */
				default: // Current tab
					oAnchor.setAttribute("onclick", "window.location='" + preferredServiceUrl + "'; return false")
			}
		} // Else, this is the default local email service, so do not modify the behaviour
		oMailFromUtil.debug("Exiting updateMailtoURL(): " + oAnchor.href)
	},
	
	/*
	 * Update the context menu
	 */
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
	
	/*
	 * Append a menu item to the mailfrom context menu
	 */
	appendMailService: function(sServiceKey) {
		oMailFromUtil.debug("Entered appendMailService: " + sServiceKey)
		var contextNode = document.getElementById("context-mailfrom-" + sServiceKey)
		if (contextNode != null) {
			document.getElementById("context-mailfrom-popup").removeChild(contextNode)
		}
		
		if (oMailFromUtil.getPreferenceServiceEnabled(sServiceKey)) {
			var sServiceName = oMailFromUtil.getPreferenceServiceName(sServiceKey)
			var sServiceUrl = oMailFrom.setServiceUrlWithParams(sServiceKey, gContextMenu.linkURL)
			
			// Create a new menuitem
			var menuitem = document.createElement("menuitem")
			menuitem.id = "context-mailfrom-" + sServiceKey
			menuitem.setAttribute("label", sServiceName)
			menuitem.setAttribute("oncommand", oMailFrom.setContextOnClick(sServiceUrl))

			// Add the menuitem to the popup
			document.getElementById("context-mailfrom-popup").insertBefore(menuitem, oMailFrom.contextSeparator)
		}
		oMailFromUtil.debug("Exiting appendMailService")
	},
	
	/*
	 * Modify the service URL
	 */
	setServiceUrlWithParams: function(sServiceKey, sHref) {
		oMailFromUtil.debug("Entered setServiceUrlWithParams: " + sServiceKey + ", " + sHref)
		var sServiceUrl = oMailFromUtil.getPreferenceServiceUrl(sServiceKey)
		
		if (sServiceUrl.length > 0) {
			// Set $TO
			sServiceUrl = sServiceUrl.replace(oMailFrom.replaceTo, oMailFromUtil.getEmailFromHref(sHref))
			sServiceUrl = sServiceUrl.replace(oMailFrom.replaceSubject, oMailFromUtil.getParameterFromHref(sHref, "subject"))
			sServiceUrl = sServiceUrl.replace(oMailFrom.replaceCc, oMailFromUtil.getParameterFromHref(sHref, "cc"))
			sServiceUrl = sServiceUrl.replace(oMailFrom.replaceBcc, oMailFromUtil.getParameterFromHref(sHref, "bcc"))
			sServiceUrl = sServiceUrl.replace(oMailFrom.replaceBody, oMailFromUtil.getParameterFromHref(sHref, "body"))
		} else { // The service has no URL, so it must be the default service
			sServiceUrl = sHref
		}
		oMailFromUtil.debug("Exiting setServiceUrlWithParams")
		return sServiceUrl
	},
	
	setContextOnClick: function(sServiceUrl) {
		// Get the preferred URL target
		var iOpenIn = oMailFromUtil.getPreferenceOpenIn()
		var action
		
		switch (iOpenIn) {
			case 0: // New window
				action = "window.open(\"" + sServiceUrl + "\", null)"
				break
			case 1: // New tab
				action = "gBrowser.addTab(\"" + sServiceUrl + "\", null)"
				break
			default: // Current tab
				action =  "gBrowser.loadURI(\"" + sServiceUrl + "\")"
		}
		return action
	}
}

// Initialise the object when a page loads
window.addEventListener('load', oMailFrom.init, false)
