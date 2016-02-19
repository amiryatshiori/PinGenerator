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

function menuPinExport() {
	Ink.requireModules(['Ink.Net.Ajax_1','Ink.Dom.Element_1'], function(Ajax,InkElement) {
		var container = Ink.i('main-panel');
		Ajax.load('pingen-export.html', function (res) {
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
	});
}

function addSep(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
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

function pinGenSpecButtonPlusClick() {
	Ink.requireModules(['Ink.Dom.Element_1'], function(InkElement) {
		var stacker = Ink.i('pinGenSpecStack');
		InkElement.appendHTML(stacker,'<div class="ink-alert basic info"><b>A - 1</b></div>');
	});
}

function pinGenSpecButtonAddClick() {
	Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1','Ink.UI.Modal_1'], function(Ajax,FormSerialize,InkElement,Modal) {
	    var form = Ink.i('formPinGenSpec');
        var formData = FormSerialize.serialize(form);
		//InkElement.setHTML(Ink.i('pinConfirm'),'<b style="color:red">' + formData.pin + '</b>');
		var modalPinGenSpec = new Modal('#formPinGenSpecConfirm');
		modalPinGenSpec.open(); 
	});
}

function pinGenSpecButtonConfirmClick() {
	Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1','Ink.UI.Carousel_1','Ink.UI.ProgressBar_1'], function(Ajax,FormSerialize,InkElement,Carousel,ProgressBar) {
	    var pinCount = Ink.i('pinCount');
	    var pValue;var aPin = [];
		for (var i = 1; i <= pinCount.value; i++) {
			pValue = Ink.i('pin'+i).value;
			if (pValue.match(/\S/)) {aPin.push(pValue);}
		}
		InkElement.setHTML(Ink.i('pinInput'),'');
		pinCount.value = aPin.length;
		for (var i = 0; i < aPin.length; i++) {
			var pinInputHtml = '<div class="control-group column-group"><div class="control">';
			pinInputHtml += '<input id="pin'+i+'" name="pin'+i+'" value="'+aPin[i]+'" style="width:15em;" type="text" placeholder="Specific Pin" maxlength="15" onkeypress=\'return (event.charCode >= 48 && event.charCode <= 57)\'>';
			pinInputHtml += '</div><div id="pinSpin'+i+'" style="font-size:1.6em;margin-top:-.3em;margin-left:.8em"><i class="fa fa-cog fa-spin"></i></div>&nbsp;&nbsp;&nbsp;<div id="pinMsg'+i+'"></div></div>';
			InkElement.appendHTML(Ink.i('pinInput'),pinInputHtml);
			Ink.i('pin'+i).disabled = true;
		}
		var form = Ink.i('formPinGenSpec');
	    var formData = FormSerialize.serialize(form);
	    var pin = formData.pin;
	    Ink.i('buttonAdd').disabled = true;Ink.i('buttonCancel').disabled = true;
	    var uri = window.url_home + '/PinGenSpec';
	    new Ajax(uri, {
	        method: 'POST',
	        postBody: formData,
	        onSuccess: function(obj) {
	            if(obj && obj.responseJSON) {
	            	var result = obj.responseJSON['result'];var jobId = obj.responseJSON['jobId'];
Ink.log("result: " + result);Ink.log("jobId: " + jobId);
					if(result==="succeed"){
						for (var i = 0; i < aPin.length; i++) {
							var uri = window.url_home + '/PinGenSpecX?pin='+aPin[i]+'&pinId='+i+'&jobId='+jobId;
						    new Ajax(uri, {
						        method: 'GET',
						        onSuccess: function(obj) {
						            if(obj && obj.responseJSON) {
						            	var result = obj.responseJSON['result'];var pinId = obj.responseJSON['pinId'];
				Ink.log("result: " + result);Ink.log("pinId: " + pinId);
										if(result==="duplicated"){
											InkElement.setHTML(Ink.i('pinSpin'+pinId),'<i class="fa fa-times-circle" style="color:red"></i>');
											InkElement.setHTML(Ink.i('pinMsg'+pinId),'<div class="ink-label red" style="font-size:.5em;height:1.8em;margin-top:1.4em;">Duplicated PIN</div>');
										} else if(result==="succeed"){
											InkElement.setHTML(Ink.i('pinSpin'+pinId),'<i class="fa fa-check-circle" style="color:green"></i>');
										} else {
											InkElement.setHTML(Ink.i('pinSpin'+pinId),'<i class="fa fa-times-circle" style="color:red"></i>');
										}
						            }
						        }, 
						        onFailure: function() {result="failed on network!"
				Ink.log("result: " + result);
						        	InkElement.setHTML(Ink.i('pinSpin'+i),'<i class="fa fa-times-circle" style="color:red">Network</i>');
						        }
						    });
						}
					}
	            }
	        }, 
	        onFailure: function() {result="failed on network!"
Ink.log("result: " + result);
	        }
	    });
	});
}

function pinExportButtonExportClick() {
	Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1','Ink.UI.Modal_1'], function(Ajax,FormSerialize,InkElement,Modal) {
	    var form = Ink.i('formPinExport');
        var formData = FormSerialize.serialize(form);
		InkElement.setHTML(Ink.i('pinDigitConfirm'),'Pin Digit: <b style="color:red">' + formData.pinDigit + '</b>');
		var modalPinGenBatch = new Modal('#formPinExportConfirm');
		modalPinGenBatch.open(); 
	});
}

function pinExportButtonConfirmClick() {
Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1','Ink.UI.Carousel_1','Ink.UI.ProgressBar_1'], function(Ajax,FormSerialize,InkElement,Carousel,ProgressBar) {
    var form = Ink.i('formPinExport');
    var formData = FormSerialize.serialize(form);
    Ink.i('pinDigit').disabled = true;
    Ink.i('buttonExport').disabled = true;Ink.i('buttonCancel').disabled = true;
    var uri = window.url_home + '/PinExport';
    new Ajax(uri, {
        method: 'POST',
        postBody: formData,
        onSuccess: function(obj) {
            if(obj && obj.responseJSON) {
            	var result = obj.responseJSON['result'];
Ink.log("result: " + result);
				if(result==="succeed"){
					var crs = new Carousel('#pinExportCarousel');crs.nextPage();
					InkElement.setHTML(Ink.i('pinExportJobId'),'Job ID: <b style="color:red">' + jobId + '</b>');
					var probar = probar = new ProgressBar('#pinExportProgressBar');
					setTimeout(function(){pinExportUpdateProgress(probar,jobId,pinAmount);},2000);
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
