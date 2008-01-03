var oMailFromUtil = {
	// A logger
	gConsoleService: Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService),
	
	// Pref attributes
	prefService: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService),
	prefLogMessages: "extensions.mailfrom.debug",
	prefDefaultService: "extensions.mailfrom.default.service",
	prefAvailableServices: "extensions.mailfrom.services",
	prefServicePrefix: "extensions.mailfrom.service.",
	prefServiceEnabledSuffix: ".enabled",
	prefServiceNameSuffix: ".name",
	prefServiceUrlSuffix: ".url",
	prefOpenIn: "extensions.mailfrom.open.in", // 1 = new window, 2 = new tab, 3 = same window
	
	init: function() {
		oMailFromUtil.prefService = oMailFromUtil.prefService.getBranch("")
	},
	
	/*
	 * The next set of methods handle Preference retrieval for the dynamically named preferences.
	 */

	// Get the list of available services
	getPreferenceAvailableServices: function() {
		var sAvailableServices = oMailFromUtil.getPreference("char", oMailFromUtil.prefAvailableServices)
		oMailFromUtil.debug("Available services: " + sAvailableServices)
		return sAvailableServices
	},
	
	// Gets the key for the default selected mail service
	getPreferenceDefaultServiceKey: function() {
		var sServiceKey = oMailFromUtil.getPreference("char", oMailFromUtil.prefDefaultService)
		oMailFromUtil.debug("Default sServiceKey: " + sServiceKey)
		return sServiceKey
	},
	
	// Returns method for opening web mail services
	getPreferenceOpenIn: function(sServiceKey) {
		var iOpenIn = oMailFromUtil.getPreference("int", oMailFromUtil.prefOpenIn)
		oMailFromUtil.debug("iOpenIn: " + iOpenIn)
		return iOpenIn
	},
	
	// Returns whether the service is enabled or not
	getPreferenceServiceEnabled: function(sServiceKey) {
		var sServiceEnabledPref = oMailFromUtil.prefServicePrefix + sServiceKey + oMailFromUtil.prefServiceEnabledSuffix
		var sServiceEnabled = oMailFromUtil.getPreference("bool", sServiceEnabledPref)
		oMailFromUtil.debug("sServiceEnabled: " + sServiceEnabled)
		return sServiceEnabled
	},
	
	// Returns the name of the preference with sServiceCode
	getPreferenceServiceName: function(sServiceKey) {
		var sServiceNamePref = oMailFromUtil.prefServicePrefix + sServiceKey + oMailFromUtil.prefServiceNameSuffix
		var sServiceName = oMailFromUtil.getPreference("char", sServiceNamePref)
		oMailFromUtil.debug("sServiceName: " + sServiceName)
		return sServiceName
	},
	
	// Gets the key for the default selected mail service
	getPreferenceServiceUrl: function(sServiceKey) {
		var sServiceUrlPref = oMailFromUtil.prefServicePrefix + sServiceKey + oMailFromUtil.prefServiceUrlSuffix
		var sServiceUrl = oMailFromUtil.getPreference("char", sServiceUrlPref)
		oMailFromUtil.debug("sServiceUrl: " + sServiceUrl)
		return sServiceUrl
	},
	
	// Retrieve a preference
	getPreference: function(sType, sName) {
		var prefValue = null
		
		if (sType=='bool') {
			prefValue = oMailFromUtil.prefService.getBoolPref(sName)
		} else if (sType=='char') {
			prefValue = oMailFromUtil.prefService.getCharPref(sName)
		} else if (sType=='int') {
			prefValue = oMailFromUtil.prefService.getIntPref(sName)
		}
		return prefValue
	},
	
	/*
	 * A simple debug method.  This can be switched on by updated the preference 'extensions.mailfrom.debug' in about:config
	 */
	debug: function(aMessage) {
		if (oMailFromUtil.getPreference('bool', oMailFromUtil.prefLogMessages))
			oMailFromUtil.gConsoleService.logStringMessage('mailfrom: ' + aMessage)
	}
}
