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
		oMailFromEditService.serviceKey = window.arguments[0]
		
		if (oMailFromEditService.serviceKey == undefined) {
			oMailFromEditService.serviceKey = oMailFromEditService.customKeyPrefix + oMailFromEditService.randomStringGen()
		}
		
		document.getElementById("pref-service-enabled").name = oMailFromEditService.prefServicePrefix + oMailFromEditService.serviceKey + oMailFromEditService.prefServiceEnabledSuffix
		document.getElementById("pref-service-name").name = oMailFromEditService.prefServicePrefix + oMailFromEditService.serviceKey + oMailFromEditService.prefServiceNameSuffix
		document.getElementById("pref-service-url").name = oMailFromEditService.prefServicePrefix + oMailFromEditService.serviceKey + oMailFromEditService.prefServiceUrlSuffix
	},
	
	handleBeforeAccept: function() {
		// Ensure the preferences are set
		document.getElementById("pref-service-enabled").value = true
		document.getElementById("pref-service-name").value = document.getElementById("edit-service-name").value
		document.getElementById("pref-service-url").value = document.getElementById("edit-service-url").value
		
		// Add the key to the available services list
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
		lb.setAttribute("value", document.getElementById("pref-service-name").value)
		rli.appendChild(lb)
		
		window.opener.document.getElementById("available-services").appendChild(rli)
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
