$(function() {
	$.extend(WorkoutLog, {
		definition: {
			userDefinitions: [],

			create: function() {
				let def = {
					desc: $(defDescription).val(),
					type: $(defLogtype).val()
				}
				
				let postData = { definition: def}
				let define = $.ajax({
					type: "POST",
					url: WorkoutLog.API_BASE + "definition",
					data: JSON.stringify(postData),
					contentType: "application/json"
				})

				define.done(function(data) {
					WorkoutLog.definition.userDefinitions.push(data.definition)
				$(defDescription).val("")
				$(defLogtype).val("")
				$('a[href="#log"]').tab("show")
				})
			},
			checkForm: function() {
				if ($(defDescription).val() != "") {
					WorkoutLog.definition.create()
				} else {
					alert("Please fill out all fields")
				}
			},
			fetchAll: function() {
				let fetchDefs = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + "definition",
					headers: {
						"authorization": window.localStorage.getItem('sessionToken')
					}
				}).done (function(data) {
					WorkoutLog.definition.userDefinitions = data
					// console.log(data)
				})
				.fail(function(err) {
					console.log(err)
				})

			}
		}
	})

	// bindings
	$(defSave).on('click', WorkoutLog.definition.checkForm)
	//fetch definition if we already are authenticated and refreshed
	if (window.localStorage.getItem('sessionToken')) {
		WorkoutLog.definition.fetchAll()
	}
})