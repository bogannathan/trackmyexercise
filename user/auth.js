$(function(){
	let userProfile;
	console.log('test')

	$.extend(WorkoutLog, { //.extend pulls the contents of app.js's WorkoutLog variable
		//signup method
		checkPassword: function(){
			if ($(su_password).val() !== $(su_confirmpassword).val()) {
			alert('Passwords do not match')
			} else {
				WorkoutLog.signup()
			}
		},
		checkForm: function() {
			if ($(su_username).val() != "" && $(su_confirmpassword).val() != "" && $(su_password).val() != "" && $(su_fullname).val() != "" && $(su_summary).val() != "" && $(su_age).val() != "" && $(su_gender).val() != "") {
				WorkoutLog.checkPassword()
			} else {
				alert("Please fill out all fields")
			}
		},
		signup: function(){

			let username = $(su_username).val()
			let password = $(su_password).val()
			let fullname = $(su_fullname).val()
			let summary = $(su_summary).val()
			let age = $(su_age).val()
			let gender = $(su_gender).val()
		//user object
			let user = {user: 
				{
					username: username,
					password: password,
					fullname: fullname,
					summary: summary,
					age: age,
					gender: gender
				}
			}
			//signup post
			let signup = $.ajax({
				type: "POST",
				url: WorkoutLog.API_BASE + "user",
				data: JSON.stringify(user),
				contentType:"application/json"
			})
			//signup done/fail
			//.done() Promise
            //Runs asynchronously
			signup
			.done(function(data) {
				if (data.sessionToken) {
					WorkoutLog.setAuthHeader(data.sessionToken)
					WorkoutLog.definition.fetchAll()
					WorkoutLog.log.fetchAll()
				}
				console.log(data)
				$(signupModal).modal("hide")
				$('.disabled').removeClass("disabled")
				$(loginout).text("Logout")
				$('a[href="#home"]').tab('show')
				$(su_username).val("")
				$(su_password).val("")	
				alert("You have successfully signed up! Please login to continue")
				WorkoutLog.loginout()
				// $(profileUsername).text('user:' + user.fullname)
			})
			.fail(function() {
				$(su_error).text("There was an issue with sign up").show()
			})
			.always(function(){
			})
		},

		//login method
		login: function(){
			// login variables
			let username = $(li_username).val()
			let password = $(li_password).val()

			user = {user: 
				{
					username: username,
					password: password
				}
			}
			//login POST
			let login = $.ajax({
				type: "POST",
				url: WorkoutLog.API_BASE + "login",
				data: JSON.stringify(user),
				contentType: "application/json"
			})
			login
			.done(function(data) {
				if (data.sessionToken) {
					WorkoutLog.setAuthHeader(data.sessionToken)
					WorkoutLog.definition.fetchAll()
					WorkoutLog.log.fetchAll()
				}
				user = data.user
				WorkoutLog.makeNavBar()
				$(loginModal).modal('hide')
				$(loginout).text('Logout')
				$('.invisible').removeClass('invisible') 	
				localStorage.setItem('profile', JSON.stringify(data.user));
				console.log(data.user)
				$('a[href="#home"]').tab('show')
				document.getElementById("home").className = "tab-pane active"
				WorkoutLog.profileInformation(data.user)
				alert("You have successfully logged in!")
				window.location.reload(true)
			})
			.fail(function() {
				$(li_error).text("There was an issue with log in").show()
			})
		},

		makeNavBar: function() {
			$(homeNav).html("Home")
			$(defineNav).html("Define")
			$(logNav).html("Log")
			$(historyNav).html("View History")
			$(homeNav).removeClass("noPadding")
			$(defineNav).removeClass("noPadding")
			$(logNav).removeClass('noPadding')
			$(historyNav).removeClass('noPadding')
			console.log('nav')
		},
		//loginout method
		loginout: function() {
			// if (window.localStorage.getItem('sessionToken')) {
				window.localStorage.clear()
				window.location.reload(true)
			// }
		}, 

		profileInformation: function(data) {
			let user = data
			let newNav = "<li><a href='#userTab' data-toggle='tab' class=''>Welcome " + user.fullname + "!" + "</a></li>"
			$(mainNavigation).append(newNav)
			$(profileUsername).html(user.username)
			$(profilePassword).html("Click here to change")
			$(profileFullname).html(user.fullname)
			$(profileSummary).html(user.summary)
			$(profileAge).html(user.age)
			$(profileGender).html(user.gender)
		},

		updatePassword: function(data) {
			console.log(data)
			console.log('data test')
			console.log(data.id)
			if ($(updatePasswordMain).val() == $(updatePasswordConfirm).val()) {
				let username = data.username
				let password = $(updatePasswordMain).val()
				let fullname = data.fullname
				let summary = data.summary
				let age = data.age
				let gender = data.gender
				let id = data.id
			//user object
				let user = {user: 
					{
						id: id,
						username: username,
						password: password,
						fullname: fullname,
						summary: summary,
						age: age,
						gender: gender
					}
				}
				console.log('user test')
				console.log(user)

				//signup post
				let signup = $.ajax({
					type: "PUT",
					url: WorkoutLog.API_BASE + "user",
					data: JSON.stringify(user),
					contentType:"application/json"
				})
			} else {
				alert("Passwords do not match")
			}
		}
	})
	//bind events
	$(signup).on('click', WorkoutLog.checkForm)
	console.log(localStorage)
	let retrievedProfile
	if (localStorage.length != 0){
		retrievedProfile = JSON.parse(localStorage.profile)
	WorkoutLog.profileInformation(retrievedProfile)
	}
	$(login).on('click', WorkoutLog.login)
	$(loginout).on('click', WorkoutLog.loginout)
	if (window.localStorage.getItem('sessionToken')) {
		console.log('anything')
		$(loginout).text("Logout")
		// retrievedProfile = JSON.parse(retrievedProfile)
		console.log(retrievedProfile + "retrievedProfile test")
		WorkoutLog.makeNavBar()
		$('.invisible').removeClass('invisible')
		document.getElementById("home").className = "tab-pane active"
		document.getElementById("loginPage").className = "tab-pane fade"
		// $(updatePassword).on('click', function() {
		// WorkoutLog.updatePassword(retrievedProfile)
	// })
	}
	console.log(retrievedProfile, "second test")
		$(updatePassword).on('click', function() {
		WorkoutLog.updatePassword(retrievedProfile)
	})
	let idleInterval = setInterval(timerIncrement, 5000); // 

	    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });

	function timerIncrement() {
	    idleTime += 1;
	    if (idleTime > 30 && window.localStorage.getItem('sessionToken')) { // 20 minutes
	        alert("You have been logged out due to inactivity.")
	        WorkoutLog.loginout()
	        console.log("timer inc work auth")
	    }
	}
	if (!window.localStorage.getItem('sessionToken')) {
		document.getElementById('loginPage').className = 'tab-pane active'
		document.getElementById('listLoginout').className = 'active'
		window.localStorage.clear()
	}

})