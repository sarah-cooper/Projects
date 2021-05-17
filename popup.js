//GLOBAL VARIABLES
var refresh = document.getElementById("refresh");
var refresh_con = document.getElementById("refresh_container");
var pref = document.getElementById("preferences");
var pref_con = document.getElementById("preferences_container");
var profile = document.getElementById("profile");
var login_con = document.getElementById("login_container");
var setting = document.getElementById("settings");
var setting_save_button = document.getElementById("setting-save-btn");
var setting_con = document.getElementById("setting_container");
var current_trail_btn = document.getElementById("show_current_trail");
var current_trail_con = document.getElementById("current_trail");
var users_searches_btn = document.getElementById("show_users_searches");
var users_searches_con = document.getElementById("users_searches");
var login_submit = document.getElementById("login-submit");
var account_container = document.getElementById("account_container");
var logout = document.getElementById("logout-submit");
var signup = document.getElementById("signup-submit");
var hi_con = document.getElementById("hi");
var enable_disable_button = document.getElementById("enable_disable");
var e_d_con = document.getElementById("enable_disable_container");
var save_btn = document.getElementById("setting-save-btn");
var refresh_btn = document.getElementById("refresh_btn");
var dont_send = document.getElementById('send-data')

//State Variables
var sessionID = 0;
var enable_disable = 'false';
var global_username;
var send_log = 1;

//VARIABLES FOR BACKGROUND STUFF
let search_engines = ["https://www.google.com/search?q=", "https://www.youtube.com/results?search_query=", "https://www.reddit.com/search/?q="]
let url = search_engines[0];
let openedTab;

//////////////////////////////////////////////////////////////////////////////

//read messages sent back from background.js
//this is how the background and popup.js talk to each other
//FOR ALL MESSAGE STUFF FROM THE BACKGROUND.JS
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == 'auth') {
      if ((request.content.search('correct') != -1)) {
        var str = request.content.split(" ")
        account_container.style.display = "block";
        document.getElementById('users_name').innerHTML = str[1];
        sessionID = 1;
        global_username = str[1];
        enable_disable = request.flagset;
        if (enable_disable == 'true') {
          enable_disable_button.checked = 0;
        } else {
          enable_disable_button.checked = 1;
        }

      } else if ((request.content.search('exist') != -1)) {
        var str = request.content.split(" ");
        alert("Username "+str[1]+" does not exist");
        login_con.style.display = 'block';
      } else {
        alert("Incorrect Credentials");
        login_con.style.display = 'block';
      }
    }

    if(request.type == 'new_profile') {
    	updatelist(request.content)
    }

    if(request.type == 'user_refresh') {
      chrome.runtime.sendMessage({content: 'username: ' + global_username, type: "profile"});
    }
    if (request.type == "update_logs") {
      updatelog(request.content)
    }

    if(request.type == 'curr_profile') {
      if (request.answer == 'refresh') {
      run_matthews_code(request.content) }
      if (request.answer == 'current_trail') {
        updatelist(request.content)
      }
    }
    if (request.type == 'state_checked') {
      if (request.answer == 'logged_in') {
        sessionID = request.sessionID
        global_username = request.username
        enable_disable = request.enabledisable
        if (enable_disable == 'true') {
          enable_disable_button.checked = 0;
        } else {
          enable_disable_button.checked = 1;
        }
      }
    }
    if (request.type = 'dont_send_successful') {
      if (request.content == '0') {
      send_log = 0
      alert('Your search history will not be logged by Trailmix') }
    } 
    if (request.content == '1') {
      send_log = 1
    }

  })

//////////////////////////////////////////////////////////////////////////////

//when refresh butten is pushed, show the refresh container and hid all others
refresh.addEventListener('click', () => {
    check_state()
    if (refresh_con.style.display === "none") {
        refresh_con.style.display = "block";
      } else {
        refresh_con.style.display = "none";
      }

    pref_con.style.display = "none";
    login_con.style.display = "none";
    setting_con.style.display = "none"; 
    account_container.style.display = "none";
    });

//check if person is logged in this will either show the login page or account page
profile.addEventListener('click', () => {
  check_state()
    if (sessionID == 0) {
      if (login_con.style.display === "none") {
          login_con.style.display = "block";
        } else {
          login_con.style.display = "none";
        }

      pref_con.style.display = "none";
      refresh_con.style.display = "none";
      setting_con.style.display = "none"; 
      account_container.style.display = "none";

    } else if (sessionID == 1) {
      if (account_container.style.display === "none") {
        account_container.style.display = "block";
        document.getElementById('users_name').innerHTML = global_username;
      } else {
        account_container.style.display = "none";
      }

    pref_con.style.display = "none";
    refresh_con.style.display = "none";
    setting_con.style.display = "none"; 
    login_con.style.display = "none";
    }
    });

//when preferences butten is pushed, show the refresh container and hid all others
pref.addEventListener('click', () => {
    check_state()
    if (pref_con.style.display === "none") {
        pref_con.style.display = "block";
      } else {
        pref_con.style.display = "none";
      }
    refresh_con.style.display = "none";
    login_con.style.display = "none";
    setting_con.style.display = "none";
    account_container.style.display = "none";

    //wrapper function (if the extension is enabled then can run this functionality) This will be seen alot, I am not going to comment on all of them
    if (sessionID == 1 && enable_disable == 'true') { 
      var pref_time = get_time()[0]
      chrome.runtime.sendMessage({content: global_username, preftime: pref_time, type: "pref_time"}); }
    })

//settings container to show settings stuff
setting.addEventListener('click', () => {
    check_state()
    if (setting_con.style.display === "none") {
        setting_con.style.display = "block";
      } else {
        setting_con.style.display = "none";
      }

    refresh_con.style.display = "none";
    login_con.style.display = "none";
    pref_con.style.display = "none";
    account_container.style.display = "none";

    });

//if current trail button is pushed, first check if the user is signed in and has functionality enabled
//shows the current trail or the users associated profiles
current_trail_btn.addEventListener('click', () => {
  if (sessionID == 1 && enable_disable == 'true') {
    chrome.runtime.sendMessage({username: global_username, sent_from: 'current_trail', type: 'get_profile'})
  }
  if (current_trail_con.style.display === "none") {
    current_trail_con.style.display = "block";
  } else {
    current_trail_con.style.display = "none";
  }
  users_searches_con.style.display = "none";
});

//if users searches (logs) button is pushed, first check if the user is signed in and has functionality enabled
//first, check if user is logged in, and if they have functionality enabled and if their data is currently being tracked by trailmix
users_searches_btn.addEventListener('click', () => {
  if (sessionID == 1 && enable_disable == 'true' && send_log == 1) {
  var log_history = []
  //here it pulls the users 10 most recent search histories
  chrome.history.search({text: '', maxResults: 10}, function(data) {
    data.forEach(function(page) {
      log_history.push(page.title); 
      
    });
    //if the user's search history is less than 10 (not common but can occur)
    while (log_history.length < 10) {
      log_history.push('no history')
    }
    //tell the background.js that the logs need to be updated
    chrome.runtime.sendMessage({content: log_history, username: global_username, type: "post_history"})
    return true;
  });
}
//show container
  if (users_searches_con.style.display === "none") {
    users_searches_con.style.display = "block";
  } else {
    users_searches_con.style.display = "none";
  }
  current_trail_con.style.display = "none";
});

//login function to login
login_submit.addEventListener('click', () => {
  var username = document.getElementById("Lusername-field").value;
  var password = SHA256(document.getElementById("Lpassword-field").value);

  chrome.runtime.sendMessage({content: 'username: ' + username + " password: " + password, type: "credentials"}, function(response){});
});

//log out function to log out
logout.addEventListener('click', () => {
    account_container.style.display = "none";
    login_con.style.display = "block";
    global_username = "";
    sesisonID = 0;
    enable_disable = 'false'
});

//signup function for a user to sign in
signup.addEventListener('click', () => {
  if (hi_con.style.display == "block") {
    hi_con.style.display = "none";
  } else {
    hi_con.style.display = "block";
    login_con.style.display = "none";
  }

    var createaccount = document.getElementById('create-account-submit')
    
    createaccount.addEventListener('click', () => {
      var username = document.getElementById('username-field').value;
      var pass1 = document.getElementById('password-field').value;
      var pass2 = document.getElementById('password2-field').value;
      if (pass1 == pass2) {
        //make sure password is longer than 10 characters
        if (pass1.length < 10) {
          alert("password must be at least 10 characters long")
          hi_con.style.display = "block";
        } else {
        chrome.runtime.sendMessage({content: 'username: ' + username + " password: " + SHA256(pass1), type: "signup"}, function(response) {
          alert("Account Made for: " + username);
        }); }
    //if the two passwords don't match
    } else {
      alert("Passwords do not match");
      hi_con.style.display = "block";
    }
    })
    
});

//person wants to disable/enable the functionality of trailmix
enable_disable_button.addEventListener('change', () => {
    if (sessionID == 1) {
      if (enable_disable_button.checked == 1) {
        chrome.runtime.sendMessage({content: 'disable', username: global_username, type: 'function_change'})
        enable_disable = 'false'
      } else {
        chrome.runtime.sendMessage({content: 'enable', username: global_username, type: 'function_change'})
        enable_disable = 'true'
      }
  }
});

//this is part of settings where the user can choose to have their data sent to trailmix or not
dont_send.addEventListener('change', () => {
  if(sessionID == 1 && send_log == 1) {
  chrome.runtime.sendMessage({username: global_username, type: 'dont_send'}) 
  } else if (sessionID == 1 && send_log == 0) {
    chrome.runtime.sendMessage({username: global_username, type: 'send'}) 
  }
})

//save the automatic refresh time they want
//done by marc
save_btn.addEventListener('click', () => {
  if (sessionID == 1 && enable_disable == 'true') {
    var auto_refresh_save = document.getElementById("auto-refresh-option").value;
    auto_refresh_save *= 3600
    chrome.runtime.sendMessage({content: global_username, refresher: auto_refresh_save, type: 'auto_refresh'})
  }
});

//when the refresh button is done
//done by ALL
refresh_btn.addEventListener('click', () => {
    if (sessionID == 1 && enable_disable == 'true') {
    document.getElementById("refresh_details1").innerHTML = "Tracks Last Covered <br> at " + get_time()[1];
    chrome.runtime.sendMessage({content: 'username: ' + global_username, type: "profile"});
    chrome.runtime.sendMessage({content: 'username: ' + global_username, type: "set_refresh_time"});
    chrome.runtime.sendMessage({username: global_username, sent_from: 'refresh', type: 'get_profile'}) }
});

//update the logs or users searches in the html or UI
function updatelog(logs_file) {
 document.getElementById("item11").innerHTML = logs_file[0];
 document.getElementById("item12").innerHTML = logs_file[1];
 document.getElementById("item13").innerHTML = logs_file[2];
 document.getElementById("item14").innerHTML = logs_file[3];
 document.getElementById("item15").innerHTML = logs_file[4];
 document.getElementById("item16").innerHTML = logs_file[5];
 document.getElementById("item17").innerHTML = logs_file[6];
 document.getElementById("item18").innerHTML = logs_file[7];
 document.getElementById("item19").innerHTML = logs_file[8];
 document.getElementById("item20").innerHTML = logs_file[9];
}

//update the logs or users searches in the html or UI
function updatelist(profile_display) {
 	document.getElementById("item01").innerHTML = profile_display[0];
	document.getElementById("item02").innerHTML = profile_display[1];
	document.getElementById("item03").innerHTML = profile_display[2];
	document.getElementById("item04").innerHTML = profile_display[3];
	document.getElementById("item05").innerHTML = profile_display[4];
	document.getElementById("item06").innerHTML = profile_display[5];
	document.getElementById("item07").innerHTML = profile_display[6];
	document.getElementById("item08").innerHTML = profile_display[7];
	document.getElementById("item09").innerHTML = profile_display[8];
	document.getElementById("item10").innerHTML = profile_display[9];
}

///////////////////////////////HELPER FUNCTIONS//////////////////////////////////
//resets the UI, idk if this is still being used or not
function reset_view() {
  refresh_con.style.display = "none";
  pref_con.style.display = "none";
  login_con.style.display = "none";
  setting_con.style.display = "none";
  current_trail_con.style.display = "none";
  users_searches_con.style.display = "none";
  account_container.style.display = "none";
}

//check if the user was recently logged in and log them in again
function check_state() {
  chrome.runtime.sendMessage({type: "check_state"})
}

//HELPER FUNCTIONS FOR BACKGROUND STUFF
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
//matthew sleep code
function sleep(seconds) {
  let start = new Date().getTime();
  while(new Date() < start + seconds*1000){
  }
  return 0;
}

//MATTHEW'S CODE
function run_matthews_code(rand_profile) {
  if (rand_profile != undefined) {
  let mod_rand_profile = [];
  let complete_urls = [];
  for (let i = 0; i < rand_profile.length; i++) {
    mod_rand_profile[i] = rand_profile[i].replace(/\s/g, '+');
  }

  for (let i = 0; i < rand_profile.length; i++) {
    complete_urls[i]  = search_engines[getRandomInt(search_engines.length)] + mod_rand_profile[i];
  }

  for (let i = 0; i < complete_urls.length; i++) {
    chrome.tabs.create({url: complete_urls[i], active: false}, tab => {
      setTimeout(function(){
        chrome.tabs.remove(tab.id);
      }, .1)
    });
    sleep(.1);
  }
}
          
}

//Time function
function get_time() {
  var today = new Date()
  var time = (60 * (60 * today.getHours())) + (60 *  today.getMinutes()) + today.getSeconds();
  var time_string = today.getHours()+ ":" + today.getMinutes() + ":" + today.getSeconds();
  return [time, time_string]; //returns an array where the first element will be the time in seconds and the second is the time in string format (HH:MM:SS)
}

///////////////// SHA256 functions for hashing /////////////////
//FOUND ONLINE IDK WHERE ANYMORE
function SHA256(s){

  var chrsz   = 8;
  var hexcase = 0;

  function safe_add (x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
  }

  function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
  function R (X, n) { return ( X >>> n ); }
  function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
  function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
  function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
  function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
  function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
  function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

  function core_sha256 (m, l) {
      var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
      var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
      var W = new Array(64);
      var a, b, c, d, e, f, g, h, i, j;
      var T1, T2;

      m[l >> 5] |= 0x80 << (24 - l % 32);
      m[((l + 64 >> 9) << 4) + 15] = l;

      for ( var i = 0; i<m.length; i+=16 ) {
          a = HASH[0];
          b = HASH[1];
          c = HASH[2];
          d = HASH[3];
          e = HASH[4];
          f = HASH[5];
          g = HASH[6];
          h = HASH[7];

          for ( var j = 0; j<64; j++) {
              if (j < 16) W[j] = m[j + i];
              else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
              T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
              T2 = safe_add(Sigma0256(a), Maj(a, b, c));
              h = g;
              g = f;
              f = e;
              e = safe_add(d, T1);
              d = c;
              c = b;
              b = a;
              a = safe_add(T1, T2);
          }
          HASH[0] = safe_add(a, HASH[0]);
          HASH[1] = safe_add(b, HASH[1]);
          HASH[2] = safe_add(c, HASH[2]);
          HASH[3] = safe_add(d, HASH[3]);
          HASH[4] = safe_add(e, HASH[4]);
          HASH[5] = safe_add(f, HASH[5]);
          HASH[6] = safe_add(g, HASH[6]);
          HASH[7] = safe_add(h, HASH[7]);
      }
      return HASH;
  }

  function str2binb (str) {
      var bin = Array();
      var mask = (1 << chrsz) - 1;
      for(var i = 0; i < str.length * chrsz; i += chrsz) {
          bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
      }
      return bin;
  }

  function Utf8Encode(string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
              utftext += String.fromCharCode(c);
          } else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
          } else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
          }
      }
      return utftext;
  }
  function binb2hex (binarray) {
      var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var str = "";
      for(var i = 0; i < binarray.length * 4; i++) {
          str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
          hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
      }
      return str;
  }
  s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}