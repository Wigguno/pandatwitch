// ==UserScript==
// @name         Panda Twitch Chat
// @version      1.5
// @description  Modifies Panda.tv to be more like twitch theater mode
// @author       wigguno
// @match        http://www.panda.tv/roomframe/*
// @downloadURL  https://github.com/Wigguno/pandatwitch/raw/master/pandatwitch.user.js
// @updateURL    https://github.com/Wigguno/pandatwitch/raw/master/pandatwitch.user.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://rawgit.com/Wigguno/pandatwitch/master/known_associations.js
// @grant        GM_log
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

var twitch_lut = {
    "3331":"eternalenvyy",
    "3332":"arteezy",
    "3333":"universedota",
    "3334":"puppey",
    "3335":"pieliedie"};

function RoomLoaded()
{
    //console.info("Room Loaded...");
    
    var url = window.location.href.split("/");
    var id = url[url.length-1];
    
    var twitch_room = twitch_lut[id];
    
    $(".room-chat-box").html("<iframe src='http://www.twitch.tv/" + twitch_room + "/chat' width='100%' height='100%'></iframe>");
}

(function() {
    'use strict';
    console.info('Loading Panda.TV Script');
    waitForKeyElements (".room-chat-box", RoomLoaded);

})();