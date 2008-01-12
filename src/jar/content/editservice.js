var oMailFromEditService = {
	
	// Service key
	serviceKey: null,
	
	// Preference info
	prefServicePrefix: "extensions.mailfrom.service.",
	prefServiceEnabledSuffix: ".enabled",
	prefServiceNameSuffix: ".name",
	prefServiceUrlSuffix: ".url",
	
	// Custom keys
	customKeyPrefix: "custom-",
	randomChars: "abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ0123456789",
	randomStringLength: 8,
	
	// Validation Regex
	validUrlRe: new RegExp("http://[a-zA-Z0-9\.]+?\.[a-z]{3,6}/?[a-zA-Z0-9\.\?&\$]*"),
	
	initPreferencesPane: function() {
		oMailFromUtil.debug("Entered initPreferencesPane")
		oMailFromEditService.serviceKey = window.arguments[0]
		
		if (oMailFromEditService.serviceKey == undefined) {
			oMailFromEditService.serviceKey = oMailFromEditService.customKeyPrefix + oMailFromEditService.randomStringGen()
		}
		oMailFromUtil.debug("oMailFromEditService.serviceKey: " + oMailFromEditService.serviceKey)
		
		oMailFromEditService.createPreference("pref-service-enabled", oMailFromEditService.prefServicePrefix + oMailFromEditService.serviceKey + oMailFromEditService.prefServiceEnabledSuffix, "bool")
		oMailFromEditService.createPreference("pref-service-name", oMailFromEditService.prefServicePrefix + oMailFromEditService.serviceKey + oMailFromEditService.prefServiceNameSuffix, "string")
		oMailFromEditService.createPreference("pref-service-url", oMailFromEditService.prefServicePrefix + oMailFromEditService.serviceKey + oMailFromEditService.prefServiceUrlSuffix, "string")
		oMailFromUtil.debug("Exiting initPreferencesPane")
	},
	
	createPreference: function(id, name, type) {
		var prf = document.createElement("preference")
		prf.id = id
		prf.name = name
		prf.type = type
		document.getElementById("edit-service-preferences").appendChild(prf)
	},
	
	handleBeforeAccept: function() {
		oMailFromUtil.debug("Entered handleBeforeAccept")
		oMailFromUtil.debug("Enabled: " + document.getElementById("pref-service-enabled").value)
		oMailFromUtil.debug("Name: " + document.getElementById("pref-service-name").value)
		oMailFromUtil.debug("Value: " + document.getElementById("pref-service-url").value)
		// Ensure the preferences are set
		if (document.getElementById("pref-service-enabled").value == null) {
			document.getElementById("pref-service-enabled").value = true	
		}
		if (document.getElementById("pref-service-name").value.length == 0) {
			document.getElementById("pref-service-name").value = document.getElementById("edit-service-name").value
		}
		if (document.getElementById("pref-service-url").value.length == 0) {
			document.getElementById("pref-service-url").value = document.getElementById("edit-service-url").value
		}
		
		// If necessary, add the key to the available services list
		if (document.getElementById("pref-available-services").value.indexOf(oMailFromEditService.serviceKey) == -1) {
			oMailFromUtil.debug("New service, so adding to the list")
			document.getElementById("pref-available-services").value += ("," + oMailFromEditService.serviceKey)
			
			// Add the new entry to the bottom of the available services list
			var availableServices = window.opener.document.getElementById("available-services")
			
			// Create a preference to support enabling/disabling the service and add it to the set
			var prf = document.createElement("preference")
			prf.id = "pref-" + oMailFromEditService.serviceKey + "-enabled"
			prf.name = "extensions.mailfrom.service." + oMailFromEditService.serviceKey + ".enabled"
			prf.type = "bool"
			prf.value = document.getElementById("pref-service-enabled").value
			window.opener.document.getElementById("preferences-block").appendChild(prf)
			
			// Create a new rich list item
			var rli = document.createElement("richlistitem")
			rli.id = "rli-" + oMailFromEditService.serviceKey
			rli.value = oMailFromEditService.serviceKey
			
			// Append a checkbox to the item
			var cb = document.createElement("checkbox")
			cb.id = window.opener.oMailFromPreferences.cbPrefix + oMailFromEditService.serviceKey
			cb.setAttribute("checked", "true")
			cb.setAttribute("preference", prf.id)
			rli.appendChild(cb)
			
			// Append a label to the item
			// (not using the checkbox label attribute so that the item can be selected without modifying the enabled preference)
			var lb = document.createElement("label")
			lb.id = "lbl-" + document.getElementById("pref-service-name").value
			lb.setAttribute("value", document.getElementById("pref-service-name").value)
			rli.appendChild(lb)
			
			window.opener.document.getElementById("available-services").appendChild(rli)
		} else {
			oMailFromUtil.debug("Existing service, so modifying the existing entry")
			
			// Update the existing items preferences
			window.opener.document.getElementById("pref-" + oMailFromEditService.serviceKey + "-name").value = document.getElementById("pref-service-name").value
			window.opener.document.getElementById("pref-" + oMailFromEditService.serviceKey + "-url").value = document.getElementById("pref-service-url").value
			
			var lbl = window.opener.document.getElementById("lbl-" + oMailFromEditService.serviceKey)
			lbl.value = document.getElementById("pref-service-name").value
		}
		oMailFromUtil.debug("Exiting handleBeforeAccept")
	},
	
	/*
	 * Validation methods
	 */
	validateInput: function() {
		// Validate the values entered
		if (document.getElementById("edit-service-name").textLength == 0 || !oMailFromEditService.validateServiceUrl()) {
			document.getElementById("edit-service-ok").disabled = true
			return false
		}
		document.getElementById("edit-service-ok").disabled = false
		return true
	},
		
	validateServiceUrl: function() {
		var ctl = document.getElementById("edit-service-url")
		if (ctl.textLength == 0) {
			return false
		} else if (!oMailFromEditService.validUrlRe.test(ctl.value)) {
			return false
		}
		return true
	},
	
	/*
	 * Create a random string for the custom key
	 */
	randomStringGen: function() {
		var myString = ""
		for (var i=0; i < oMailFromEditService.randomStringLength; i++) {
			var rnum = Math.floor(Math.random() * oMailFromEditService.randomChars.length)
			myString += oMailFromEditService.randomChars.substring(rnum,rnum+1)
		}
		return myString
	}
}
