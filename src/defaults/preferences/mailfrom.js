pref("extensions.mailfrom.debug", false);
pref("extensions.mailfrom.default.service", "default");
pref("extensions.mailfrom.open.in", 2);
//pref("extensions.mailfrom.services", "default,gmail,windowslive,yahoomail");
pref("extensions.mailfrom.services", "default,gmail,yahoomail");
pref("extensions.mailfrom.service.default.enabled", true);
pref("extensions.mailfrom.service.default.name", "default");
pref("extensions.mailfrom.service.default.url", "");
pref("extensions.mailfrom.service.gmail.enabled", true);
pref("extensions.mailfrom.service.gmail.name", "GMail");
pref("extensions.mailfrom.service.gmail.url", "https://mail.google.com/mail/?view=cm&fs=1&to=$TO");
// Need to work out the compose email for hotmail.  Can't get around the AJAX interface so far
//pref("extensions.mailfrom.service.windowslive.enabled", true);
//pref("extensions.mailfrom.service.windowslive.name", "Windows Live");
//pref("extensions.mailfrom.service.windowslive.url", "https://mail.live.com/");
pref("extensions.mailfrom.service.yahoomail.enabled", true);
pref("extensions.mailfrom.service.yahoomail.name", "Yahoo Mail");
pref("extensions.mailfrom.service.yahoomail.url", "https://compose.mail.yahoo.com/?to=$TO");