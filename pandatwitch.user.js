// ==UserScript==
// @name         Panda Twitch Chat
// @version      0.9
// @description  Modifies Panda.tv to be more like twitch theater mode
// @author       wigguno
// @match        http://www.panda.tv/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM_log
// ==/UserScript==

// check if we have a twitch chat to link. If not, don't run the script
var url = window.location.href.split("/");
var id = url[url.length-1];
var twitch_lut = {"3331":"eternalenvyy", "3332":"arteezy", "3333":"universedota", "3334":"puppey", "3335":"pieliedie"};
if (!(id in twitch_lut))
    return;

var twitch_username = twitch_lut[id];
waitForKeyElements (".room-rank-container", PTC);

// ------------------------------------------------------------------------------------------------------------------------
// Settings
var b_insert_twitch = true;
var b_move_panda = true;
var b_rearrange_footer = true;
var b_remove_detail = true;
var b_darktheme = true;

// ------------------------------------------------------------------------------------------------------------------------
// Chat Loaded callback
function PTC() {
    // Move panda chat to the right sidebar
    if (b_move_panda === true)
        move_ptv();

    // Move header information into a consolidated footer
    if (b_rearrange_footer === true)
        rearrange_footer();

    // Show details
    if (b_remove_detail === true)
        remove_element_by_class("room-detail-box");

    // Insert twitch chat
    if (b_insert_twitch === true)
        document.getElementsByClassName("room-chat-box")[0].innerHTML="<iframe src='https://www.twitch.tv/" + twitch_username + "/chat' width='100%' height='100%' />";
}

// ------------------------------------------------------------------------------------------------------------------------
// Theater Mode functions
function move_ptv()
{
    // Delete all the elements from the old sidebar
    var sidebar = document.getElementById("room_sidebar_container");
    var pandachat = document.getElementsByClassName("room-chat-box")[0];

    for (var i = 0; i < sidebar.childNodes.length; i++) {
        if (has_class(sidebar.firstChild, "toggle-container") === false)
            sidebar.removeChild(sidebar.firstChild);
    }

    // Move all elements from old chat to new chat
    while (pandachat.childNodes.length > 0) {
        sidebar.appendChild(pandachat.childNodes[0]);
    }

}

function rearrange_footer()
{    // remove_element_by_class("room-foot-box");
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
}

// ------------------------------------------------------------------------------------------------------------------------
// Helper Functions
function remove_element_by_class(c) {
    var el = document.getElementsByClassName(c)[0];
    el.parentNode.removeChild(el);
}
function has_class(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
function addStyle(css){
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(s);
    return s;
}

// ------------------------------------------------------------------------------------------------------------------------
// CSS Fixes

// Close Sidebar entirely
var css_close_sidebar = "" +
".close-state .side-tools-bar-container                         { width: 0px !important; }" +
".close-state .side-tools-bar-container .room-chat-dispatch     { display: none !important; }" +
".close-state .side-tools-bar-container .bottom-fixed-container { display: none !important; }" +
"#room_matrix.close-state .room-container .room-content-box     { padding-left: 15px; !important; }" +
".room-container.room-chat-collesped .room-chat-expand-btn      { right: 0px !important;}" +
"#room_matrix.open-state .room-container .room-content-box      { padding-left: 345px; !important; }";

// Move chat box over
var css_move_panda = ""+
".side-tools-bar-container                                      { width: 320px !important; }"+
".room-container .room-chat-box                                 { right: 0px !important; }"+
".room-container .room-chat-expand-btn                          { right: 320px; !important; }" + css_close_sidebar;

// Darken Background
var css_darktheme = ""+
".room-container                                                { background-color: #303030 !important; }"+
".room-container .room-chat-box                                 { border: none !important; }"+
".room-container .room-chat-expand-btn                          { background: 0; background-color: #2D2D2D !important; border-radius: 10px 0px 0px 10px; }"+
".room-chat-expand-btn:hover                                    { background-color: #242428 !important; }"+
".room-foot-box                                                 { background-color: #303030 !important; }"+
".room-container .room-foot-box                                 { border: none !important; }"+
".room-head-info                                                { border: none !important; background: none !important; }"+
".room-head-info-title, .room-head-info-detail                  { color: white !important; }"+
".room-viewer-num, .room-bamboo-num                             { color: white !important; }";

// rearrange footer
var css_rearranged_footer = ""+
".room-container .room-player-box                               { padding-top: 15px !important; }"+
".room-foot-box                                                 { background: none !important; border: none !important; padding-bottom: 50px !important;}"+
".room-foot-box                                                 { padding: 5px !important;}"+
".room-head-info                                                { padding-right: 30px !important}";

var v_css_move_panda;
var v_css_rearranged_footer;
var v_css_darktheme;

if (b_move_panda === true) {
    //GM_log('[css] moving panda chat');
    enable_css(v_css_move_panda, css_move_panda);
}

if (b_rearrange_footer === true) {
    //GM_log('[css] rearranging footer');
    enable_css(v_css_rearranged_footer, css_rearranged_footer);
}

if (b_darktheme === true) {
    //GM_log('[css] enabling dark theme');
    enable_css(v_css_darktheme, css_darktheme);
}

function enable_css(v_css, css)
{
    if (v_css === undefined)
        v_css = addStyle(css);
}
function disable_css(v_css)
{
    if (v_css !== null)
        document.getElementsByTagName('head')[0].removeChild(v_css);
}