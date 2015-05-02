var $ = require('jquery');
var OctopullView = require('./view.js');
var OctopullAgent = require('./agent.js');

var agent = OctopullAgent.get();
var view = new OctopullView();

view.on("loading", function() {
	view.repoActions.clear();
});

view.on("load", function(screen) {	
	if (screen.owner && screen.repository && screen.pull_request && screen.diff_base && screen.diff_head) {
		agent.navigate("repos/" + screen.owner + "/" + screen.repository + "/pulls/" + screen.pull_request + "/diff/" + screen.diff_base + "/" + screen.diff_head);
	}
});

agent.on("loading", function() {
	view.showProgressBar();
});

agent.on("loaded", function() {
	view.hideProgressBar();
});

agent.on("error", function(error) {
	var message = 'Octopull encountered an error when contacting the server.';
	var extra = error.text || error.status;
	if (extra) {
		message += ' (' + extra + ')';
	}
	
	view.addMessage({
		level: 'error',
		title: 'Something went wrong',
		message: message
	});
});

agent.on("message", function(message) {
	view.addMessage(message);
});

agent.on("repository", function(repo) {
	view.clear();
	view.setRepo(repo);
});

agent.on("created", function(created) {
	if (created.location) {
		window.location.assign(created.location);
	}
});