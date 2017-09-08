$(document).ready(function(){let o=function(o,t){return{API_BASE:"https://track-my-workouts.herokuapp.com/api/",setAuthHeader:function(t){window.localStorage.setItem("sessionToken",t),o.ajaxSetup({headers:{Authorization:t}})}}}(jQuery);$(".nav-tabs a[data-toggle=tab]").on("click",function(o){let t=window.localStorage.getItem("sessionToken");if($(this).hasClass("disabled")&&!t)return o.preventDefault(),!1}),$('a[data-toggle="tab"]').on("shown.bs.tab",function(t){let e=$(t.target).attr("href");"#log"===e&&o.log.setDefinitions(),"#updateLog"===e&&o.log.setDefinitions(),"#history"===e&&o.log.setHistory()}),$(document).on("keypress",function(o){13===o.which&&($(signupModal).is(":visible")&&$(signup).trigger("click"),$(loginModal).is(":visible")&&$(login).trigger("click"))});let t=window.localStorage.getItem("sessionToken");t&&o.setAuthHeader(t),t||($(define).on("click",alert("You must login first")),$(log).on("click",alert("You must login first")),$(history).on("click",alert("You must login first"))),window.WorkoutLog=o}),$(function(){$.extend(WorkoutLog,{definition:{userDefinitions:[],create:function(){let o={definition:{desc:$(defDescription).val(),type:$(defLogtype).val()}};$.ajax({type:"POST",url:WorkoutLog.API_BASE+"definition",data:JSON.stringify(o),contentType:"application/json"}).done(function(o){WorkoutLog.definition.userDefinitions.push(o.definition),console.log(o),$(defDescription).val(""),$(defLogtype).val(""),$('a[href="#log"]').tab("show")})},fetchAll:function(){$.ajax({type:"GET",url:WorkoutLog.API_BASE+"definition",headers:{authorization:window.localStorage.getItem("sessionToken")}}).done(function(o){WorkoutLog.definition.userDefinitions=o,console.log(WorkoutLog.definition)}).fail(function(o){console.log(o)})}}}),$(defSave).on("click",WorkoutLog.definition.create),window.localStorage.getItem("sessionToken")&&WorkoutLog.definition.fetchAll()}),$(function(){console.log(WorkoutLog.definition),$.extend(WorkoutLog,{log:{workouts:[],setDefinitions:function(){let o=WorkoutLog.definition.userDefinitions;console.log(o,"defs");let t=o.length,e="";for(let i=0;i<t;i++)e+="<option value='"+o[i].id+"'>"+o[i].description+"</option>";$(logDefinition).children().remove(),$(logDefinition).append(e),$(updateDefinition).children().remove(),$(updateDefinition).append(e)},setHistory:function(){let o=WorkoutLog.log.workouts;console.log(o,"history");let t=o.length,e="";console.log("setHistoryrunning");for(let i=0;i<t;i++)e+="<li class='list-group-item'>"+o[i].def+" - "+o[i].result+" <div class='pull-right'><button id='"+o[i].id+"' class='update'><strong>U</strong></button><button id='"+o[i].id+"' class='remove'><string>X</strong></button></div></li>";$(historyList).children().remove(),$(historyList).append(e)},create:function(){let o={log:{desc:$(logDescription).val(),result:$(logResult).val(),def:$("#logDefinition option:selected").text()}};console.log(o),$.ajax({type:"POST",url:WorkoutLog.API_BASE+"log",data:JSON.stringify(o),contentType:"application/json"}).done(function(o){WorkoutLog.log.workouts.push(o),$(logDescription).val(""),$(logResult).val(""),$('a[href="#history"]').tab("show")})},getWorkout:function(){console.log("HEY THIS IS WORKING PROPERLY");let o={id:$(this).attr("id")};console.log(o),console.log($(this)),logID=o.id;let t={log:o};$.ajax({type:"GET",url:WorkoutLog.API_BASE+"log/"+logID,data:JSON.stringify(t),contentType:"application/json"}).done(function(o){$('a[href="#updateLog"]').tab("show"),$(updateResult).val(o.result),$(updateDescription).val(o.description),$(updateID).val(o.id)})},updateWorkout:function(){console.log("test");let o={id:$(updateID).val(),desc:$(updateDescription).val(),result:$(updateResult).val(),def:$("#updateDefinition option:selected").text()};console.log(o,"updateLog");for(var t=0;t<WorkoutLog.log.workouts.length;t++)WorkoutLog.log.workouts[t].id==o.id&&WorkoutLog.log.workouts.splice(t,1);WorkoutLog.log.workouts.push(o);let e={log:o};$.ajax({type:"PUT",url:WorkoutLog.API_BASE+"log",data:JSON.stringify(e),contentType:"application/json"}).done(function(o){console.log(o),$(updateDescription).val(""),$(updateResult).val(""),$('a[href="#history"]').tab("show")})},delete:function(){let o={id:$(this).attr("id")},t={log:o},e=$.ajax({type:"DELETE",url:WorkoutLog.API_BASE+"log",data:JSON.stringify(t),contentType:"application/json"});$(this).closest("li").remove();for(let t=0;t<WorkoutLog.log.workouts.length;t++)(WorkoutLog.log.workouts[t].id=o.id)&&WorkoutLog.log.workouts.splice(t,1);e.fail(function(){console.log("nope, you didn't delete it, an error occurred")})},fetchAll:function(){$.ajax({type:"GET",url:WorkoutLog.API_BASE+"log",headers:{authorization:window.localStorage.getItem("sessionToken")}}).done(function(o){console.log("test log.jsworkouts"),WorkoutLog.log.workouts=o,console.log(o)}).fail(function(o){console.log(o)})}}}),$(logSave).on("click",WorkoutLog.log.create),$(historyList).on("click",".remove",WorkoutLog.log.delete),$(logUpdate).on("click",WorkoutLog.log.updateWorkout),$(historyList).on("click",".update",WorkoutLog.log.getWorkout),$(history).on("click").tab("show"),window.localStorage.getItem("sessionToken")&&WorkoutLog.log.fetchAll()}),$(function(){$.extend(WorkoutLog,{signup:function(){let o={user:{username:$(su_username).val(),password:$(su_password).val()}};$.ajax({type:"POST",url:WorkoutLog.API_BASE+"user",data:JSON.stringify(o),contentType:"application/json"}).done(function(o){o.sessionToken&&(WorkoutLog.setAuthHeader(o.sessionToken),console.log("you made it"),console.log(o.sessionToken),WorkoutLog.definition.fetchAll(),WorkoutLog.log.fetchAll()),$(signupModal).modal("hide"),$(".disabled").removeClass("disabled"),$(loginout).text("Logout"),$('a[href="#define"]').tab("show"),$(su_username).val(""),$(su_password).val("")}).fail(function(){$(su_error).text("There was an issue with sign up").show()}).always(function(){alert("hey play this cool game while you sign up")})},login:function(){let o={user:{username:$(li_username).val(),password:$(li_password).val()}};$.ajax({type:"POST",url:WorkoutLog.API_BASE+"login",data:JSON.stringify(o),contentType:"application/json"}).done(function(o){o.sessionToken&&(WorkoutLog.setAuthHeader(o.sessionToken),console.log("you logged in!"),WorkoutLog.definition.fetchAll(),WorkoutLog.log.fetchAll()),$(loginModal).modal("hide"),$(".disabled").removeClass("disabled"),$(loginout).text("Logout"),$('a[href="#define"]').tab("show"),$(li_username).val(""),$(li_password).val("")}).fail(function(){$(li_error).text("There was an issue with log in").show()})},loginout:function(){window.localStorage.getItem("sessionToken")&&(window.localStorage.removeItem("sessionToken"),window.location.reload(!0))}}),$(signup).on("click",WorkoutLog.signup),$(login).on("click",WorkoutLog.login),$(loginout).on("click",WorkoutLog.loginout),$(loginout).text("Logout")});
//# sourceMappingURL=maps/bundle.js.map
