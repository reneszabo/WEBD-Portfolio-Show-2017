// Initialize Firebase
var config = {
	apiKey: "AIzaSyANKO5LqddgASdkSG2WzcPXLPQ41AkewPo",
	authDomain: "webd-portfolio-show-2017.firebaseapp.com",
	databaseURL: "https://webd-portfolio-show-2017.firebaseio.com",
	storageBucket: "webd-portfolio-show-2017.appspot.com",
	messagingSenderId: "888183054325"
};
firebase.initializeApp(config);

var adminUser = 'WLvS4vczBzTdcON21xt2Qet8TVd2';


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
			alert('Please enter your email address.');
			return;
		}
		if (password.length < 2) {
			alert('Please enter your password.');
			return;
		}
		// Sign in with email and pass.
		// [START authwithemail]
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong password.');
			} else {
				alert(errorMessage);
			}
			console.log(error);
			document.getElementById('sign-in').disabled = false;
		});
		// [END authwithemail]

	}
}

function sendPasswordReset() {
	var email = document.getElementById('email').value;
	// [START sendpasswordemail]
	firebase.auth().sendPasswordResetEmail(email).then(function() {
		// Password Reset Email Sent!
		alert('Password Reset Email Sent!');
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode == 'auth/invalid-email') {
			alert(errorMessage);
		} else if (errorCode == 'auth/user-not-found') {
			alert(errorMessage);
		}
		console.log(error);
	});
	// [END sendpasswordemail];
}

function getData() {
	console.log("getData");
	// Create references
	var currentUserId = firebase.auth().currentUser.uid;

	if(currentUserId == adminUser){
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
			document.getElementById('loading').style.display = 'none';
			document.getElementById('account-details').style.display = 'block';

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

	if(currentUserId == adminUser) {
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
		if (user) {
			// User is signed in.
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;

			document.getElementById('sign-in-container').style.display = 'none';
			document.getElementById('signed-in-container').style.display = 'block';
			document.getElementById('user-details-container').style.display = 'block';
			document.getElementById('loading').style.display = 'none';
			document.getElementById('account-details').style.display = 'block';

			document.getElementById('current-user').textContent = email;

			getData();

			

		} else {
			// User is signed out.

			document.getElementById('sign-in-container').style.display = 'block';
			document.getElementById('signed-in-container').style.display = 'none';
			document.getElementById('user-details-container').style.display = 'none';
			document.getElementById('loading').style.display = 'block';
			document.getElementById('account-details').style.display = 'none';

			removeData();

			
		}
	});
	// [END authstatelistener]

	document.getElementById('sign-out').addEventListener('click', toggleSignIn, false);
	document.getElementById('save-data').addEventListener('click', saveData, false);
	document.getElementById('cancel').addEventListener('click', resetData, false);

	document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
	document.getElementById('password-reset1').addEventListener('click', sendPasswordReset, false);
	document.getElementById('password-reset2').addEventListener('click', sendPasswordReset, false);
	
}

window.onload = function() {
	initApp();
};
