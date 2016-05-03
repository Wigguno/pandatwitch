// ==UserScript==
// @name         Panda Twitch Chat
// @version      1.1
// @description  Modifies Panda.tv to be more like twitch theater mode
// @author       wigguno, hherman1
// @match        http://www.panda.tv/*
// @updateURL    https://github.com/Wigguno/pandatwitch/raw/master/pandatwitch.user.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// check if we have a twitch chat to link. If not, don't run the script
var url = window.location.href.split("/");
var id = url[url.length-1];

var localstorage_settings_id = "panda-settings";
var default_associations = {"3331":"eternalenvyy", "3332":"arteezy", "3333":"universedota", "3334":"puppey", "3335":"pieliedie"};

var twitch_lut = getSettings();


if (!(id in twitch_lut)) id = -1; // default to whatever you set to -1
var twitch_username = twitch_lut[id];
waitForKeyElements (".room-rank-container", PTC);

// ------------------------------------------------------------------------------------------------------------------------
// Settings
var b_insert_twitch    = GM_getValue('insert_twitch', true);
var b_move_panda       = GM_getValue('move_panda', false);
var b_rearrange_footer = GM_getValue('rearrange_footer', true);
var b_remove_detail    = GM_getValue('remove_detail', true);
var b_darktheme        = GM_getValue('darktheme', true);
var b_settings = true;

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

    if (b_settings === true) {
        add_settings();
    }
}

// ------------------------------------------------------------------------------------------------------------------------
// Settings functions

function add_settings()
{
    var parent = (b_rearrange_footer) ? $(".room-head-info") : $(".room-foot-box");
    var settings_menu = $(	"<div class=panda-twitch-settings>" +
					"<div class=content>"+
						"<div class=panda-twitch-dropdown>" +
							"<ul id=panda-twitch-chat-conversions>" +
							"</ul>" +
							"<hr></hr>"+
							"<div class='settings-table-container' id=association-adder>"+
								"<table>"+
									"<tr> <td>PandaTV ID</td> <td><input type=text name=panda-id></input></td></tr>"+
									"<tr> <td>Twitch Account Name</td> <td><input type=text name=twitch-name></input></td></tr>"+
									"<tr> <td><button id=add-relationship> Add/Update </button></td> <td> <button id=reset-relationships> Reset to Defaults </button></tr>" +
								"</table>"+
							"</div>"+
							"<hr></hr>"+
							"<div class='settings-table-container' id=settings-table>"+
								"<center><table>"+
									"<tr> <td>Insert Twitch Chat</td> <td><input type=checkbox id=ptset-twitch></input></td></tr>"+
									"<tr> <td>Move Panda Chat</td>    <td><input type=checkbox id=ptset-panda></input></td></tr>"+
									"<tr> <td>Rearrange Footer</td>   <td><input type=checkbox id=ptset-footer></input></td></tr>"+
									"<tr> <td>Remove Detail</td>      <td><input type=checkbox id=ptset-detail></input></td></tr>"+
									"<tr> <td>Dark Theme</td>         <td><input type=checkbox id=ptset-dark></input></td></tr>"+
								"</table></center>"+
							"</div>" +
						"</div>" +
					"</div>"+
					"<div class=dropdown-opener>" +
						"PandaTwitch Settings" +
					"</div>" +
				"</div>");
    $("#panda-twitch-chat-conversions",settings_menu).append(generateAssociationsDOM()); // add existing settings
    $(".panda-twitch-dropdown",settings_menu).hide(); // hide by default
    $(".dropdown-opener",settings_menu).click(function(){
        $(".panda-twitch-dropdown",settings_menu).toggle(); // open on click
    });
    $("#association-adder input",settings_menu).keyup(function(event){
	    if(event.keyCode == 13){
	        $("#association-adder #add-relationship").click();
	    }
    });
    $("#association-adder #add-relationship",settings_menu).click(function() {
    	var old_height = $(".panda-twitch-dropdown",settings_menu).prop("scrollHeight");
    	var scroll =  $(".panda-twitch-dropdown",settings_menu).scrollTop();
        var panda_tv_id = $("#association-adder [name=panda-id]",settings_menu).val();
        var twitch_name = $("#association-adder [name=twitch-name]",settings_menu).val();
        add_association(panda_tv_id,twitch_name);
        $("#panda-twitch-chat-conversions",settings_menu).empty(); // refresh all old assocations
        $("#panda-twitch-chat-conversions",settings_menu).append(generateAssociationsDOM());// show new association
        $(".panda-twitch-dropdown",settings_menu).scrollTop(scroll + $(".panda-twitch-dropdown",settings_menu).prop("scrollHeight") - old_height);
        $("#association-adder input",settings_menu).val(''); //clear inputs
    });
    $("#association-adder #reset-relationships",settings_menu).click(function() {
    	var old_height = $(".panda-twitch-dropdown",settings_menu).prop("scrollHeight");
    	var scroll =  $(".panda-twitch-dropdown",settings_menu).scrollTop();
        setSettings(default_associations);
        $("#panda-twitch-chat-conversions",settings_menu).empty(); // refresh all old assocations
        $("#panda-twitch-chat-conversions",settings_menu).append(generateAssociationsDOM());// show new association
        $(".panda-twitch-dropdown",settings_menu).scrollTop(scroll + $(".panda-twitch-dropdown",settings_menu).prop("scrollHeight") - old_height);
        $("#association-adder input",settings_menu).val(''); //clear inputs
    });
    $("#settings-table #ptset-twitch", settings_menu).prop('checked', b_insert_twitch);
    $("#settings-table #ptset-twitch", settings_menu).click(function() {
        b_insert_twitch = $("#settings-table #ptset-twitch",settings_menu).prop('checked');
        GM_setValue('insert_twitch', b_insert_twitch);
        update_css_settings();
    });

    $("#settings-table #ptset-panda", settings_menu).prop('checked', b_move_panda);
    $("#settings-table #ptset-panda", settings_menu).click(function() {
        b_move_panda = $("#settings-table #ptset-panda",settings_menu).prop('checked');
        GM_setValue('move_panda', b_move_panda);
        update_css_settings();
    });

    $("#settings-table #ptset-footer", settings_menu).prop('checked', b_rearrange_footer);
    $("#settings-table #ptset-footer", settings_menu).click(function() {
        b_rearrange_footer = $("#settings-table #ptset-footer",settings_menu).prop('checked');
        GM_setValue('rearrange_footer', b_rearrange_footer);
        update_css_settings();
    });

    $("#settings-table #ptset-detail", settings_menu).prop('checked', b_remove_detail);
    $("#settings-table #ptset-detail", settings_menu).click(function() {
        b_remove_detail = $("#settings-table #ptset-detail",settings_menu).prop('checked');
        GM_setValue('remove_detail', b_remove_detail);
        update_css_settings();
    });

    $("#settings-table #ptset-dark", settings_menu).prop('checked', b_darktheme);
    $("#settings-table #ptset-dark", settings_menu).click(function() {
        b_darktheme = $("#settings-table #ptset-dark",settings_menu).prop('checked');
        GM_setValue('darktheme', b_darktheme);
        update_css_settings();
    });
    parent.append(settings_menu);
}

function generateAssociationsDOM() {
    var out = $([]);
    var settings = getSettings();
    Object.keys(settings).forEach(function(key) {
        out = $.merge(out,generateAssociationDOM(key,settings[key]));
    });
    return out;
}
function generateAssociationDOM(panda_tv_id,twitch_name) {
    var out = $("<li> " + panda_tv_id + " -> " + twitch_name + " <button class=clear_association value="+panda_tv_id+"> Delete </button></li>");
    $("button",out).click(function() {
        delete_association($("button",out).val());
        out.remove();
    });
    return out;
}

function add_association(panda_tv_id,twitch_name) {
    var settings = getSettings();
    settings[panda_tv_id] = twitch_name.toLowerCase();
    setSettings(settings);
}
function delete_association(panda_tv_id) {
    var settings = getSettings();
    delete settings[panda_tv_id];
    setSettings(settings);
}
function getSettings() {
    try {
        return JSON.parse(GM_getValue(localstorage_settings_id, {}));
    } catch(e) {
        return default_associations;
    }
}
function setSettings(settings) {
    GM_setValue(localstorage_settings_id,JSON.stringify(settings));
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


var css_settings = ""+
".panda-twitch-settings                                         { position: relative; float:right; margin-right:10px; }"+
".panda-twitch-settings .dropdown-opener                        { background-color: white; padding: 10px;}"+
".panda-twitch-settings .dropdown-opener:hover                  { color:darkgray; cursor:pointer;}"+
".panda-twitch-settings .content                                { position:relative }"+
".panda-twitch-settings .panda-twitch-dropdown                  { position:absolute;right:0;bottom:0; background-color: white; display: inline-block; padding: 10px; max-height:500px; overflow-y:scroll;}"+
".panda-twitch-settings .panda-twitch-dropdown li               { margin:10px;}"+
".panda-twitch-settings .panda-twitch-dropdown li button        { float:right;}"+
".panda-twitch-settings .settings-table-container td            { padding:5px;}"+
".panda-twitch-settings .settings-table-container input         {}"+
".panda-twitch-settings .settings-table-container button        { margin:10px;}";

var v_css_move_panda = {val:-1};
var v_css_rearranged_footer = {val:-1};
var v_css_darktheme = {val:-1};
var v_css_settings = {val:-1};

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

if (b_settings === true) {
    //GM_log('[css] enabling dark theme');
    enable_css(v_css_settings, css_settings);
}

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
