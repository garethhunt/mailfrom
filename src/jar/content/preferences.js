var oMailFromPreferences = {
	
	// Checkboxes
	cbPrefix: "cb-",
	
	// Service dialog
	dialogUrl: "chrome://mailfrom/content/editService.xul",
	
	init: function() {
		oMailFromUtil.init()
	},
	
	initPreferencesWindow: function() {
		oMailFromPreferences.init()
		
		// Set openInRadioButtons
		oMailFromPreferences.initOpenInRadioButtons(document.getElementById("pref-open-in").value)
	},
	
	initPreferencesPane: function() {
		// Set availableServicesList
		// The dynamic preferences created are only set from the onpaneload event
		var aAvailableServices = document.getElementById("pref-available-services").value.split(",")
		aAvailableServices.forEach(oMailFromPreferences.initAvailableServicesList)
	},
		
	// Create the list of available mail services
	initAvailableServicesList: function(sServiceKey) {
		oMailFromUtil.debug("Entered initAvailableServicesList, sServiceKey: " + sServiceKey)
		var sServiceName = oMailFromUtil.getPreferenceServiceName(sServiceKey)
		
		// Create a preference elements for each service to support enabling/disabling the service and add/remove it to the set
		oMailFromPreferences.createPreference("pref-" + sServiceKey + "-enabled", "extensions.mailfrom.service." + sServiceKey + ".enabled", "bool")
		oMailFromPreferences.createPreference("pref-" + sServiceKey + "-name", "extensions.mailfrom.service." + sServiceKey + ".name", "string")
		oMailFromPreferences.createPreference("pref-" + sServiceKey + "-url", "extensions.mailfrom.service." + sServiceKey + ".url", "string")
		
		// Create a new rich list item
		var rli = document.createElement("richlistitem")
		rli.id = "rli-" + sServiceKey
		rli.value = sServiceKey
		
		// Get the default service
		var defaultService = document.getElementById("pref-default-service").value
			
		// Append a checkbox to the item
		var cb = document.createElement("checkbox")
		cb.id = oMailFromPreferences.cbPrefix + sServiceKey
		cb.setAttribute("preference", "pref-" + sServiceKey + "-enabled")
		rli.appendChild(cb)
		
		// Append a label to the item
		// (not using the checkbox label attribute so that the item can be selected without modifying the enabled preference)
		var lb = document.createElement("label")
		lb.id = "lbl-" + sServiceKey
		lb.setAttribute("value", sServiceName)
		rli.appendChild(lb)
		
		if (sServiceKey == document.getElementById("pref-default-service").value) {
			oMailFromUtil.debug("Disabling the default profile")
			cb.disabled = true
			lb.setAttribute("value", sServiceName + " " + document.getElementById("mailfrom-string-bundle").getString("mailfrom.default.suffix"))
		}
		
		document.getElementById("available-services").appendChild(rli)
		oMailFromUtil.debug("Exiting initAvailableServicesList")
	},
	
	createPreference: function(id, name, type) {
		var prf = document.createElement("preference")
		prf.id = id
		prf.name = name
		prf.type = type
		document.getElementById("preferences-block").appendChild(prf)
	},
	
	// Add options for where to open mail links
	initOpenInRadioButtons: function(iOpenIn) {
		document.getElementById("open-in").appendItem(document.getElementById("mailfrom-string-bundle").getString("mailfrom.openin.newwindow"), 0)
		document.getElementById("open-in").appendItem(document.getElementById("mailfrom-string-bundle").getString("mailfrom.openin.newtab"), 1)
		document.getElementById("open-in").appendItem(document.getElementById("mailfrom-string-bundle").getString("mailfrom.openin.samewindow"), 2)
		document.getElementById("open-in").value = iOpenIn
	},
	
	mailServiceSelected: function() {
		oMailFromUtil.debug("Entered mailServiceSelected")
		var selectedService = document.getElementById("available-services").selectedItem.value
		oMailFromUtil.debug("available-services: " + selectedService)
		
		// If this is the default service, disable all but the New button
		if (selectedService == document.getElementById("pref-default-service").value) {
			document.getElementById("cmd-set-default").setAttribute("disabled", "true")
		} else {
			document.getElementById("cmd-set-default").setAttribute("disabled", "false")
		}
		
		// Disable the set-default button, if the service is not enabled
		if (!document.getElementById("pref-" + selectedService + "-enabled").value) {
			document.getElementById("cmd-set-default").setAttribute("disabled", "true")
		}
		
		// Only enable the delete button if the service key contains the word 'custom'
		var re = new RegExp("custom-[a-zA-Z0-9]*")
		
		// TODO Reinstate the edit and remove buttons once custom services are added
		oMailFromUtil.debug("Exiting mailServiceSelected")
	},
	
	/*
	 * Open the service dialog, to either add or edit mail service info
	 */
	openServiceDialog: function(sServiceKey) {
		document.getElementById("mailfrom-preferences").openSubDialog(oMailFromPreferences.dialogUrl, "", sServiceKey)
	},
	
	/*
	 * Remove a service. Only custom services can be removed.
	 * Will determine if this is  really a good idea after some user feedback.
	 */
	removeService: function(sConfirm, sServiceKey) {
		oMailFromUtil.debug("Entered deleteService: " + sServiceKey)
		
		// Get the service name
		var sServiceName = document.getElementById("pref-" + sServiceKey + "-name").value
		
		// TODO, use the special methods on the prefwindow object
		if (confirm(sConfirm + "'" + sServiceName + "'?"))
		{
			// Remove the rli
			document.getElementById("available-services").removeChild(document.getElementById("rli-" + sServiceKey))
			
			// Reset the preferences
			document.getElementById("pref-" + sServiceKey + "-enabled").reset()
			document.getElementById("pref-" + sServiceKey + "-name").reset()
			document.getElementById("pref-" + sServiceKey + "-url").reset()
			
			// Remove the preference elements
			document.getElementById("preferences-block").removeChild(document.getElementById("pref-" + sServiceKey + "-enabled"))
			document.getElementById("preferences-block").removeChild(document.getElementById("pref-" + sServiceKey + "-name"))
			document.getElementById("preferences-block").removeChild(document.getElementById("pref-" + sServiceKey + "-url"))
			
			// Remove the service key from the available services list
			// Use array functions instead of fiddling with commas in strings
			var aAvailableServices = document.getElementById("pref-available-services").value.split(",")
			var keyIndex = aAvailableServices.indexOf(sServiceKey)
			aAvailableServices.splice(keyIndex, 1)
			oMailFromUtil.debug("spliced array: " + aAvailableServices.toString())
			document.getElementById("pref-available-services").value = aAvailableServices.toString()
		}
		oMailFromUtil.debug("Exiting deleteService")
	},
	
	setDefaultService: function(sSelectedKey) {
		oMailFromUtil.debug("Entered setDefaultService: " + sSelectedKey)
		// Get the key of the current default service and update its list checkbox and label to remove the default marker
		var currentDefaultServiceKey = document.getElementById("pref-default-service").value
		var currentDefaultServiceName = document.getElementById("pref-" + currentDefaultServiceKey + "-name").value
		document.getElementById("lbl-" + currentDefaultServiceKey).setAttribute("value", currentDefaultServiceName)
		document.getElementById("cb-" + currentDefaultServiceKey).disabled = false
		
		// Append the default marker onto the new default and update the checkbox
		var newDefaultServiceName = document.getElementById("pref-" + sSelectedKey + "-name").value
		document.getElementById("lbl-" + sSelectedKey).setAttribute("value", newDefaultServiceName + " " + document.getElementById("mailfrom-string-bundle").getString("mailfrom.default.suffix"))
		document.getElementById("cb-" + sSelectedKey).disabled = true
		
		// Set the new default service and disable buttons
		document.getElementById("pref-default-service").value = sSelectedKey
		document.getElementById("cmd-set-default").setAttribute("disabled", "true")
		oMailFromUtil.debug("Exiting setDefaultService")
	}
}
