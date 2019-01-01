var express = require ("express");
var router = express.Router ();
var request = require ("request");
var firebase = require ("firebase");
const session = require ("express-session");
const FirebaseStore = require ('connect-session-firebase')(session);

var details;

var config = {
    apiKey: "AIzaSyC01608HbTyGIQfYfwzo-j9LGAG6fsZpsY",
    authDomain: "chitchat-80f8a.firebaseapp.com",
    databaseURL: "https://chitchat-80f8a.firebaseio.com",
    projectId: "chitchat-80f8a",
    storageBucket: "chitchat-80f8a.appspot.com",
    messagingSenderId: "873220597825"
};
firebase.initializeApp(config);

router.get ("/", function (req, res, next) {
    res.render ("index");
});

router.get ("/signin", function (req, res, next) {
    res.render ("signin");
});

router.get ("/signup", function (req, res, next) {
    res.render ("signup");
});

router.post ("/signup_auth", function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    username = email.replace (/@.*/, '');
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function () {
        console.log (email + " " + password + " sign up successfully!");
        // res.render ("signup_success", {email: email});
        // window.alert (email.uid);
        res.send (email + " signed up successfully!");
        var ref = firebase.database().ref("users");
        var user = firebase.auth().currentUser;
        const uid = user.uid;
        const username = email.replace (/@.*/, '');
        ref.child(uid).set({
            username: username,
            email: email
        });
    })
        // var isNewUser = true;
        // var ref = firebase;
        // firebase.onAuth (function (authData) {
        //     if (authData && isNewUser) {
        //         ref.child ("users").child (authData.uid).set ({
        //             provider: authData.provider,
        //             name: authData.password.email.replace (/@.*/, '')
        //         });
        //         console.log ("entry added!");
        //     }
        // });
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log (errorCode, errorMessage);
    });
});

router.post ("/chat", function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
        console.log (email + " " + password + " signed in successfully!");
        // res.render ("signup_success", {email: email});
        // res.send (email + " signed in success!");
        
        res.render ("chat", {details: details});
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log (errorCode, errorMessage);
    });
});

firebase.auth().onAuthStateChanged (function (user) {
    if (user) {
        var ref = firebase.database ().ref ("users").child(user.uid);
        ref.on ("value", function (snapshot ) {
            details = snapshot.val ();
            console.log (details.username + " signed in!");
        });
    }
    else {
        console.log ("No user signed in!");
    }
});

module.exports = router;