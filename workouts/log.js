$(function() {
	$.extend(WorkoutLog, {
		log: {
			workouts: [],
			setDefinitions: function() {
				let defs = WorkoutLog.definition.userDefinitions
				let len = defs.length
				let opts = ""
				for (let i = 0; i < len; i++) {
					opts += "<option value='" + defs[i].id +"'>" + defs[i].description + "</option>"
				}
				$(logDefinition).children().remove()
				$(logDefinition).append(opts)
				$(updateDefinition).children().remove()
				$(updateDefinition).append(opts)
			},
			setHistory: function(data) {
				let history = data
				let len = data.length
				let lis = ""
				for (let i = 0; i < len; i++) {
					lis += "<li class='list-group-item' style='height: auto;'>" + 
					history[i].def + ", " + 
					history[i].date + " - " +
					history[i].time + " minutes" +
					"<div style='float: right'>" +
						"<a style='margin-left: 30px !important; height: 100%;' id='" + history[i].id + "' class='update logHistoryLink'><strong>U</strong></a>" +
						"<a id='" + history[i].id + "' class='remove logHistoryLink'><strong>X</strong></a>" +
					"</div></li>"
				}
				$(historyList).children().remove()
				$(historyList).append(lis)
			},
			checkForm: function() {
				if ($(logDescription).val() != "" && $(logResult).val() != "") {
					WorkoutLog.log.create()
				} else {
					alert("Please fill out all fields")
				}
			},
			create: function () {
				let itsLog = {
					desc: $(logDescription).val(),
					result: $(logResult).val(),
					date: $(logDate).val(),
					def: $('#logDefinition option:selected').text()
				}
				let postData = {log: itsLog}
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
					$(logDate).val("")
					// $('a[href="#history"]').tab("show")
				})
			},
			getWorkout: function () {
				let thisLog = {id: $(this).attr('id')}
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
					$(updateLogDate).val(data.date)
				})

			},
			getChart: function() {
				if (WorkoutLog.log.workouts.length < 3) {
					$(chartHeader).html("Please enter more logs to see a chart of data")
				} else {
					$(chartHeader).html("Progression of time spent running")
					let ctx = document.getElementById("runningtimeChartTab").getContext('2d');
					let lengthArray = []
					for (let result of WorkoutLog.log.workouts) {
						let time = result.result
						let id = result.id
						let def = result.def
						let lengthDateOrder = result.date.replace(/\D/g, '')
						lengthArray.push({
							time,
							id,
							def,
							lengthDateOrder
						})
					}
					lengthArray.sort(function(a, b) {
	    				return parseFloat(a.lengthDateOrder) - parseFloat(b.lengthDateOrder);
					})
					let newlengthArray = lengthArray.map(function(a) {return a.time;})


					let dateArray = []
					for(let result of WorkoutLog.log.workouts) {
						let date = result.date
						let dateOrder = result.date.replace(/\D/g, '')
						dateArray.push({
							date,
							dateOrder
						})
					}
					dateArray.sort(function(a, b) {
	    				return parseFloat(a.dateOrder) - parseFloat(b.dateOrder);
					});
					let newdateArray = dateArray.map(function(a) {return a.date;})
					let finalArray = []
					for (let i in dateArray) {
						let obj ={}
						Object.assign(obj, dateArray[i], lengthArray[i])
						finalArray.push(obj)
					}
					WorkoutLog.log.setHistory(finalArray)
					let myChart = new Chart(ctx, {
					    type: 'bar',
					    data: {
					        labels: newdateArray,
					        datasets: [{
					            label: 'Time spent running (minutes)',
					            data: newlengthArray,
					            backgroundColor: [
					                'rgba(255, 99, 132, 0.2)',
					                'rgba(54, 162, 235, 0.2)',
					                'rgba(255, 206, 86, 0.2)',
					                'rgba(75, 192, 192, 0.2)',
					                'rgba(153, 102, 255, 0.2)',
					                'rgba(255, 159, 64, 0.2)'
					            ],
					            borderColor: [
					                'rgba(255,99,132,1)',
					                'rgba(54, 162, 235, 1)',
					                'rgba(255, 206, 86, 1)',
					                'rgba(75, 192, 192, 1)',
					                'rgba(153, 102, 255, 1)',
					                'rgba(255, 159, 64, 1)'
					            ],
					            borderWidth: 1
					        }]
					    },
					    options: {
					        scales: {
					            yAxes: [{
					                ticks: {
					                    beginAtZero:true
					                }
					            }]
					        }
					    }
					});
				}
			},
			updateWorkout: function() {
				// $(update).text("Update")
				let updateLog = {
					id: $(updateID).val(),
					desc: $(updateDescription).val(),
					result: $(updateResult).val(),
					date: $(updateLogDate).val(),
					def: $("#updateDefinition option:selected").text()
				}
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
						WorkoutLog.log.workouts = data 
				})
				.fail(function(err) {
						console.log(err)
				})
			}
		}
	})
	$(logSave).on('click', WorkoutLog.log.checkForm)
	WorkoutLog.log.getChart()
	$(historyList).on('click', '.remove', WorkoutLog.log.delete)
	$(logUpdate).on('click', WorkoutLog.log.updateWorkout)
	$(historyList).on( 'click', '.update', WorkoutLog.log.getWorkout)
	// $(updateDefinition).on( 'click', '.update', WorkoutLog.log.getWorkout)
	// WorkoutLog.log.getWorkout
	$(history).on('click').tab('show')

	if(window.localStorage.getItem('sessionToken')) {
		WorkoutLog.log.fetchAll()
	}
})
