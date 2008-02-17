pref("extensions.mailfrom.debug", false);
pref("extensions.mailfrom.default.service", "default");
pref("extensions.mailfrom.open.in", 2);
//pref("extensions.mailfrom.services", "default,aol,gmail,windowslive,yahoomail");
pref("extensions.mailfrom.services", "default,aol,gmail,yahoomailclassic");
pref("extensions.mailfrom.service.default.enabled", true);
pref("extensions.mailfrom.service.default.name", "System Mail Client");
pref("extensions.mailfrom.service.default.url", "");
pref("extensions.mailfrom.service.aol.enabled", true);
pref("extensions.mailfrom.service.aol.name", "AOL Mail");
// A multiline body does not work for AOL
pref("extensions.mailfrom.service.aol.url", "http://webmail.aol.com/Mail/ComposeMessage.aspx?to=$TO&subject=$SUBJECT&cc=$CC&bcc=$BCC");
pref("extensions.mailfrom.service.gmail.enabled", true);
pref("extensions.mailfrom.service.gmail.name", "GMail");
pref("extensions.mailfrom.service.gmail.url", "https://mail.google.com/mail/?view=cm&fs=1&to=$TO&su=$SUBJECT&cc=$CC&bcc=$BCC&body=$BODY");
// Need to work out the compose email for windows live.  Can't get around the AJAX interface so far
//pref("extensions.mailfrom.service.windowslive.enabled", true);
//pref("extensions.mailfrom.service.windowslive.name", "Windows Live");
//pref("extensions.mailfrom.service.windowslive.url", "https://mail.live.com/");
// Compose works for Yahoo! Mail Classic, but not for the AJAX version
pref("extensions.mailfrom.service.yahoomailclassic.enabled", true);
pref("extensions.mailfrom.service.yahoomailclassic.name", "Yahoo! Mail Classic");
pref("extensions.mailfrom.service.yahoomailclassic.url", "http://compose.mail.yahoo.com/?To=$TO&Subject=$SUBJECT&Cc=$CC&Bcc=$BCC&Body=$BODY");