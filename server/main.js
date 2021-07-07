import { Meteor } from "meteor/meteor";
import "../imports/api/games.js";
import "../imports/api/wiki.js";

/*aecheverrir: aqui se define el idioma de la pagina*/
import { WebApp } from 'meteor/webapp';
WebApp.addHtmlAttributeHook(() => ({ lang: 'en' }));

Meteor.startup(() => {
	// code to run on server at startup
});
