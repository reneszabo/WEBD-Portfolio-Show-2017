// Initialize Firebase
var config = {
	apiKey: "AIzaSyANKO5LqddgASdkSG2WzcPXLPQ41AkewPo",
	authDomain: "webd-portfolio-show-2017.firebaseapp.com",
	databaseURL: "https://webd-portfolio-show-2017.firebaseio.com",
	storageBucket: "webd-portfolio-show-2017.appspot.com",
	messagingSenderId: "888183054325"
};
firebase.initializeApp(config);
var data;

function getData() {
	firebase.database().ref('/users/').on('value', function(snapshot) {
		data = snapshot.val();
		var $people = $('#people');
		var textHtml = '<ul>';

		if(data !== null) {
			for (var item in data) {
				console.log(data[item]);
				var firstName = data[item].firstName;
				var lastName = data[item].lastName;
				textHtml += '<li>' + firstName + ' ' + lastName + '</li>';
			}
		}

		textHtml += '</ul>';

		$people.html(textHtml);
	});
}

function initApp() {
	getData();
}

window.onload = function() {
	initApp();
};