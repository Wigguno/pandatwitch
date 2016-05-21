// ==UserScript==
// @name         Panda Twitch Chat
// @version      1.6
// @description  Modifies Panda.tv to be more like twitch theater mode
// @author       wigguno
// @match        http://www.panda.tv/*
// @downloadURL  https://github.com/Wigguno/pandatwitch/raw/master/pandatwitch.user.js
// @updateURL    https://github.com/Wigguno/pandatwitch/raw/master/pandatwitch.user.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://rawgit.com/Wigguno/pandatwitch/master/known_associations.js
// @resource     DarkTheme http://s8.pdim.gs/static/832dc30fa539c366.css
// @grant        GM_log
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

var twitch_lut = {
    "3331":"eternalenvyy",
    "3332":"arteezy",
    "3333":"universedota",
    "3334":"puppey",
    "3335":"pieliedie"};

function LiveListLoaded()
{
    //console.info("LiveList Loaded...");
    var livelist = $(".live-list");
    livelist.find("li").each( function ( i ) {
        $(this).click(function() {
            var clickedid = $(this).attr("data-roomid");
            $(".live-room").html("<iframe id='pandatwitch-iframe' src='/roomframe/" + clickedid + "?amp;hideNotice=true&amp;hideHeadManage=true&amp;version=10' frameborder='0' scrolling='no' style='width: 100%; height: 100%;'></iframe>");
        });
    });
}

function ChatLoaded()
{
    // Load panda dark theme
    var darktheme_css = GM_getResourceText("DarkTheme");
    GM_addStyle(darktheme_css);

    var url = window.location.href.split("/");
    var id = url[url.length-1].substr(0,4);

    //console.info("Embedding ID: " + id);
    if ( id in twitch_lut )
        $(".room-chat-box").html("<iframe src='http://www.twitch.tv/" + twitch_lut[id] + "/chat' width='100%' height='100%'></iframe>");
    else
        console.info("Room ID Not found in associations");

}

(function() {
    'use strict';
    //console.info('Loading Panda.TV Script');
    waitForKeyElements (".live-list", LiveListLoaded);
    waitForKeyElements (".room-chat-box", ChatLoaded);
})();