$(function(){
	$.extend(WorkoutLog, { //.extend pulls the contents of app.js's WorkoutLog variable
		//signup method
		signup: function(){
			//username and password variables
			let username = $(su_username).val()
			let password = $(su_password).val()
		//user object
			let user = {user: 
				{
					username: username,
					password: password
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
					console.log("you made it")
					console.log(data.sessionToken)
					WorkoutLog.definition.fetchAll()
					WorkoutLog.log.fetchAll()
				}

				$(signupModal).modal("hide")
				$('.disabled').removeClass("disabled")
				$(loginout).text("Logout")
				$('a[href="#define"]').tab('show')
				$(su_username).val("")
				$(su_password).val("")			
			})
			.fail(function() {
				$(su_error).text("There was an issue with sign up").show()
			})
			.always(function(){
				alert("hey play this cool game while you sign up")
			})
		},

		//login method
		login: function(){
			// login variables
			let username = $(li_username).val()
			let password = $(li_password).val()
			let user = {user: 
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
					console.log('you logged in!')
					WorkoutLog.definition.fetchAll()
					WorkoutLog.log.fetchAll()
				}
				$(loginModal).modal('hide')
				$('.disabled').removeClass('disabled')
				$(loginout).text('Logout')
				$('a[href="#define"]').tab('show')
				$(li_username).val("")
				$(li_password).val("")
			})
			.fail(function() {
				$(li_error).text("There was an issue with log in").show()
			})
		},
		//loginout method
		loginout: function() {
			if (window.localStorage.getItem('sessionToken')) {
				window.localStorage.removeItem('sessionToken')
				$(loginout).text("Login")
			}
		}
	})
	//bind events
	$(signup).on('click', WorkoutLog.signup)
	$(login).on('click', WorkoutLog.login)
	$(loginout).on('click', WorkoutLog.loginout)

	if (window.localStorage.getItem('sessionToken')) {
		$(loginout).text("Logout")
	}
})