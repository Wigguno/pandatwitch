// ==UserScript==
// @name         Panda Twitch Chat No Theater
// @version      0.1
// @description  Modifies Panda.tv to be more like twitch theater mode
// @author       wigguno
// @match        http://www.panda.tv/*
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==

// check if we have a twitch chat to link. If not, don't run the script
var url = window.location.href.split("/");
var id = url[url.length-1];
var twitch_lut = {"3331":"eternalenvyy", "3332":"arteezy", "3333":"universedota", "3334":"puppey", "3335":"pieliedie"};
if (!(id in twitch_lut))
    return;

var twitch_username = twitch_lut[id];
waitForKeyElements (".room-rank-container", () => {document.getElementsByClassName("room-chat-box")[0].innerHTML="<iframe src='https://www.twitch.tv/" + twitch_username + "/chat' width='100%' height='100%'></iframe>";});
