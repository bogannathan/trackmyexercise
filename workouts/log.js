$(function() {
		console.log(WorkoutLog.definition)
	$.extend(WorkoutLog, {
		log: {
			workouts: [],
			setDefinitions: function() {
				let defs = WorkoutLog.definition.userDefinitions
				console.log(defs, "defs")
				let len = defs.length
				let opts = ""
				for (let i = 0; i < len; i++) {
					opts += "<option value='" + defs[i].id +"'>" + defs[i].description + "</option>"
				}
				$(logDefinition).children().remove()
				$(logDefinition).append(opts)
			},
			setHistory: function() {
				let history = WorkoutLog.log.workouts
				console.log(history, "history")
				let len = history.length
				let lis = ""
				console.log('setHistoryrunning')
				for (let i = 0; i < len; i++) {
					lis += "<li class='list-group-item'>" + 
					history[i].def + " - " + 
					history[i].result + " " +
					"<div class='pull-right'>" +
						"<button id='" + history[i].id + "' class='update'><strong>U</strong></button>" +
						"<button id='" + history[i].id + "' class='remove'><string>X</strong></button>" +
					"</div></li>"
				}
				$(historyList).children().remove()
				$(historyList).append(lis)
			},
			create: function () {
				let itsLog = {
					desc: $(logDescription).val(),
					result: $(logResult).val(),
					def: $('#logDefinition option:selected').text()
				}
				let postData = {log: itsLog}
				console.log(postData)
				let logger = $.ajax({
					type: "POST",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(postData),
					contentType: "application/json"
				})
				logger.done(function(data) {
					WorkoutLog.log.workouts.push(data)
					$(logDescription).val("")
					$(logResult).val("")
					$('a[href="#history"]').tab("show")
				})
			},
			getWorkout: function () {
				console.log('HEY THIS IS WORKING PROPERLY')
				let thisLog = {id: $(this).attr('id')}
				console.log(thisLog)
				console.log($(this))
				logID = thisLog.id
				let updateData = { log: thisLog }
				let getLog = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + "log/" + logID,
					data: JSON.stringify(updateData),
					contentType: "application/json"
				})
				getLog.done(function(data) {
					$('a[href="#updateLog"]').tab("show")
					$(updateResult).val(data.result)
					$(updateDescription).val(data.description)
					$(updateID).val(data.id)
					WorkoutLog.log.updateDefinitions()
				})
			},
			updateDefinitions: function() {
				let defs = WorkoutLog.definition.userDefinitions
				console.log(defs, "defs")
				let len = defs.length
				let opts = ""
				for (let i = 0; i < len; i++) {
					opts += "<option value='" + defs[i].id +"'>" + defs[i].description + "</option>"
				}
				$(updateDefinition).children().remove()
				$(updateDefinition).append(opts)
			},
			updateWorkout: function() {
				console.log('test')
				// $(update).text("Update")
				let updateLog = {
					id: $(updateID).val(),
					desc: $(updateDescription).val(),
					result: $(updateResult).val(),
					def: $("#updateDefinition option:selected").text()
				}
				console.log(updateLog, "updateLog")
				for(var i = 0; i < WorkoutLog.log.workouts.length; i++){
					if(WorkoutLog.log.workouts[i].id == updateLog.id){
						WorkoutLog.log.workouts.splice(i, 1)
					}
				}
				WorkoutLog.log.workouts.push(updateLog)
				let updateLogData = { log: updateLog }
				let updater = $.ajax({
					type: "PUT",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(updateLogData),
					contentType: "application/json"
				})

				updater.done(function(data) {
					console.log(data)
					$(updateDescription).val("")
					$(updateResult).val("")
					$('a[href="#history"]').tab("show")
				})
			},
			delete: function(){
				let thisLog = {
					//"this" is the button on the li
					//.attr("id") targets teh value of the id attribute of the button
					id: $(this).attr("id")
				}
				let deleteData = {log: thisLog}
				let deleteLog = $.ajax({
					type: "DELETE",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(deleteData),
					contentType: "application/json"
				})
				//removes list iem. references button then grabvs cloesest li
				$(this).closest('li').remove()

				for (let i = 0; i <WorkoutLog.log.workouts.length; i++) {
					if(WorkoutLog.log.workouts[i].id = thisLog.id) {
						WorkoutLog.log.workouts.splice(i, 1)
					}
				}
				deleteLog.fail(function() {
					console.log('nope, you didn\'t delete it, an error occurred')
				})
			},
			fetchAll: function() {
				let fetchDefs = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + "log",
					headers: {
						"authorization": 
						window.localStorage.getItem("sessionToken")
					}
				})
				.done(function(data) {
					console.log('test log.jsworkouts')
						WorkoutLog.log.workouts = data 
						console.log(data)
				})
				.fail(function(err) {
						console.log(err)
				})
			}
		}
	})
	$(logSave).on('click', WorkoutLog.log.create)
	$(historyList).on('click', '.remove', WorkoutLog.log.delete)
	$(logUpdate).on('click', WorkoutLog.log.updateWorkout)
	$(historyList).on( 'click', '.update', WorkoutLog.log.getWorkout)
	$(updateDefinition).on( 'click', '.update', WorkoutLog.log.getWorkout)
	WorkoutLog.log.getWorkout
	$(history).on('click').tab('show')

	if(window.localStorage.getItem('sessionToken')) {
		WorkoutLog.log.fetchAll()
	}
})
