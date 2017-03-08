(function() {
  const config = {
  	apiKey: "AIzaSyAnEDbmWbdr72O2IeCY1Qicj3c4LLkL9cU",
  	authDomain: "code-assist.firebaseapp.com",
  	databaseURL: "https://code-assist.firebaseio.com",
  	storageBucket: "code-assist.appspot.com",
  	messagingSenderId: "953126498792"
  };
  firebase.initializeApp(config);

  const inputEmail = document.getElementById('signupEmail');
  const inputPassword = document.getElementById('signupPassword');
  const btnSignUp = document.getElementById('signupSubmit');

  btnSignUp.addEventListener('click', e => {
    const email = inputEmail.value;
    const pass = inputPassword.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      console.log(firebaseUser);
    } else {
      console.log('not logged in');
    }
  });
}());



// function signout() {
// 	firebase.auth().signOut().then(function() {
// 	  // Sign-out successful.
// 	}, function(error) {
// 	  // An error happened.
// 	  alert(error);
// 	});
// }

// function validateUser() {
// 	var email = $('#signupEmail').val();
// 	var password = $('#signupPassword').val();
// 	var password2 = $('#signupPassword2').val();

// 	if(email != null && password != null && password == password2) {
// 		createUser(email, password);
// 	} else {
// 		alert("Please enter a valid email and password");
// 	}
// }

// function createUser(email, password) {

// 	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
// 	  // Handle Errors here.
// 	  var errorCode = error.code;
// 	  var errorMessage = error.message;
// 	  // ...
// 	  alert(errorCode, errorMessage);
// 	});
// }

// function signin(email, password) {
// 	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
// 	  // Handle Errors here.
// 	  var errorCode = error.code;
// 	  var errorMessage = error.message;
// 	  // ...
// 	  alert(errorCode, errorMessage);
// 	});
// }

// function getUserInfo() {
// 	var user = firebase.auth().currentUser;
// 	var name, email, photoUrl, uid, emailVerified;

// 	if (user != null) {
// 	  name = user.displayName;
// 	  email = user.email;
// 	  photoUrl = user.photoURL;
// 	  emailVerified = user.emailVerified;
// 	  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
// 	                   // this value to authenticate with your backend server, if
// 	                   // you have one. Use User.getToken() instead.
// 		$('#profileName').text(name);
// 		$('#profileEmail').text(email);
// 		$('#profilePhotoUrl').text(photoUrl);
// 		$('#profileEmailVerified').text(emailVerified);
// 		$('#profileUid').text(uid);
// 	}
// }

// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     // User is signed in.
//     $('#userStatus').text('Signed In as ' + user);
//     getUserInfo();
//   } else {
//     // No user is signed in.
//     $('#userStatus').text('Signed Out');
//   }
// });

// $('#signout').click(function() {
// 	signout();
// });

// $('#signupSubmit').click(function() {
// 	validateUser();
// });

// $('#signinSubmit').click(function() {
// 	var email = $('#signinEmail').val();
// 	var password = $('#signinPassword').val();
// 	signin(email, password);
// });
