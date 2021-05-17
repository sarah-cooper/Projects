//Background File, will run when the extension is loaded
try {
    //import the js we need to run our extension with firebase
    self.importScripts('firebase/firebase-app.js', 'firebase/firebase-firestore.js', 'firebase/firebase-database.js')
    //initalize the firebase
    var config = {
        apiKey: "AIzaSyDvKFTNRiW33enuuK-4xIUW7X8zzTCTdsA",
        authDomain: "trailmix-9f4bf.firebaseapp.com",
        databaseURL: "https://trailmix-9f4bf-default-rtdb.firebaseio.com",
        projectId: "trailmix-9f4bf",
        storageBucket: "trailmix-9f4bf.appspot.com",
        messagingSenderId: "1015492268885",
        appId: "1:1015492268885:web:eb7d0b7a4eef9f5e0e95dc",
        measurementId: "G-993VZ60QLY" 
      };
      
    firebase.initializeApp(config);
    //if the user is logged in and the user has opened the extension (after a short time after closing it)
    var USER = "";
    //I'm not really sure what this is for anymore
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    
    var usrflag = 0;
    var passflag = 0;
    var pref_list_num = 20;
    //listening function. allows the brackground to interact with the popup.js
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            //if the message sent from the popup is credentials (so a user is logging in)
            if (request.type == "credentials") {
                var str = request.content
                str = str.split(" ")
                var username = str[1]
                var password = str[3]
                var usrRef = firebase.database().ref();
                //check if user exists
                usrRef.child('users').child(username).get().then((snapshot) => {
                    if(snapshot.exists()) {
                        usrflag = 1;
                        var pass;
                        //if user exists, check their password
                        usrRef.child('users').child(username).child("password").get().then((snapshot2) => {
                            pass = snapshot2.val();
                            //check if the password given was correct (this just matches hashes)
                            if (pass == password) {
                                passflag = 1;
                                USER = username;
                                chrome.runtime.sendMessage({content: 'username: ' + username + ' correct', flagset : snapshot.child('enablediableflag'), type: 'auth'});
                            //if it doesn't match then send back that it is the wrong password
                            } else {
                                passflag = 2;
                                chrome.runtime.sendMessage({content: 'wrong password', flagset: 'false' , type: 'auth'});
                            } 
                        })
                    //if the username does not exist 
                    } else {
                        usrflag = 2;
                        chrome.runtime.sendMessage({content: 'username: ' + username + ' user doesnt exist', flagset: 'false' , type: 'auth'});
                    }
                })
            return true;
            }
            //this is used to reset the refresh time when the user clicks refresh
            //done by Marc
            if (request.type == "set_refresh_time")
            {
                var str = request.content
                str = str.split(" ")
                var username = str[1]

                var last_refresh_arr = get_time()

                firebase.database().ref('users/' + username).update({
                    lastRefresh: last_refresh_arr[0]
                  });
                  return true;
            }

            //this is for if the user choses to not send their data for trailmix to collect
            if (request.type == "dont_send") {
                firebase.database().ref('users/' + request.username).update({
                    send_data: 0
                })
                chrome.runtime.sendMessage({content: "0",type: 'dont_send_sccessful'})
                return true;
            }

            //this is for if the user choses to send their data for trailmix to collect
            if (request.type == "send") {
                firebase.database().ref('users/' + request.username).update({
                    send_data: 1
                })
                chrome.runtime.sendMessage({content: "1",type: 'dont_send_sccessful'})
                return true;
            }

            //this is to check the time with the last refresh time.
            //this was used to check if the last time they refresh was on/after the time they set for their automatic refreshes
            //done by Marc
            if (request.type == "pref_time")
            {
                var username = request.content
                var refresh_check_time
                var pref_check_time = request.preftime
                var check_time
                var refresh_difference
                var db_ref = firebase.database().ref()

                db_ref.child('users').child(username).child("refreshTime").get().then((snapshot) => {
                    refresh_difference = snapshot.val();
                    db_ref.child('users').child(username).child("lastRefresh").get().then((snapshot) => {
                        refresh_check_time = snapshot.val();
                        check_time = pref_check_time - refresh_check_time
                        if (check_time < 0) {
                            check_time *= -1 
                        }

                        if (check_time > refresh_difference) {
                            firebase.database().ref('users/' + username).update({
                                lastRefresh: pref_check_time
                            });
                            
                            chrome.runtime.sendMessage({content: "successful", type: 'user_refresh'})
                        }
                    })
                })
                return true;
            }
            //checks the state of the users
            //are they signed in or not
            if (request.type == 'check_state') {
                if (USER != "") {
                    firebase.database().ref('users/' + USER).get().then((snapshot) => {
                        chrome.runtime.sendMessage({sessionID: snapshot.child('sessionID').val(), username: USER, enabledisable: snapshot.child('enabledisableflag').val(), answer: 'logged_in', type: 'state_checked'})
                    })
                    
                }
                return true;
            }
            //when user clicks the refresh, this function is called to update the refresh time
            if (request.type == "auto_refresh") {
                var username = request.content
                var auto_refresh_time = request.refresher
                
                firebase.database().ref('users/' + username).update({
                    refreshTime: auto_refresh_time
                });
                return true;
            }
            //this is to get the profile 
            if (request.type == "get_profile") {
                var new_profile = []
                var db_ref = firebase.database().ref()
                db_ref.child('users').child(request.username).child('profileID').on('value', (snapshot) => {
                    var id = snapshot.val()
                    db_ref.child('profiles').child(id).get().then((snapshot2) =>{
                        new_profile.push(snapshot2.child('pref1').val())
                        new_profile.push(snapshot2.child('pref2').val())
                        new_profile.push(snapshot2.child('pref3').val())
                        new_profile.push(snapshot2.child('pref4').val())
                        new_profile.push(snapshot2.child('pref5').val())
                        new_profile.push(snapshot2.child('pref6').val())
                        new_profile.push(snapshot2.child('pref7').val())
                        new_profile.push(snapshot2.child('pref8').val())
                        new_profile.push(snapshot2.child('pref9').val())
                        new_profile.push(snapshot2.child('pref10').val())
                        console.log(new_profile)
                        if (request.sent_from == 'refresh') {
                        chrome.runtime.sendMessage({content: new_profile, answer: 'refresh', type: 'curr_profile'});
                        }
                        if (request.sent_from == 'current_trail') {
                            chrome.runtime.sendMessage({content: new_profile, answer: 'current_trail', type: 'curr_profile'});
                        }
                        new_profile = []
                    })
                })
                return true;
            }
            //if the user wants to stop the functionality or start the functionality
            if (request.type == 'function_change') {
                
                var db_ref = firebase.database().ref()
                
                if (request.content == 'disable') {
                    firebase.database().ref('users/' + request.username).update({
                        enabledisableflag: 'false'
                    })
                } else if (request.content == 'enable') {
                    firebase.database().ref('users/' + request.username).update({
                        enabledisableflag: 'true'
                    })
                } 
                return true;
            }

            
            //get the users profiles and update
            //by by marc
            if (request.type == "profile")
            {
                var str = request.content
                var profile
                var new_profile = []
                str = str.split(" ")
    
                var username = str[1]
                var db_ref = firebase.database().ref()
    
                db_ref.child('users').child(username).child("profileID").get().then((snapshot) => {
                    profile = snapshot.val();
                })
    
                new_id = (getRandomInt(pref_list_num))
    
                firebase.database().ref('users/' + username).update({
                    profileID: new_id
                });
                
                db_ref.child('profiles').child(new_id).get().then((snapshot2) =>{
                    new_profile.push(snapshot2.child('pref1').val())
                    new_profile.push(snapshot2.child('pref2').val())
                    new_profile.push(snapshot2.child('pref3').val())
                    new_profile.push(snapshot2.child('pref4').val())
                    new_profile.push(snapshot2.child('pref5').val())
                    new_profile.push(snapshot2.child('pref6').val())
                    new_profile.push(snapshot2.child('pref7').val())
                    new_profile.push(snapshot2.child('pref8').val())
                    new_profile.push(snapshot2.child('pref9').val())
                    new_profile.push(snapshot2.child('pref10').val())
                    chrome.runtime.sendMessage({content: new_profile, type: 'new_profile'});
                })
                new_profile = []
                return true;
            }

            //when the users wants to create a new account
            if (request.type == "signup") {
                var str = request.content
                str = str.split(" ")
                var username = str[1]
                var password = str[3]
                if (username != "") {
                    firebase.database().ref('-MYrPQa9sdlH2pHJSFPD').get().then((snapshot) => {
                        var lognum = snapshot.child('numLogs').val()
                        var usernum = snapshot.child('numUsers').val()
                        //create a new user
                        firebase.database().ref('users/' + username).set({
                            username: username,
                            password: password,
                            enabledisableflag: 'true',
                            profileID: 1,
                            logID: lognum+1,
                            sessionID: 1,
                            refreshTime: 86400,
                            lastRefresh: get_time()[0],
                            send_data: 1
                          });
                          //update the number of users and logs that exists
                          firebase.database().ref('-MYrPQa9sdlH2pHJSFPD').update({
                              numLogs: lognum+1,
                              numUsers: usernum+1
                          })
                          //create a new log file for the user
                          firebase.database().ref('logs/' + (lognum+1)).set({
                            pref1: 'no history',
                            pref2: 'no history',
                            pref3: 'no history',
                            pref4: 'no history',
                            pref5: 'no history',
                            pref6: 'no history',
                            pref7: 'no history',
                            pref8: 'no history',
                            pref9: 'no history',
                            pref10: 'no history',
                          })
                          return true; 
                        }) 
                    }
                    return true;
            }
            //update the users log history with the most updated history information
            if (request.type == "post_history") {
                var log_arr = request.content
                var set = new Set(log_arr)
                var db_ref = firebase.database().ref()
                db_ref.child('users').child(request.username).child("logID").get().then((snapshot) => {
                    db_ref.child('logs').child(snapshot.val()).child("pref10").get().then((snapshot2) => {
                        if (snapshot2.val() != log_arr[9]) {
                            
                                db_ref.child('logs').child(snapshot.val()).update({
                                    pref1: log_arr[0],
                                    pref2: log_arr[1],
                                    pref3: log_arr[2],
                                    pref4: log_arr[3],
                                    pref5: log_arr[4],
                                    pref6: log_arr[5],
                                    pref7: log_arr[6],
                                    pref8: log_arr[7],
                                    pref9: log_arr[8],
                                    pref10: log_arr[9],
                                }) 
                            log_arr = Array.from(set)
                            for (var i =0; i < log_arr.length; i++) {
                                if (log_arr[i].search('Search') == -1 && log_arr[i].search('search') == -1 && log_arr[i].search('YouTube') == -1) {
                                firebase.database().ref('preference_dump/').push(log_arr[i]); }
                            }
                    }
                    var log = []
                
                            db_ref.child('users').child(request.username).child('logID').on('value', (snapshot) => {
                            var id = snapshot.val()
                            db_ref.child('logs').child(id).get().then((snapshot2) =>{
                                log.push(snapshot2.child('pref1').val())
                                log.push(snapshot2.child('pref2').val())
                                log.push(snapshot2.child('pref3').val())
                                log.push(snapshot2.child('pref4').val())
                                log.push(snapshot2.child('pref5').val())
                                log.push(snapshot2.child('pref6').val())
                                log.push(snapshot2.child('pref7').val())
                                log.push(snapshot2.child('pref8').val())
                                log.push(snapshot2.child('pref9').val())
                                log.push(snapshot2.child('pref10').val())
                                console.log(log)
                            
                            chrome.runtime.sendMessage({content: log, type: 'update_logs'});
                            }) })
                })
            })

            return true;
        }
        return true;
    });
    
//this genereates a new profile with randomized information from the pref_dump file
function generate_new_profile() {
    //read in info from preference_dump --> pref_dump array
    var pref_dump= []
    var random_num = []
    var db_ref = firebase.database().ref('preference_dump').orderByKey();
    db_ref.once("value").then(function(snapshot) {
        snapshot.forEach(function(childsnapshot) {
            var key = childsnapshot.key;
            var data = childsnapshot.val();
            pref_dump.push(data)
        })
        var j;
        for(j = 0; j < pref_dump-5; j++) {
            var temp = pref_dump
            random_num = randomUniqueNum(pref_dump.length-1, 10);            
            firebase.database().ref('profiles/' + j).set({
                pref1: pref_dump[random_num[0]],
                pref2: pref_dump[random_num[1]],
                pref3: pref_dump[random_num[2]],
                pref4: pref_dump[random_num[3]],
                pref5: pref_dump[random_num[4]],
                pref6: pref_dump[random_num[5]],
                pref7: pref_dump[random_num[6]],
                pref8: pref_dump[random_num[7]],
                pref9: pref_dump[random_num[8]],
                pref10: pref_dump[random_num[9]],
                profileID: j
            }) 
        }
    })
    pref_list_num = pref_dump-5
} 

//get time to get time
function get_time() {
    var today = new Date()
    var time = (60 * (60 * today.getHours())) + (60 *  today.getMinutes()) + today.getSeconds();
    var time_string = today.getHours()+ ":" + today.getMinutes() + ":" + today.getSeconds();
    return [time, time_string]; //returns an array where the first element will be the time in seconds and the second is the time in string format (HH:MM:SS)
}

//when needing random number
//by Matthew
function randomUniqueNum(range, outputCount) {
    let arr = []
    for (let i = 1; i <= range; i++) {
      arr.push(i) }

    let result = [];  
    for (let i = 1; i <= outputCount; i++) {
      const random = Math.floor(Math.random() * (range - i));
      result.push(arr[random]);
      arr[random] = arr[range - i];
    }

    return result;
  }
    

    } catch(e) {
        console.log(e);
    }