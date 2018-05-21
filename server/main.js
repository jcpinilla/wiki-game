import { Meteor } from "meteor/meteor";
import "../imports/api/games.js";
import "../imports/api/wiki.js";
/*
Tienen un problema de accesibilidad, puesto que el html no tiene atributo lang. En el servidor de meteor es posible inyectar código en el html
para evitar este problema
*/

Meteor.startup(() => {
	// code to run on server at startup
});
