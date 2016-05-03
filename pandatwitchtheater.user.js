// ==UserScript==
// @name         Panda Twitch Chat
// @version      0.1
// @description  Modifies Panda.tv to be more like twitch theater mode
// @author       wigguno
// @match        http://www.panda.tv/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// ==/UserScript==

// check if we have a twitch chat to link. If not, don't run the script
var url = window.location.href.split("/");
var id = url[url.length-1];
var twitch_lut = {"3331":"eternalenvyy", "3332":"arteezy", "3333":"universedota", "3334":"puppey", "3335":"pieliedie"};
if (!(id in twitch_lut))
    return;

var twitch_username = twitch_lut[id];
waitForKeyElements (".room-rank-container", PTC);

// Close Sidebar entirely
GM_addStyle(".close-state .side-tools-bar-container                         { width: 0px !important; }");
GM_addStyle(".close-state .side-tools-bar-container .bottom-fixed-container { display: none !important; }");
GM_addStyle(".close-state .side-tools-bar-container .room-chat-container    { display: none !important; }");
GM_addStyle(".close-state .side-tools-bar-container .room-chat-dispatch     { display: none !important; }");
GM_addStyle("#room_matrix.close-state .room-container .room-content-box     { padding-left: 15px; !important; }");

// Move chat box over
GM_addStyle(".room-container .room-chat-box                                 { right: 0px !important; }");
GM_addStyle(".room-container .room-content-box                              { padding-right: 335px !important; }");
GM_addStyle(".room-container .room-chat-expand-btn                          { right: 320px; !important; }");

// Chat collapse fixes
GM_addStyle(".room-container.room-chat-collesped .room-chat-expand-btn      { right: 0px !important;}");
GM_addStyle(".room-container.room-chat-collesped .room-content-box          { padding-right: 15px !important;}");

// Darken Background
GM_addStyle(".room-container                                                { background-color: #303030 !important; }");
GM_addStyle(".room-container .room-chat-box                                 { border: none !important; }");
GM_addStyle(".room-container .room-chat-expand-btn                          { background: 0; background-color: #2D2D2D !important; border-radius: 10px 0px 0px 10px; }");
GM_addStyle(".room-chat-expand-btn:hover                                    { background-color: #242428 !important; }");
GM_addStyle(".room-foot-box                                                 { background-color: #303030 !important; border: none !important; }");

// Center the video player
GM_addStyle(".room-container .room-player-box                               { padding-top: 15px !important; }");

// Move Panda Chat to left sidebar
GM_addStyle("#room_matrix.open-state .room-container .room-content-box      { padding-left: 345px; !important; }");
GM_addStyle(".side-tools-bar-container                                      { width: 320px !important; }");

// some styling for the bottom bar
// GM_addStyle(".room-head-info-cover {position: absolute; top: 9px; left: 9px; width: 70px; height: 70px;}");
GM_addStyle(".room-head-info                                                { border: none !important; background: none !important; }");
GM_addStyle(".room-head-info-title, .room-head-info-detail                  { color: white !important; }");
GM_addStyle(".room-viewer-num, .room-bamboo-num                             { color: white !important; }");

function PTC() {
    // Delete all the elements from the old sidebar
    var sidebar = document.getElementById("room_sidebar_container");
    var pandachat = document.getElementsByClassName("room-chat-box")[0];

    while (pandachat.childNodes.length > 1) {
        if (!has_class(sidebar.firstChild, "toggle-container"))
            break;
    }

    // Move all elements from old chat to new chat
    while (pandachat.childNodes.length > 0) {
        sidebar.appendChild(pandachat.childNodes[0]);
    }

    // remove_element_by_class("room-foot-box");
    remove_element_by_class("room-foot-split");
    remove_element_by_class("room-task-container");
    remove_element_by_class("room-bamboo-container");
    remove_element_by_class("room-gift-container");

    // Add elements to the bottom bar
    var foot_box = document.getElementsByClassName("room-foot-box")[0];
    var info_box = document.getElementsByClassName("room-head-info")[0];
    foot_box.appendChild(info_box);
    info_box.appendChild(document.getElementsByClassName("room-bamboo-num")[0]);
    info_box.appendChild(document.getElementsByClassName("room-viewer-num")[0]);

    remove_element_by_class("room-head-box");
    remove_element_by_class("room-detail-box");
    remove_element_by_class("room-scrollbar-bg");

    document.getElementsByClassName("room-chat-box")[0].innerHTML="<iframe src='https://www.twitch.tv/" + twitch_username + "/chat' width='100%' height='100%' />";
}

function remove_element_by_class(c) {
    var el = document.getElementsByClassName(c)[0];
    el.parentNode.removeChild(el);
}
function has_class(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}