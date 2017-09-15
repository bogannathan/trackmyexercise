let idleTime = 0;
$(document).ready(function() {
let retrievedProfile
$(logDate).datepicker({ dateFormat: 'yy/mm/dd' })

	let WorkoutLog = (function($, undefined) {
		let API_BASE = "https://exertrack-server.herokuapp.com/"
		// let API_BASE = "http://localhost:3000/api/"
		let userDefinitions= []
		//private, gonna stay in the expression. 
		let setAuthHeader = function(sessionToken) {
			window.localStorage.setItem("sessionToken", sessionToken)
			//set the auth header
			//this can be done on individual calls
			//here we showcase ajaxsetup as a global tool
			$.ajaxSetup({
				"headers": {
					"Authorization": sessionToken
				}
			})
		}

		// public. this will be exposed to the rest of the world
		return {
			API_BASE: API_BASE,
			setAuthHeader: setAuthHeader
		}
	})(jQuery)

	$(".nav-tabs a[data-toggle=tab]").on("click", function(e) {
		let token = window.localStorage.getItem('sessionToken')
		if ($(this).hasClass("disabled") && !token) {
			e.preventDefault()
			return false
		}
		if (!token && $(this).attr('id') != "loginout") {
			alert("You must login first")
		}
	})
	//bind ab change events
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
		let target = $(e.target).attr("href")
		if (target === '#log') { ///when checking for equality, ids must be '#id'
			WorkoutLog.log.setDefinitions()
		}
		if (target === '#updateLog') {
			WorkoutLog.log.setDefinitions()
		}
		if (target === '#history') {
			WorkoutLog.log.getChart()
		}
	})
	//bind enter key
	$(document).on('keypress', function(e) {
		if (e.which === 13) {
			if ($(signupModal).is(':visible')) {
				$(signup).trigger('click')
			}
			if ($(loginModal).is(':visible')) {
				$(login).trigger('click')
			}
		}
	})
	//set header
	let token = window.localStorage.getItem("sessionToken")
	if (token) {
		WorkoutLog.setAuthHeader(token)
		$(homeNav).click()
		// $(loginPage).hide()
	} else {
		$(loginout).click()
	}

	//expose this to the other workoutlog modules 
	window.WorkoutLog = WorkoutLog
	// if(!window.localStorage.getItem('sessionToken')) {
	// 	WorkoutLog.loginout()
	// }
})

// this file gets the info from api/test. it works because onready it runs let test and gets