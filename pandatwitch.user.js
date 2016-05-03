// ==UserScript==
// @name         Panda Twitch Chat
// @version      1.0
// @description  Modifies Panda.tv to be more like twitch theater mode
// @author       wigguno
// @match        http://www.panda.tv/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_getValue
// @grant        GM_setValue
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
var b_insert_twitch    = GM_getValue('insert_twitch', true);
var b_move_panda       = GM_getValue('move_panda', false);
var b_rearrange_footer = GM_getValue('rearrange_footer', true);
var b_remove_detail    = GM_getValue('remove_detail', true);
var b_darktheme        = GM_getValue('darktheme', true);

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

    // Insert PTC settings
    document.getElementsByClassName("room-head-info-cover")[0].onclick = PTC_settings;
}

var settings_panel= -1;

function PTC_settings() {

    if (settings_panel == -1)
    {
        settings_panel = document.createElement("div");

        settings_panel.style.zIndex  = "200";
        settings_panel.style.position = "absolute";
        settings_panel.style.top = "45%";
        settings_panel.style.left = "45%";
        settings_panel.style.width = "200px";

        settings_panel.style.padding = "10px";
        settings_panel.style.background = "#454545";
        settings_panel.style.color = "white";

        var ptcset_title = document.createElement('div');
        ptcset_title.className = "ptc_set_input";
        ptcset_title.innerHTML = "<center><b>Twitch Chat for Panda</b></center>";
        settings_panel.appendChild(ptcset_title);

        var ptcset_warning = document.createElement('div');
        ptcset_warning.className = "ptc_set_input";
        ptcset_warning.innerHTML = "Most settings require a refresh";
        ptcset_warning.style.marginBottom = "15px";
        settings_panel.appendChild(ptcset_warning);

        var c;
        c = b_insert_twitch ? "checked" : "";
        var ptcset_inserttwitch = document.createElement('div');
        ptcset_inserttwitch.innerHTML = "<input type='checkbox' " + c + " style='margin-right: 5px' value='twitch' /> Insert Twitch Chat";
        ptcset_inserttwitch.className = "ptc_set_input";
        ptcset_inserttwitch.firstChild.onclick = validateSettings;
        settings_panel.appendChild(ptcset_inserttwitch);

        c = b_move_panda ? "checked" : "";
        var ptcset_movepanda = document.createElement('div');
        ptcset_movepanda.innerHTML = "<input type='checkbox' " + c + "  style='margin-right: 5px' value='panda' /> Move Panda Chat";
        ptcset_movepanda.className = "ptc_set_input";
        ptcset_movepanda.firstChild.onclick = validateSettings;
        settings_panel.appendChild(ptcset_movepanda);

        c = b_rearrange_footer ? "checked" : "";
        var ptcset_refooter = document.createElement('div');
        ptcset_refooter.innerHTML = "<input type='checkbox' " + c + "  style='margin-right: 5px' value='footer' /> Rearrange Footer";
        ptcset_refooter.className = "ptc_set_input";
        ptcset_refooter.firstChild.onclick = validateSettings;
        settings_panel.appendChild(ptcset_refooter);

        c = b_remove_detail ? "checked" : "";
        var ptcset_remdetail = document.createElement('div');
        ptcset_remdetail.innerHTML = "<input type='checkbox' " + c + "  style='margin-right: 5px' value='detail' /> Remove Detail";
        ptcset_remdetail.className = "ptc_set_input";
        ptcset_remdetail.firstChild.onclick = validateSettings;
        settings_panel.appendChild(ptcset_remdetail);

        c = b_darktheme ? "checked" : "";
        var ptcset_darktheme = document.createElement('div');
        ptcset_darktheme.innerHTML = "<input type='checkbox' " + c + "  style='margin-right: 5px'value='dark'  /> Dark Theme";
        ptcset_darktheme.className = "ptc_set_input";
        ptcset_darktheme.firstChild.onclick = validateSettings;
        settings_panel.appendChild(ptcset_darktheme);

        var ptcset_close = document.createElement('div');
        ptcset_close.innerHTML = "<center><button type='button'>Close</button></center>";
        ptcset_close.className = "ptc_set_input";
        ptcset_close.firstChild.onclick = PTC_settings;
        ptcset_close.style.marginTop = "10px";
        settings_panel.appendChild(ptcset_close);

        document.body.appendChild(settings_panel);
    }
    else
    {
        validateSettings();

        settings_panel.parentNode.removeChild(settings_panel);
        settings_panel= -1;
    }
}

function validateSettings()
{
    for(var i = 0; i < settings_panel.childNodes.length; i++)
        {
            if (settings_panel.childNodes[i].firstChild.value === undefined)
                continue;

            var key = settings_panel.childNodes[i].firstChild.value;
            var val = settings_panel.childNodes[i].firstChild.checked;
            switch(key){
                case 'twitch':
                    b_insert_twitch = val;
                    break;
                case 'panda':
                    b_move_panda = val;
                    break;
                case 'footer':
                    b_rearrange_footer = val;
                    break;
                case 'detail':
                    b_remove_detail = val;
                    break;
                case 'dark':
                    b_darktheme = val;
                    break;
            }
        }
        GM_setValue('insert_twitch', b_insert_twitch);
        GM_setValue('move_panda', b_move_panda);
        GM_setValue('rearrange_footer', b_rearrange_footer);
        GM_setValue('remove_detail', b_remove_detail);
        GM_setValue('darktheme', b_darktheme);
        update_css_settings();
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
{
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

var v_css_move_panda = {val:-1};
var v_css_rearranged_footer = {val:-1};
var v_css_darktheme = {val:-1};

update_css_settings();
function update_css_settings()
{
    if (b_move_panda === true) {
        enable_css(v_css_move_panda, css_move_panda);
    }
    else {
        disable_css(v_css_move_panda);
    }

    if (b_rearrange_footer === true) {
        enable_css(v_css_rearranged_footer, css_rearranged_footer);
    }
    else {
        disable_css(v_css_rearranged_footer);
    }

    if (b_darktheme === true) {
        enable_css(v_css_darktheme, css_darktheme);
    }
    else {
        disable_css(v_css_darktheme);
    }
}

function enable_css(v_css, css)
{
    if (v_css.val == -1)
        v_css.val = addStyle(css);
}
function disable_css(v_css)
{
    if (v_css.val != -1)
    {
        document.getElementsByTagName('head')[0].removeChild(v_css.val);
        v_css.val = -1;
    }
}