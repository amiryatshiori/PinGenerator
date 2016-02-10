function goHome() {
	window.location.replace(window.url_home);
}

function menuPinGenBatch() {
	Ink.requireModules(['Ink.Net.Ajax_1','Ink.Dom.Element_1'], function(Ajax,InkElement) {
		var container = Ink.i('main-panel');
		Ajax.load('pingen-batch.html', function (res) {
		    InkElement.setHTML(container,res);
		});
	});
}

function menuPinGenSpecific() {
	alert("spec");
}

function menuJobList() {
	Ink.requireModules(['Ink.Net.Ajax_1','Ink.Dom.Element_1'], function(Ajax,InkElement) {
		var container = Ink.i('main-panel');
		Ajax.load('job-list.html', function (res) {
		    InkElement.setHTML(container,res);
		});
	});
}

function pinGenButtonGenerateClick() {
	Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1'], function(Ajax,FormSerialize,InkElement) {

	    var form = Ink.i('formPinGenBatch');

        var formData = FormSerialize.serialize(form);
        //Ink.log(formData);
        var uri = window.url_home + '/PinGenBatch';
        new Ajax(uri, {
            method: 'POST',
            postBody: formData,
            onSuccess: function(obj) {
                if(obj && obj.responseJSON) {
                	var result = obj.responseJSON['result'];
                	var jobId = obj.responseJSON['jobId'];
                  	Ink.log("result: " + result);
                  	Ink.log("jobId: " + jobId);
                }
            }, 
            onFailure: function() {
            	Ink.log("result: failed on network!");
            }
        });
        menuJobList();
	});
}

