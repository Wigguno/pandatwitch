// ==UserScript==
// @name         Panda Twitch Chat
// @version      1.7
// @description  Modifies Panda.tv to be more like twitch theater mode
// @author       wigguno, hherman1
// @match        http://www.panda.tv/*
// @downloadURL  https://github.com/Wigguno/pandatwitch/raw/master/pandatwitch.user.js
// @updateURL    https://github.com/Wigguno/pandatwitch/raw/master/pandatwitch.user.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// ==/UserScript==

var twitch_lut = {
    "3331":"eternalenvyy",
    "3332":"arteezy",
    "3333":"universedota",
    "3334":"puppey",
    "3335":"pieliedie",
    "-1":"arteezy"};

function LiveListLoaded()
{
    //console.info("LiveList Loaded...");
    var livelist = $(".live-list");
    livelist.find("li").each( function ( i ) {
        $(this).click(function() {
            var clickedid = $(this).attr("data-roomid");
            $(".live-room").html("<iframe id='pandatwitch-iframe' src='/roomframe/" + clickedid + "?hideNotice=true&hideHeadManage=true&version=10' frameborder='0' scrolling='no' style='width: 100%; height: 100%;'></iframe>");
        });
    });
}

function ChatLoaded()
{
    // Load panda dark theme
	$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'http://s8.pdim.gs/static/832dc30fa539c366.css') );
    $("head").append( $("<style>body {background-color:#2b2b2b;}</style>") );

    var url = window.location.href.split("/");
    var id = url[url.length-1].split("?")[0];

    //console.info("Embedding ID: " + id);
    if (!(id in twitch_lut))
        id = -1;
    if ( id in twitch_lut )
        $(".room-chat-box").html("<iframe src='http://www.twitch.tv/" + twitch_lut[id] + "/chat' width='100%' height='100%'></iframe>");

    else{
        console.info("Room ID Not found in associations");
        return;
    }

    // now some style tweaks
    //$(".room-bamboo-container").remove();
    //$(".room-gift-container").remove();
    //$(".room-foot-split").remove();

    $(".room-task-container").after("<div class='ptv-button' style='float:right;height:100%;background-color:#eee;display:flex;padding-right:15px;padding-left:15px;margin-left:10px;align-items:center;'>Fullscreen</div>");

    // get the target address based on wether we are in an iframe or not.
    var target_addr;
    if (window.frameElement) {
        target_addr = "http://www.panda.tv/roomframe/" + id + "?hideNotice=true&hideHeadManage=true";
        $(".ptv-button").html("Fullscreen");
    }
    else {
        target_addr = "http://www.panda.tv/act/secret2016.html";
        $(".ptv-button").html("Secret Splash");
    }

    $(".ptv-button").click(function() {
        window.top.location.href = target_addr;
    });

}

(function() {
    'use strict';
    //console.info('Loading Panda.TV Script');

    // delete referrers to roomframe
    if (location.href.indexOf("roomframe") != -1 && document.referrer.split('/')[2] != location.hostname) location.reload();

    waitForKeyElements (".live-list", LiveListLoaded);
    waitForKeyElements (".room-chat-box", ChatLoaded);
    waitForKeyElements (".room-rank-container", function() {$(".room-rank-container").remove();});
})();