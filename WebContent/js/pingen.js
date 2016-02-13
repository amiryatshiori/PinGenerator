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
	Ink.requireModules(['Ink.Net.Ajax_1','Ink.Dom.Element_1'], function(Ajax,InkElement) {
		var container = Ink.i('main-panel');
		Ajax.load('pingen-spec.html', function (res) {
		    InkElement.setHTML(container,res);
		});
	});
}

function menuJobList() {
	Ink.requireModules(['Ink.Net.Ajax_1','Ink.Dom.Element_1','Ink.Net.JsonP_1'], function(Ajax,InkElement,JsonP) {
		var container = Ink.i('main-panel');
		InkElement.setHTML(container,'<h2>Job List</h2><div id="joblist"></div>');
		var joblist = Ink.i('joblist');
        var uri = window.url_home + '/JobList';
        new Ajax(uri, {
            method: 'GET',
            onSuccess: function(obj) {
                if(obj && obj.responseJSON) {
                  	var json = obj.responseJSON;
					for(var i=0, total=json.joblist.length; i < total; i++) {
						var joblistStatusColor = "joblist-processing";
						if (json.joblist[i].STATUS == 'S') {joblistStatusColor = "joblist-succeed"} 
						else if (json.joblist[i].STATUS == 'F') {joblistStatusColor = "joblist-failed"}
						var contents = '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Job ID: '+json.joblist[i].JOBID;
						contents += '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Status: '+json.joblist[i].STATUS;
		        		InkElement.appendHTML(joblist,'<div class="joblist '+joblistStatusColor+'">'+contents+'</div>');
					}
                }
            }, 
            onFailure: function() {
Ink.log("result: failed on network!");
            }
        });
        
/*
        new JsonP(uri, {
            params: {limit: '3'}, // the query string parameters can be defined here 
            onSuccess: function(data) {
            	
                var aItems = data.rss.channel.item;
                var container = Ink.i('container');
                var curImg;
                for(var i=0, total=aItems.length; i < total; i++) {
                    curImg = new Image();
                    curImg.src = aItems[i]['media:thumbnail'][0].url;
                    container.appendChild(curImg);
                }
                
Ink.log("result: " + data[0]);Ink.log("result: " + data[1]);
            }, 
            onFailure: function() {
                Ink.warn('JsonP request failed');
            }
        });
*/
	});
}

function pinGenBatchButtonGenerateClick() {
	Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1','Ink.UI.Modal_1'], function(Ajax,FormSerialize,InkElement,Modal) {
	    var form = Ink.i('formPinGenBatch');
        var formData = FormSerialize.serialize(form);
		InkElement.setHTML(Ink.i('pinDigitConfirm'),'Pin Digit: <b style="color:red">' + formData.pinDigit + '</b>');
		InkElement.setHTML(Ink.i('pinAmountConfirm'),'Pin Amount: <b style="color:red">' + formData.pinAmount + '</b>');
		var modalPinGenBatch = new Modal('#formPinGenBatchConfirm');
		modalPinGenBatch.open(); 
	});
}

function pinGenBatchButtonConfirmClick() {
Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1','Ink.UI.Carousel_1','Ink.UI.ProgressBar_1'], function(Ajax,FormSerialize,InkElement,Carousel,ProgressBar) {
    var form = Ink.i('formPinGenBatch');
    var formData = FormSerialize.serialize(form);
    var pinAmount = formData.pinAmount;
    Ink.i('pinDigit').disabled = true;Ink.i('pinAmount').disabled = true;
    Ink.i('buttonGenerate').disabled = true;Ink.i('buttonCancel').disabled = true;
    var uri = window.url_home + '/PinGenBatch';
    new Ajax(uri, {
        method: 'POST',
        postBody: formData,
        onSuccess: function(obj) {
            if(obj && obj.responseJSON) {
            	var result = obj.responseJSON['result'];var jobId = obj.responseJSON['jobId'];
Ink.log("result: " + result);Ink.log("jobId: " + jobId);
				if(result==="succeed"){
					var crs = new Carousel('#pinGenBatchCarousel');crs.nextPage();
					InkElement.setHTML(Ink.i('pinGenBatchJobId'),'Job ID: <b style="color:red">' + jobId + '</b>');
					var probar = probar = new ProgressBar('#pinGenBatchProgressBar');
					setTimeout(function(){pinGenBatchUpdateProgress(probar,jobId,pinAmount);},2000);
				}
            }
        }, 
        onFailure: function() {result="failed on network!"
Ink.log("result: " + result);
        }
    });
});
}

function pinGenBatchUpdateProgress(probar,jobId,pinAmount) {
	Ink.requireModules(['Ink.Net.Ajax_1','Ink.Dom.Element_1','Ink.UI.ProgressBar_1'], function(Ajax,InkElement,ProgressBar) {
	    var uri = window.url_home + '/PinGenBatchCount?jobId='+jobId;
	    new Ajax(uri, {
	        method: 'GET',
	        onSuccess: function(obj) {
	            if(obj && obj.responseJSON) {
	            	var result = obj.responseJSON['result'];var c = obj.responseJSON['count'];
Ink.log("result: " + result);Ink.log("jobId: " + jobId);Ink.log("count: " + c);
					if(result==="succeed"){
						if (!probar) {probar = new ProgressBar('#pinGenBatchProgressBar');}
						var p = c/pinAmount*100;
						probar.setValue(Math.floor(p));
						if (c < pinAmount) {
							setTimeout(function(){pinGenBatchUpdateProgress(probar,jobId,pinAmount);},3000);
						} else {
							InkElement.setHTML(Ink.i('pinGenBatchProgressBarCaption'),'<div style="color:white"><i class="fa fa-cog"></i>&nbsp;&nbsp;Succeed</div>');
							InkElement.setHTML(Ink.i('pinGenBatchAction'),'Export as CSV file: click <a href="'+window.url_home + '/PinGenBatchCSV?jobId='+jobId+'">here</a>');
						}
					} else {
Ink.log("result: " + result);
					}
	            }
	        }, 
	        onFailure: function() {result="failed on network!"
Ink.log("result: " + result);
	        }
	    });
	});
}