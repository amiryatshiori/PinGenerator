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

function menuMapSerial() {
	Ink.requireModules(['Ink.Net.Ajax_1','Ink.Dom.Element_1'], function(Ajax,InkElement) {
		var container = Ink.i('main-panel');
		Ajax.load('serial-map.html', function (res) {
		    InkElement.setHTML(container,res);
		});
		Ajax.load('SerialMapPatternDropdown', function (res) {
	    	InkElement.setHTML(Ink.i('serialPattern'),res);
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
						contents += '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Type: '+json.joblist[i].TYPE+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Status: '+json.joblist[i].STATUS;
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

function loginButtonLoginClick() {
	Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1','Ink.UI.Carousel_1','Ink.UI.FormValidator_1'], function(Ajax,FormSerialize,InkElement,Carousel,FormValidator) {
	    var form = Ink.i('formLogin');
        if (FormValidator.validate(form)) {
            var formData = FormSerialize.serialize(form);
    	    var uri = window.url_home + '/Login';
    	    new Ajax(uri, {
    	        method: 'POST',
    	        postBody: formData,
    	        onSuccess: function(obj) {
    	            if(obj && obj.responseJSON) {
    	            	var result = obj.responseJSON['result'];var name = obj.responseJSON['name'];
Ink.log("result: " + result);Ink.log("name: " + name);
    					if(result==="succeed"){
    						InkElement.appendHTML(Ink.i('bar-top-nav'),'<ul class="menu horizontal push-right"><li><a href="#">'+name+'</a></li></ul>');
    						var container = Ink.i('main-screen');
    						Ajax.load('main.html', function (res) {
    						    InkElement.setHTML(container,res);
    						});
    					} else {
    					    if (typeof crsLogin == "undefined") {crsLogin = new Carousel('#loginCarousel');}
    						crsLogin.nextPage();	
    					}
    	            }
    	        }, 
    	        onFailure: function() {result="failed on network!"
Ink.log("result: " + result);
    	        }
    	    });
        }
	});
}

function loginButtonTryAgainClick() {
	crsLogin.previousPage();
}

function pinGenBatchButtonGenerateClick() {
	Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1','Ink.UI.Modal_1','Ink.UI.FormValidator_1'], function(Ajax,FormSerialize,InkElement,Modal,FormValidator) {
	    var form = Ink.i('formPinGenBatch');
        if (FormValidator.validate(form)) {
            var formData = FormSerialize.serialize(form);
			InkElement.setHTML(Ink.i('pinDigitConfirm'),'Pin Digit: <b style="color:red">' + formData.pinDigit + '</b>');
			InkElement.setHTML(Ink.i('pinAmountConfirm'),'Pin Amount: <b style="color:red">' + formData.pinAmount + '</b>');
			if (typeof modalPinGenBatch == "undefined") {modalPinGenBatch = new Modal('#formPinGenBatchConfirm');}
			modalPinGenBatch.open(); 
        }
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

function pinGenSpecButtonPlusClick(rowMore) {
	Ink.requireModules(['Ink.Dom.Element_1'], function(InkElement) {
		var pinCount = Ink.i('pinCount').value;
		pinCountNew = pinCount + rowMore;
		for (var i = pinCount+1; i <= pinCountNew; i++) {
			var pinInputHtml = '<div class="control-group column-group"><div class="control">';
			pinInputHtml += '<input id="pin'+i+'" name="pin'+i+'" style="width:15em;" type="text" placeholder="Specific Pin" maxlength="15" onkeypress=\'return (event.charCode >= 48 && event.charCode <= 57)\'>';
			pinInputHtml += '</div><div id="pinSpin'+i+'" style="font-size:1.6em;margin-top:-.3em;margin-left:.8em"></div></div>';
			InkElement.appendHTML(Ink.i('pinInput'),pinInputHtml);
		}
	});
}

function pinGenSpecButtonAddClick() {
	Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1','Ink.UI.Modal_1'], function(Ajax,FormSerialize,InkElement,Modal) {
	    var form = Ink.i('formPinGenSpec');
        var formData = FormSerialize.serialize(form);
		//InkElement.setHTML(Ink.i('pinConfirm'),'<b style="color:red">' + formData.pin + '</b>');
        if (typeof modalPinGenSpec == "undefined") {modalPinGenSpec = new Modal('#formPinGenSpecConfirm');}
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
	    Ink.i('buttonAdd').disabled = true;Ink.i('buttonCancel').disabled = true;
	    var uri = window.url_home + '/PinGenSpec?s=P';
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

					    var uri = window.url_home + '/PinGenSpec?s=S&jobid='+jobId;
					    new Ajax(uri, {
					        method: 'POST',
					        postBody: formData,
					        onSuccess: function(obj) {
					            if(obj && obj.responseJSON) {
					            	var result = obj.responseJSON['result'];var jobId = obj.responseJSON['jobId'];
Ink.log("result: " + result);Ink.log("jobId: " + jobId);
									if(result==="succeed"){
										InkElement.setHTML(Ink.i('pinGenSpecButton'),'<div class="push-left"><button class="ink-button" onclick="goHome()">&nbsp;&nbsp;&nbsp;Close&nbsp;&nbsp;&nbsp;</button></div>');
										InkElement.remove('pinGenSpecPlus');InkElement.remove('pinGenSpecPlus');
									}
								}
				            }, 
				            onFailure: function() {result="failed on network!";
Ink.log("result: " + result);
				            }
					    });
					}
	            }
	        }, 
	        onFailure: function() {result="failed on network!";
Ink.log("result: " + result);
	        }
	    });
	});
}

function serialMapButtonMapClick() {
	Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1','Ink.UI.Modal_1','Ink.UI.FormValidator_1'], function(Ajax,FormSerialize,InkElement,Modal,FormValidator) {
	    var form = Ink.i('formSerialMap');
	    var pat = Ink.i('serialPattern');
        if (FormValidator.validate(form)) {
            var formData = FormSerialize.serialize(form);
            InkElement.setHTML(Ink.i('serialMapPatternConfirm'),'Pattern: <b style="color:red">' + pat.options[pat.selectedIndex].text + '</b>');
    		InkElement.setHTML(Ink.i('serialMapPinAmountConfirm'),'Pin Amount: <b style="color:red">' + formData.pinAmount + '</b>');
    		if (typeof modalSerialMap == "undefined") {modalSerialMap = new Modal('#formSerialMapConfirm');}
    		modalSerialMap.open(); 
        }
	});
}

function serialMapButtonConfirmClick() {
	Ink.requireModules(['Ink.Net.Ajax_1', 'Ink.Dom.FormSerialize_1','Ink.Dom.Element_1','Ink.UI.Carousel_1','Ink.UI.ProgressBar_1'], function(Ajax,FormSerialize,InkElement,Carousel,ProgressBar) {
	    var form = Ink.i('formSerialMap');
	    var formData = FormSerialize.serialize(form);
	    var pinAmount = formData.pinAmount;
	    
	    var uri = window.url_home + '/SerialMapCountA';
	    new Ajax(uri, {
	        method: 'GET',
	        onSuccess: function(obj) {
	            if(obj && obj.responseJSON) {
	            	var result = obj.responseJSON['result'];var count = obj.responseJSON['count'];
Ink.log("result: " + result);Ink.log("count: " + count);
					if(result==="succeed"){
						if (count >= pinAmount) {
						    Ink.i('serialPattern').disabled = true;Ink.i('pinAmount').disabled = true;
						    Ink.i('buttonMap').disabled = true;Ink.i('buttonCancel').disabled = true;
						    var uri = window.url_home + '/SerialMap';
						    new Ajax(uri, {
						        method: 'POST',
						        postBody: formData,
						        onSuccess: function(obj) {
						            if(obj && obj.responseJSON) {
						            	var result = obj.responseJSON['result'];var jobId = obj.responseJSON['jobId'];
	Ink.log("result: " + result);Ink.log("jobId: " + jobId);
										if(result==="succeed"){
											var crs = new Carousel('#serialMapCarousel');crs.nextPage();
											InkElement.setHTML(Ink.i('serialMapJobId'),'Job ID: <b style="color:red">' + jobId + '</b>');
											var probar = probar = new ProgressBar('#serialMapProgressBar');
											setTimeout(function(){serialMapUpdateProgress(probar,jobId,pinAmount);},2000);
										}
						            }
						        }, 
						        onFailure: function() {result="failed on network!"
	Ink.log("result: " + result);
						        }
						    });
						} else {
							var alert = '<div class="ink-alert block" role="alert"><button class="ink-dismiss">&times;</button><h4>PIN is not enough!</h4>';
							alert += '<p>The amount of available PIN in stock is not enough for mapping process<br/>Please generate more PIN before execute further.</p></div>';
							InkElement.setHTML(Ink.i('serialMapAlert'),alert);
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

function serialMapUpdateProgress(probar,jobId,pinAmount) {
	Ink.requireModules(['Ink.Net.Ajax_1','Ink.Dom.Element_1','Ink.UI.ProgressBar_1'], function(Ajax,InkElement,ProgressBar) {
		var uri = window.url_home + '/SerialMapCount?jobId='+jobId;
	    new Ajax(uri, {
	        method: 'GET',
	        onSuccess: function(obj) {
	            if(obj && obj.responseJSON) {
	            	var result = obj.responseJSON['result'];var c = obj.responseJSON['count'];
Ink.log("result: " + result);Ink.log("jobId: " + jobId);Ink.log("count: " + c);
					if(result==="succeed"){
						if (!probar) {probar = new ProgressBar('#serialMapProgressBar');}
						var p = c/pinAmount*100;
						probar.setValue(Math.floor(p));
						if (c < pinAmount) {
							setTimeout(function(){serialMapUpdateProgress(probar,jobId,pinAmount);},3000);
						} else {
							InkElement.setHTML(Ink.i('serialMapProgressBarCaption'),'<div style="color:white"><i class="fa fa-cog"></i>&nbsp;&nbsp;Succeed</div>');
							InkElement.setHTML(Ink.i('serialMapAction'),'Export as CSV file: click <a href="'+window.url_home + '/PinGenBatchCSV?jobId='+jobId+'">here</a>');
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

function pinExportUpdateProgress(probar,jobId,pinAmount) {
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
