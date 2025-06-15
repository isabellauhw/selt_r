// static/utils.js
// Helper functions used in multiple experiments
function Pass(){}

// Handle buttons
function bind_to_key(func, key){
    // Given a function, and a numeric keycode,
    // set the function to run once the appropriate key is pressed.
    // If not provided, the key default to 32 (the spacebar)
    key = key || 32;
    $(document)
        .off('keydown')  // Remove any other key bindings
        .on('keydown', function(e){
            let k = (typeof e.which == "number") ? e.which : e.keyCode;
            if(k == key){
                $(document).off('keydown');
                func(e);
            }
        });
}


function reset_subject_nr(){
    // Check the cookies for a subject number.
    // If none found, generate a random one and save to cookies.
    let subject_nr = Math.round(Math.random()*1000000000);
    localStorage['subject_nr'] = subject_nr;
    return subject_nr;
}

function get_subject_nr(){
    // Check the cookies for a subject number.
    // If none found, generate a random one and save to cookies.
    let subject_nr = localStorage['subject_nr'];
    subject_nr = (typeof subject_nr === 'undefined') ? reset_subject_nr() : subject_nr;
    return subject_nr;
}

function on_resize(){
  // Call
  // $( window ).resize(_.debounce(resize, 100));
  // in your script to keep track of the size of the window.
  // The `state` variable must already exist.
  state.width =  $( window ).width();
  state.height =  $( window ).height();
};

function generate_random_list(length){
    // Random numbers from 0 to (length-1)
    return _.shuffle(_.range(length));
};

function flip(probability){
    // Flip a (optionally biased) coin
    if(arguments.length == 0) probability = .5;
    if(arguments.length > 0 & probability == undefined){
        throw(': undefined value passed to the flip() function');
    }
    var r = Math.random();
    return Number(r < probability);
}

function random_normal(mu, sigma) {
    // Standard Normal variate using Box-Muller transform.
    // Defaults to N(0, 1)
    mu = mu || 0;
    sigma  = sigma || 1;
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return mu + sigma*Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function send_ajax(url, data){
    // Try to send some data to the url provided, and print the response.
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        success: function(res) { console.log(res); }
    });
}

function repeat(vals, n){
    // Create array that repeats each of `values` `n` times.
    if(typeof(n)=='number'){
        // Single n
        return _.flatMap(vals, v => Array(n).fill(v));
    } else {
        // Array of ns
        return _.flatten(_.zip(vals, n).map(
            x => Array(x[1]).fill(x[0])));
    }
}

// function repeat(vals, n){
//     // WORKS ON I.E.
//     // Create array that repeats each of `values` `n` times.
//     if(typeof(n)=='number'){
//         // Single n
//         return _.flatMap(vals, v => _.fill(Array(n), v));
//     } else {
//         // Array of ns
//         return _.flatten(_.zip(vals, n).map(
//             x => _.fill(Array(x[1]), x[0])));
//     }
// };


function select_everything(parent='#gorilla'){
    return $(parent).find('*');
}

function show_everything(parent='#gorilla'){
    return select_everything(parent).show();
}
function hide_everything(parent='#gorilla'){
    return select_everything(parent).hide();
}


function preload(arrayOfImages) {
    $(arrayOfImages).each(function () {
        $('<img />').attr('src',this).appendTo('body').css('display','none');
    });
}
function update_pars_from_urls(globals, url) {
    if(!url) url = location.search;
    let query = url.substr(1);
    let existing_keys = Object.keys(globals);
    query.split("&").forEach(function(part) {
        var item = part.split("=");
        let key = item[0];
        let val = decodeURIComponent(item[1]);
        let val_as_int = parseInt(val);
        val = isNaN(val_as_int) ? val : val_as_int;
        if(existing_keys.indexOf(key) > -1){
            console.log('Setting ', key, ' =', val)
            globals[key] = val;
        }
    });
    return globals;
}

function fast_finish(){
    state.trial_nr = 999;
    state.block_nr = 999;
};

// screenfull.js
!function(){"use strict";var c="undefined"!=typeof window&&void 0!==window.document?window.document:{},e="undefined"!=typeof module&&module.exports,s=function(){for(var e,n=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],l=0,r=n.length,t={};l<r;l++)if((e=n[l])&&e[1]in c){for(l=0;l<e.length;l++)t[n[0][l]]=e[l];return t}return!1}(),l={change:s.fullscreenchange,error:s.fullscreenerror},n={request:function(t,u){return new Promise(function(e,n){var l=function(){this.off("change",l),e()}.bind(this);this.on("change",l);var r=(t=t||c.documentElement)[s.requestFullscreen](u);r instanceof Promise&&r.then(l).catch(n)}.bind(this))},exit:function(){return new Promise(function(e,n){var l,r;this.isFullscreen?(l=function(){this.off("change",l),e()}.bind(this),this.on("change",l),(r=c[s.exitFullscreen]())instanceof Promise&&r.then(l).catch(n)):e()}.bind(this))},toggle:function(e,n){return this.isFullscreen?this.exit():this.request(e,n)},onchange:function(e){this.on("change",e)},onerror:function(e){this.on("error",e)},on:function(e,n){e=l[e];e&&c.addEventListener(e,n,!1)},off:function(e,n){e=l[e];e&&c.removeEventListener(e,n,!1)},raw:s};s?(Object.defineProperties(n,{isFullscreen:{get:function(){return Boolean(c[s.fullscreenElement])}},element:{enumerable:!0,get:function(){return c[s.fullscreenElement]}},isEnabled:{enumerable:!0,get:function(){return Boolean(c[s.fullscreenEnabled])}}}),e?module.exports=n:window.screenfull=n):e?module.exports={isEnabled:!1}:window.screenfull={isEnabled:!1}}();
