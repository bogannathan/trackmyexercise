$(function(){
	let userProfile;

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
				$('a[href="#home"]').tab('show')
				$('loginPage').tab('hide')
				document.getElementById("home").className = "tab-pane active"
				$(homeNav).click()
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
			$('.invisible').removeClass('invisible') 
		},
		//loginout method
		loginout: function() {
			if (window.localStorage.getItem('sessionToken')) {
				window.localStorage.clear()
				window.location.reload(true)
			}
		}, 

		profileInformation: function(data) {
			let user = data
			let newNav = "<li><a href='#userTab' data-toggle='tab' class=''>Welcome " + user.fullname + "!" + "</a></li>"
			$(mainNavigation).append(newNav)
			$(profileUsername).html(user.username)
			$(profileUpdater).html("Click here to update profile")
			$(profileFullname).html(user.fullname)
			$(profileSummary).html(user.summary)
			$(profileAge).html(user.age)
			$(profileGender).html(user.gender)
		},
		fillUpdateProfile: function(data) {
			$(update_username).val(data.username)
			$(update_password).val()
			$(update_confirmpassword).val()
			$(update_fullname).val(data.fullname)
			$(update_summary).val(data.summary)
			$(update_age).val(data.age)
			$(update_gender).val(data.gender)
		},
		updateProfile: function() {
			if ($(update_password).val() == $(update_confirmpassword).val()) {
				if (($(update_username).val() != "" && $(update_confirmpassword).val() != "" && $(update_password).val() != "" && $(update_fullname).val() != "" && $(update_summary).val() != "" && $(update_age).val() != "" && $(update_gender).val() != "" && typeof($(update_age)) == integer)) {
					let username = $(update_username).val()
					let password = $(update_password).val()
					let fullname = $(update_fullname).val()
					let summary = $(update_summary).val()
					let age = $(update_age).val()
					let gender = $(update_gender).val()
					let id = retrievedProfile.id
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
					let updater = $.ajax({
						type: "PUT",
						url: WorkoutLog.API_BASE + "user",
						data: JSON.stringify(user),
						contentType:"application/json"
					})
					updater.done(function(data){
						alert("You have successfully updated your profile!")
						window.location.reload(true)
					})
					.fail(function(data){
						alert("There was an issue with updating. Please log in and try again")
					})
				} else {
					alert("Please fill out all fields and confirm age is a number")
				}
			} else {
				alert("Passwords do not match")
			}
		}
	})
	//bind events
	$(signup).on('click', WorkoutLog.checkForm)
	let retrievedProfile = localStorage.profile
	if (localStorage.length != 0 && typeof(retrievedProfile) !== 'object' && typeof(retrievedProfile) !== null){
		retrievedProfile = JSON.parse(retrievedProfile)
		WorkoutLog.profileInformation(retrievedProfile)
	}
	$(login).on('click', WorkoutLog.login)
	$(loginout).on('click', WorkoutLog.loginout)
	if (window.localStorage.getItem('sessionToken')) {
		$(loginout).text("Logout")
		WorkoutLog.makeNavBar()
		$('.invisible').removeClass('invisible')
		document.getElementById("home").className = "tab-pane active"
		document.getElementById("loginPage").className = "tab-pane fade"
	}
	$(profileUpdater).on('click', function() {
		WorkoutLog.fillUpdateProfile(retrievedProfile)
	})
	$(updateProfile).on('click', WorkoutLog.updateProfile)
	let idleInterval = setInterval(timerIncrement, 5000); // 

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
	    }
	}
	// if (!window.localStorage.getItem('sessionToken')) {
	// 	document.getElementById('loginPage').className = 'tab-pane active'
	// 	document.getElementById('listLoginout').className = 'active'
	// 	window.localStorage.clear()
	// }

})