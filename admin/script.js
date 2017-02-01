// Initialize Firebase
var config = {
	apiKey: "AIzaSyANKO5LqddgASdkSG2WzcPXLPQ41AkewPo",
	authDomain: "webd-portfolio-show-2017.firebaseapp.com",
	databaseURL: "https://webd-portfolio-show-2017.firebaseio.com",
	storageBucket: "webd-portfolio-show-2017.appspot.com",
	messagingSenderId: "888183054325"
};
firebase.initializeApp(config);


var mapDataNames = [
	// [ HTML element ID name, Firebase key name ]
	['first-name', 'firstName'],
	['last-name', 'lastName'],
	['photo-URL', 'photoURL'],
	['introduction', 'introduction'],
	['skill-set', 'skillSet'],
	['portfolio-link', 'portfolioLink'],
	['official-email', 'officialEmail'],
	['social-media-1', 'socialMedia1'],
	['social-media-2', 'socialMedia2'],
	['social-media-3', 'socialMedia3']
];

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
	if (firebase.auth().currentUser) {
		// [START signout]
		firebase.auth().signOut();
		// [END signout]
	} else {
		var email = document.getElementById('email').value;
		var password = document.getElementById('password').value;
		if (email.length < 4) {
			alert('Please enter an email address.');
			return;
		}
		if (password.length < 4) {
			alert('Please enter a password.');
			return;
		}
		// Sign in with email and pass.
		// [START authwithemail]
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// [START_EXCLUDE]
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong password.');
			} else {
				alert(errorMessage);
			}
			console.log(error);
			document.getElementById('sign-in').disabled = false;
			// [END_EXCLUDE]
		});
		// [END authwithemail]
	}
	document.getElementById('sign-in').disabled = true;
}

/**
 * Handles the sign up button press.
 */
function handleSignUp() {
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	if (email.length < 4) {
		alert('Please enter an email address.');
		return;
	}
	if (password.length < 4) {
		alert('Please enter a password.');
		return;
	}
	// Sign in with email and pass.
	// [START createwithemail]
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// [START_EXCLUDE]
		if (errorCode == 'auth/weak-password') {
			alert('The password is too weak.');
		} else {
			alert(errorMessage);
		}
		console.log(error);
		// [END_EXCLUDE]
	});
	// [END createwithemail]
}

/**
 * Sends an email verification to the user.
 */
// function sendEmailVerification() {
// 	// [START sendemailverification]
// 	firebase.auth().currentUser.sendEmailVerification().then(function() {
// 		// Email Verification sent!
// 		// [START_EXCLUDE]
// 		alert('Email Verification Sent!');
// 		// [END_EXCLUDE]
// 	});
// 	// [END sendemailverification]
// }

function sendPasswordReset() {
	var email = document.getElementById('email').value;
	// [START sendpasswordemail]
	firebase.auth().sendPasswordResetEmail(email).then(function() {
		// Password Reset Email Sent!
		// [START_EXCLUDE]
		alert('Password Reset Email Sent!');
		// [END_EXCLUDE]
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// [START_EXCLUDE]
		if (errorCode == 'auth/invalid-email') {
			alert(errorMessage);
		} else if (errorCode == 'auth/user-not-found') {
			alert(errorMessage);
		}
		console.log(error);
		// [END_EXCLUDE]
	});
	// [END sendpasswordemail];
}

function getData() {
	console.log("getData");
	// Create references

	var currentUserId = firebase.auth().currentUser.uid;

	if(currentUserId == 'admin'){
		console.log("Admin");
		firebase.database().ref('/users/').on('value', function(snapshot) {
			var data = snapshot.val();
			// document.getElementById('account-details').textContent = JSON.stringify(data, null, '  ');

			console.log(data);
		});
	} else {
		console.log("regular user");
		firebase.database().ref('/users/' + currentUserId).on('value', function(snapshot) {
			console.log(snapshot.val());
			if(snapshot.val() !== null) {
				for (var i = 0; i < mapDataNames.length; i++) {
					var elementName = mapDataNames[i][0];
					var firebaseName = mapDataNames[i][1];
					var data = snapshot.val()[firebaseName];
					if(data !== undefined) {
						document.getElementById(elementName).value = data;
					}
				}
			}
		});
	}
}

function saveData() {
	console.log("saveData");

	var currentUserId = firebase.auth().currentUser.uid;

	if(currentUserId == 'admin') {
		console.log("Admin");
		firebase.database().ref('/users/').on('value', function(snapshot) {
			var data = snapshot.val();
			// document.getElementById('account-details').textContent = JSON.stringify(data, null, '  ');

			console.log(data);
		});
	} else {
		console.log("regular user");
		firebase.database().ref('/users/' + currentUserId).on('value', function(snapshot) {
			console.log(snapshot.val());
			if(snapshot.val() !== null) {
				var userData = {};
				for (var i = 0; i < mapDataNames.length; i++) {
					var elementName = mapDataNames[i][0];
					var firebaseName = mapDataNames[i][1];
					var data = document.getElementById(elementName).value;
					if(data !== undefined) {
						userData[firebaseName] = data;
					}
				}
				var updates = {};
				updates['/users/' + currentUserId] = userData;

				return firebase.database().ref().update(updates);
			} else {
				var userData = {};
				for (var i = 0; i < mapDataNames.length; i++) {
					var elementName = mapDataNames[i][0];
					var firebaseName = mapDataNames[i][1];
					var data = document.getElementById(elementName).value;
					if(data !== undefined) {
						userData[firebaseName] = data;
					}
				}
				var newUserId = firebase.database().ref(/users/).push().currentUserId;
				var updates = {};
				updates['/users/' + newUserId] = userData;

				return firebase.database().ref().update(updates);
			}
		});
	}
}

function removeData() {
	for (var i = 0; i < mapDataNames.length; i++) {
		var elementName = mapDataNames[i][0];
		document.getElementById(elementName).value = null;
	}
}

function resetData() {
	removeData();
	getData();
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
	// Listening for auth state changes.
	// [START authstatelistener]
	console.log("initApp");

	firebase.auth().onAuthStateChanged(function(user) {
		// [START_EXCLUDE silent]
		// document.getElementById('verify-email').disabled = true;
		// [END_EXCLUDE]
		if (user) {
			// User is signed in.
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			// [START_EXCLUDE silent]
			document.getElementById('sign-in-status').textContent = 'Signed in';
			document.getElementById('sign-in').textContent = 'Sign out';
			document.getElementById('current-user').textContent = email;
			// if (!emailVerified) {
			// 	document.getElementById('verify-email').disabled = false;
			// }
			// [END_EXCLUDE]


			getData();

			

			document.getElementById('sign-up').disabled = true;
		} else {
			// User is signed out.
			// [START_EXCLUDE silent]
			document.getElementById('sign-in-status').textContent = 'Signed out';
			document.getElementById('sign-in').textContent = 'Sign in';
			document.getElementById('current-user').textContent = "";
			// document.getElementById('account-details').textContent = 'null';
			// [END_EXCLUDE]

			removeData();

			document.getElementById('sign-up').disabled = false;
		}
		// [START_EXCLUDE silent]
		document.getElementById('sign-in').disabled = false;
		// [END_EXCLUDE]
	});
	// [END authstatelistener]

	document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
	document.getElementById('sign-up').addEventListener('click', handleSignUp, false);
	// document.getElementById('verify-email').addEventListener('click', sendEmailVerification, false);
	document.getElementById('password-reset').addEventListener('click', sendPasswordReset, false);

	document.getElementById('save-data').addEventListener('click', saveData, false);
	document.getElementById('cancel').addEventListener('click', resetData, false);
}

window.onload = function() {
	initApp();
};
