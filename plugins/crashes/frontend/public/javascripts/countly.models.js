(function (countlyCrashes, $, undefined) {

    //Private Properties
    var _crashData = {},
		_groupData = {},
		_reportData = {},
        _crashTimeline = {},
        _list = {},
        _activeAppKey = 0,
        _initialized = false,
        _period = {},
		_periodObj = {},
		_metrics = {},
		_groups = {},
        _lastId = null,
        _usable_metrics = {
            metrics: {},
            custom:{}
        };
        
    countlyCrashes.loadList = function (id) {
        $.ajax({
            type:"GET",
            url:countlyCommon.API_PARTS.data.r,
            data:{
                "api_key":countlyGlobal.member.api_key,
                "app_id":id,
                "method":"crashes",
                "list":1
            },
            dataType:"json",
            success:function (json) {
                for(var i = 0; i < json.length; i++){
                    _list[json[i]._id] = json[i].name;
                }
            }
        });
    }
    
    if(countlyGlobal.member && countlyGlobal.member.api_key && countlyCommon.ACTIVE_APP_ID != 0){
        countlyCrashes.loadList(countlyCommon.ACTIVE_APP_ID);
    }

    //Public Methods
    countlyCrashes.initialize = function (id, isRefresh) {
		_activeAppKey = countlyCommon.ACTIVE_APP_KEY;
		_initialized = true;
		_metrics = {
            "os_name":jQuery.i18n.map["crashes.os"], 
            "browser":jQuery.i18n.map["crashes.browser"], 
            "view":jQuery.i18n.map["crashes.view"], 
            "app_version":jQuery.i18n.map["crashes.app_version"], 
            "os_version":jQuery.i18n.map["crashes.os_version"],
			"manufacture":jQuery.i18n.map["crashes.manufacture"], 
			"device":jQuery.i18n.map["crashes.device"], 
			"resolution":jQuery.i18n.map["crashes.resolution"], 
			"orientation":jQuery.i18n.map["crashes.orientation"],
			"cpu":jQuery.i18n.map["crashes.cpu"],
			"opengl":jQuery.i18n.map["crashes.opengl"]
        };
        _groups = {
			"metrics":jQuery.i18n.map["crashes.group-metrics"],
			"custom":jQuery.i18n.map["crashes.group-custom"]
        };
            
        
        
		_period = countlyCommon.getPeriodForAjax();
		if(id){
            _lastId = id;
			return $.ajax({
				type:"GET",
				url:countlyCommon.API_PARTS.data.r,
				data:{
					"api_key":countlyGlobal.member.api_key,
					"app_id":countlyCommon.ACTIVE_APP_ID,
					"method":"crashes",
                    "period":_period,
					"group":id,
                    "display_loader": !isRefresh
				},
				dataType:"jsonp",
				success:function (json) {
					_groupData = json;
                    _list[_groupData._id] = _groupData.name;
					_groupData.dp = {};
					for(var i in _metrics){
                        if(_groupData[i]){
                            _usable_metrics.metrics[i] = _metrics[i];
                            _groupData.dp[i] = countlyCrashes.processMetric(_groupData[i], i, _metrics[i]);
                        }
					}
                    if(_groupData.custom){
                        for(var i in _groupData.custom){
                            _groupData.dp[i] = countlyCrashes.processMetric(_groupData.custom[i], i, i);
                            _usable_metrics.custom[i] = i.charAt(0).toUpperCase() + i.slice(1);
                        }
                    }
				}, 
                error:function(){
                    CountlyHelpers.alert(jQuery.i18n.map["crashes.not-found"], "red");
                    app.navigate("/crashes", true);
                }
			});
		}
		else
			return $.ajax({
				type:"GET",
				url:countlyCommon.API_PARTS.data.r,
				data:{
					"api_key":countlyGlobal.member.api_key,
					"app_id":countlyCommon.ACTIVE_APP_ID,
                    "period":_period,
					"method":"crashes",
                    "graph":1,
                    "display_loader": !isRefresh
				},
				dataType:"jsonp",
				success:function (json) {
					_crashData = json;
                    _crashTimeline = json.data;
                    setMeta();
					if(_crashData.crashes.latest_version == "")
						_crashData.crashes.latest_version = "None";
					if(_crashData.crashes.error == "")
						_crashData.crashes.error = "None";
					if(_crashData.crashes.os == "")
						_crashData.crashes.os = "None";
					if(_crashData.crashes.highest_app == "")
						_crashData.crashes.highest_app = "None";
				}
			});
    };
    
    countlyCrashes.getCrashName = function(id){
        if(_list[id])
            return _list[id];
        return id;
    }
    
    countlyCrashes.getRequestData =  function(){
        return {
					"api_key":countlyGlobal.member.api_key,
					"app_id":countlyCommon.ACTIVE_APP_ID,
					"method":"crashes",
					"group":_lastId,
                    "userlist":true
				};
    };
    
    countlyCrashes.getId = function(){
        return _lastId;
    }
    
    countlyCrashes.common = function (id, path, callback) {
		$.ajax({
			type:"GET",
            url:countlyCommon.API_PARTS.data.w + '/crashes/'+path,
            data:{
                args:JSON.stringify({
                    crash_id:id
                }),
                app_id: countlyCommon.ACTIVE_APP_ID,
                api_key:countlyGlobal['member'].api_key
            },
            dataType:"json",
			success:function (json) {
                if(callback)
                    callback(json);
			},
			error:function(){
                if(callback)
                    callback(false);
			}
		});
    };
	
	countlyCrashes.markResolve = function (id, callback) {
        countlyCrashes.common(id, "resolve", function(json){
            if(json && json.version)
                callback(json.version.replace(/:/g, '.'));
            else
                callback();
        });
    };
	
	countlyCrashes.markUnresolve = function (id, callback) {
        countlyCrashes.common(id, "unresolve", callback);
    };
    
    countlyCrashes.share = function (id, callback) {
        countlyCrashes.common(id, "share", callback);
    };
    
    countlyCrashes.unshare = function (id, callback) {
        countlyCrashes.common(id, "unshare", callback);
    };
    
    countlyCrashes.hide = function (id, callback) {
        countlyCrashes.common(id, "hide", callback);
    };
    
    countlyCrashes.show = function (id, callback) {
        countlyCrashes.common(id, "show", callback);
    };
    
    countlyCrashes.del = function (id, callback) {
        countlyCrashes.common(id, "delete", callback);
    };
    
    countlyCrashes.modifyShare = function (id, data, callback) {
		$.ajax({
			type:"GET",
            url:countlyCommon.API_PARTS.data.w + '/crashes/modify_share',
            data:{
                args:JSON.stringify({
                    crash_id:id,
                    data: data
                }),
                app_id: countlyCommon.ACTIVE_APP_ID,
                api_key:countlyGlobal['member'].api_key
            },
            dataType:"jsonp",
			success:function (json) {
                if(callback)
                    callback(true);
			},
			error:function(){
                if(callback)
                    callback(false);
			}
		});
    };
    
    countlyCrashes.addComment = function (id, data, callback) {
        data = data || {};
        data.app_id = countlyCommon.ACTIVE_APP_ID;
        data.crash_id = id;
		$.ajax({
			type:"GET",
            url:countlyCommon.API_PARTS.data.w + '/crashes/add_comment',
            data:{
                args:JSON.stringify(data),
                api_key:countlyGlobal['member'].api_key
            },
            dataType:"json",
			success:function (json) {
                if(callback)
                    callback(true);
			},
			error:function(){
                if(callback)
                    callback(false);
			}
		});
    };
    
    countlyCrashes.editComment = function (id, data, callback) {
        data = data || {};
        data.app_id = countlyCommon.ACTIVE_APP_ID;
        data.crash_id = id;
		$.ajax({
			type:"GET",
            url:countlyCommon.API_PARTS.data.w + '/crashes/edit_comment',
            data:{
                args:JSON.stringify(data),
                api_key:countlyGlobal['member'].api_key
            },
            dataType:"json",
			success:function (json) {
                if(callback)
                    callback(true);
			},
			error:function(){
                if(callback)
                    callback(false);
			}
		});
    };
    
    countlyCrashes.deleteComment = function (id, data, callback) {
        data = data || {};
        data.app_id = countlyCommon.ACTIVE_APP_ID;
        data.crash_id = id;
		$.ajax({
			type:"GET",
            url:countlyCommon.API_PARTS.data.w + '/crashes/delete_comment',
            data:{
                args:JSON.stringify(data),
                api_key:countlyGlobal['member'].api_key
            },
            dataType:"json",
			success:function (json) {
                if(callback)
                    callback(true);
			},
			error:function(){
                if(callback)
                    callback(false);
			}
		});
    };

    countlyCrashes.refresh = function (id) {		
        _period = countlyCommon.getPeriodForAjax();
		if(id){
			return $.ajax({
				type:"GET",
				url:countlyCommon.API_PARTS.data.r,
				data:{
					"api_key":countlyGlobal.member.api_key,
					"app_id":countlyCommon.ACTIVE_APP_ID,
					"method":"crashes",
                    "period":_period,
					"group":id,
                    "display_loader": false
				},
				dataType:"jsonp",
				success:function (json) {
					_groupData = json;
                    _list[_groupData._id] = _groupData.name;
					_groupData.dp = {};
					for(var i in _metrics){
                        if(_groupData[i]){
                            _usable_metrics.metrics[i] = _metrics[i];
                            _groupData.dp[i] = countlyCrashes.processMetric(_groupData[i], i, _metrics[i]);
                        }
					}
                    if(_groupData.custom){
                        for(var i in _groupData.custom){
                            _groupData.dp[i] = countlyCrashes.processMetric(_groupData.custom[i], i, i);
                            _usable_metrics.custom[i] = i.charAt(0).toUpperCase() + i.slice(1);
                        }
                    }
				}
			});
		}
		else
			return $.ajax({
				type:"GET",
				url:countlyCommon.API_PARTS.data.r,
				data:{
					"api_key":countlyGlobal.member.api_key,
					"app_id":countlyCommon.ACTIVE_APP_ID,
                    "period":_period,
					"method":"crashes",
                    "graph":1,
                    "display_loader": false
				},
				dataType:"jsonp",
				success:function (json) {
					_crashData = json;
					if(_crashData.crashes.latest_version == "")
						_crashData.crashes.latest_version = "None";
					if(_crashData.crashes.error == "")
						_crashData.crashes.error = "None";
					if(_crashData.crashes.os == "")
						_crashData.crashes.os = "None";
					if(_crashData.crashes.highest_app == "")
						_crashData.crashes.highest_app = "None";
                    
                    countlyCommon.extendDbObj(_crashTimeline, json.data);
				}
			});
    };

    countlyCrashes.reset = function () {
		_crashData = {};
		_groupData = {};
		_reportData = {};
        _crashTimeline = {};
        _metrics = {};
        _groups = {};
        _usable_metrics = {
            metrics:{},
            custom:{}
        };
    };
	
	countlyCrashes.processMetric = function (data, metric, label) {
        
		var ret = {dp:[{data:[[-1,null]], "label":label}],ticks:[[-1,""]]};
		if(data){
			var i = 0;
			for(var key in data){
				ret.dp[0].data.push([i,data[key]]);
                var l = key.replace(/:/g, '.');
                if(metric == "device" && countlyDeviceList && countlyDeviceList[l])
                    l = countlyDeviceList[l];
				ret.ticks.push([i,l]);
				i++;
			}
			ret.dp[0].data.push([i,null]);
		}
		return ret;
    };
    
    countlyCrashes.getChartData = function(metric, name){
		var chartData = [
                { data:[], label:name, color:'#DDDDDD', mode:"ghost" },
                { data:[], label:name, color:'#333933' }
            ],
            dataProps = [
                {
                    name:"p"+metric,
                    func:function (dataObj) {
                        return dataObj[metric]
                    },
                    period:"previous"
                },
                { name:metric }
            ];

        return countlyCommon.extractChartData(_crashTimeline, countlyCrashes.clearObject, chartData, dataProps);
	};
	
	countlyCrashes.getMetrics = function () {
		var ob = {};
        for(var i in _usable_metrics){
            ob[_groups[i]] = _usable_metrics[i];
        }
        return ob;
    };
	
	countlyCrashes.getData = function () {
		return _crashData;
    };
	
	countlyCrashes.getGroupData = function () {
		return _groupData;
    };
    
    countlyCrashes.setGroupData = function (data) {
        _metrics = {
            "os_name":jQuery.i18n.map["crashes.os"], 
            "browser":jQuery.i18n.map["crashes.browser"], 
            "view":jQuery.i18n.map["crashes.view"], 
            "app_version":jQuery.i18n.map["crashes.app_version"], 
            "os_version":jQuery.i18n.map["crashes.os_version"],
			"manufacture":jQuery.i18n.map["crashes.manufacture"], 
			"device":jQuery.i18n.map["crashes.device"], 
			"resolution":jQuery.i18n.map["crashes.resolution"], 
			"orientation":jQuery.i18n.map["crashes.orientation"],
			"cpu":jQuery.i18n.map["crashes.cpu"],
			"opengl":jQuery.i18n.map["crashes.opengl"]
        };
        _groups = {
			"metrics":jQuery.i18n.map["crashes.group-metrics"],
			"custom":jQuery.i18n.map["crashes.group-custom"]
        };
		_groupData = data;
        _groupData.dp = {};
		for(var i in _metrics){
            if(_groupData[i]){
                _usable_metrics.metrics[i] = _metrics[i];
                _groupData.dp[i] = countlyCrashes.processMetric(_groupData[i], i, _metrics[i]);
            }
		}
        if(_groupData.custom){
            for(var i in _groupData.custom){
                _groupData.dp[i] = countlyCrashes.processMetric(_groupData.custom[i], i, i);
                _usable_metrics.custom[i] = i.charAt(0).toUpperCase() + i.slice(1);
            }
        }
    };
	
	countlyCrashes.getReportData = function () {
		return _reportData;
    };
	
	countlyCrashes.getErrorName = function () {
		var error = _crashData.crashes.error.split(":")[0];
		return error;
	};
	
	countlyCrashes.getAffectedUsers = function () {
		if(_crashData.users.total > 0){
            var ret = [];
			var affected = (_crashData.users.affected/_crashData.users.total)*100;
			var fatal = (_crashData.users.fatal/_crashData.users.total)*100;
			var nonfatal = ((_crashData.users.affected-_crashData.users.fatal)/_crashData.users.total)*100;
			var name1 = Math.round(fatal)+"% "+jQuery.i18n.map["crashes.fatal"];
            if(fatal > 0)
                ret.push({"name":name1,"percent":fatal});
			var name2 = Math.round(nonfatal)+"% "+jQuery.i18n.map["crashes.nonfatal"];
            if(nonfatal > 0)
                ret.push({"name":name2,"percent":nonfatal});
			var name3 = Math.round(100-affected)+"% "+jQuery.i18n.map["crashes.notaffected"];
            if(100-affected > 0)
                ret.push({"name":name3,"percent":100-affected});
			return ret;
		}
		return [];
	};
	
	countlyCrashes.getFatalBars = function () {
		if(_crashData.crashes.total > 0){
            var ret = [];
            var total = _crashData.crashes.fatal + _crashData.crashes.nonfatal;
			var fatal = (_crashData.crashes.fatal/total)*100;
			var nonfatal = (_crashData.crashes.nonfatal/total)*100;
			var name1 = Math.round(fatal)+"% "+jQuery.i18n.map["crashes.fatal"];
            if(fatal > 0)
                ret.push({"name":name1,"percent":fatal});
			var name2 = Math.round(nonfatal)+"% "+jQuery.i18n.map["crashes.nonfatal"];
            if(nonfatal > 0)
                ret.push({"name":name2,"percent":nonfatal});
			return ret;
		}
		return [];
    };
	
	countlyCrashes.getResolvedBars = function () {
		if(_crashData.crashes.unique > 0){
            var ret = [];
            var total = Math.max(_crashData.crashes.resolved, 0) + Math.max(_crashData.crashes.unresolved,0);
			var resolved = (_crashData.crashes.resolved/total)*100;
			var unresolved = (_crashData.crashes.unresolved/total)*100;
			var name1 = Math.round(resolved)+"% "+jQuery.i18n.map["crashes.resolved"];
            if(resolved > 0)
                ret.push({"name":name1,"percent":resolved});
			var name2 = Math.round(unresolved)+"% "+jQuery.i18n.map["crashes.unresolved"];
            if(unresolved > 0)
                ret.push({"name":name2,"percent":unresolved});
			return ret;
		}
		return [];
    };
	
	countlyCrashes.getPlatformBars = function () {
		var res = [];
        var data = [];
		var total = 0;
        
		for(var i in _crashData.crashes.os){
            if(_crashData.crashes.os[i] > 0)
                data.push([i, _crashData.crashes.os[i]]);
		}
        
        data.sort(function(a, b) {return b[1] - a[1]});
        
        var maxItems = 3;
        if(data.length < maxItems)
            maxItems = data.length;
        
		for(var i = 0; i < maxItems; i++){
            total += data[i][1];
        }
        
		for(var i = 0; i < maxItems; i++){
            res.push({"name":data[i][0],"percent":(data[i][1]/total)*100});
		}
        
		return res;
    };
    
    countlyCrashes.getBoolBars = function (name) {
		if(_groupData[name]){
            _groupData[name].yes = _groupData[name].yes || 0;
            _groupData[name].no = _groupData[name].no || 0;
            var total = _groupData[name].yes + _groupData[name].no;
			var yes = (_groupData[name].yes/total)*100;
			var no = (_groupData[name].no/total)*100;
            var ret = [];
            if(yes > 0){
                ret.push({"name":yes.toFixed(2)+"%","percent":yes});
                ret.push({"name":no.toFixed(2)+"%","percent":no});
            }
            else{
                ret.push({"name":yes.toFixed(2)+"%","percent":no, "background":"#86CBDD"});
            }
			return ret;
		}
		return [];
    };
    
    countlyCrashes.getDashboardData = function () {

        //Update the current period object in case selected date is changed
        _periodObj = countlyCommon.periodObj;

        var dataArr = {},
            tmp_x,
            tmp_y,
            currentTotal = 0,
            previousTotal = 0,
            currentUnique = 0,
            previousUnique = 0,
            currentNonfatal = 0,
            previousNonfatal = 0,
            currentFatal = 0,
            previousFatal = 0,
            currentResolved = 0,
            previousResolved = 0;

        if (_periodObj.isSpecialPeriod) {
            
             for (var i = 0; i < (_periodObj.uniquePeriodArr.length); i++) {
                tmp_x = countlyCommon.getDescendantProp(_crashTimeline, _periodObj.uniquePeriodArr[i]);
                tmp_x = countlyCrashes.clearObject(tmp_x);
                currentUnique += tmp_x["cru"];
            }

            var tmpUniqObj,
                tmpCurrentUniq = 0;

            for (var i = 0; i < (_periodObj.uniquePeriodCheckArr.length); i++) {
                tmpUniqObj = countlyCommon.getDescendantProp(_crashTimeline, _periodObj.uniquePeriodCheckArr[i]);
                tmpUniqObj = countlyCrashes.clearObject(tmpUniqObj);
                tmpCurrentUniq += tmpUniqObj["cru"];
            }

            if (currentUnique > tmpCurrentUniq) {
                currentUnique = tmpCurrentUniq;
            }

            for (var i = 0; i < (_periodObj.previousUniquePeriodArr.length); i++) {
                tmp_y = countlyCommon.getDescendantProp(_crashTimeline, _periodObj.previousUniquePeriodArr[i]);
                tmp_y = countlyCrashes.clearObject(tmp_y);
                previousUnique += tmp_y["cru"];
            }

            var tmpUniqObj2,
                tmpPreviousUniq = 0;

            for (var i = 0; i < (_periodObj.previousUniquePeriodCheckArr.length); i++) {
                tmpUniqObj2 = countlyCommon.getDescendantProp(_crashTimeline, _periodObj.previousUniquePeriodCheckArr[i]);
                tmpUniqObj2 = countlyCrashes.clearObject(tmpUniqObj2);
                tmpPreviousUniq += tmpUniqObj2["cru"];
            }

            if (previousUnique > tmpPreviousUniq) {
                previousUnique = tmpPreviousUniq;
            }

            for (var i = 0; i < (_periodObj.currentPeriodArr.length); i++) {
                tmp_x = countlyCommon.getDescendantProp(_crashTimeline, _periodObj.currentPeriodArr[i]);
                tmp_x = countlyCrashes.clearObject(tmp_x);
                currentTotal += tmp_x["cr"];
                currentNonfatal += tmp_x["crnf"];
                currentFatal += tmp_x["crf"];
                currentResolved += tmp_x["crru"];
            }

            for (var i = 0; i < (_periodObj.previousPeriodArr.length); i++) {
                tmp_y = countlyCommon.getDescendantProp(_crashTimeline, _periodObj.previousPeriodArr[i]);
                tmp_y = countlyCrashes.clearObject(tmp_y);
                previousTotal += tmp_y["cr"];
                previousNonfatal += tmp_y["crnf"];
                previousFatal += tmp_y["crf"];
                previousResolved += tmp_y["crru"];
            }
        } else {
            tmp_x = countlyCommon.getDescendantProp(_crashTimeline, _periodObj.activePeriod);
            tmp_y = countlyCommon.getDescendantProp(_crashTimeline, _periodObj.previousPeriod);
            tmp_x = countlyCrashes.clearObject(tmp_x);
            tmp_y = countlyCrashes.clearObject(tmp_y);

            currentTotal = tmp_x["cr"];
            previousTotal = tmp_y["cr"];
            currentNonfatal = tmp_x["crnf"];
            previousNonfatal = tmp_y["crnf"];
            currentUnique = tmp_x["cru"];
            previousUnique = tmp_y["cru"];
            currentFatal = tmp_x["crf"];
            previousFatal = tmp_y["crf"];
            currentResolved = tmp_x["crru"];
            previousResolved = tmp_y["crru"];
        }

        var changeTotal = countlyCommon.getPercentChange(previousTotal, currentTotal),
            changeNonfatal = countlyCommon.getPercentChange(previousNonfatal, currentNonfatal),
            changeUnique = countlyCommon.getPercentChange(previousUnique, currentUnique),
            changeFatal = countlyCommon.getPercentChange(previousFatal, currentFatal);
            changeResolved = countlyCommon.getPercentChange(previousResolved, currentResolved);

        dataArr =
        {
            usage:{
                "total":{
                    "total":currentTotal,
                    "change":changeTotal.percent,
                    "trend":changeTotal.trend,
                    "isEstimate":false
                },
                "unique":{
                    "total":currentUnique,
                    "prev-total":previousUnique,
                    "change":changeUnique.percent,
                    "trend":changeUnique.trend,
                    "isEstimate":false
                },
                "nonfatal":{
                    "total":currentNonfatal,
                    "prev-total":previousNonfatal,
                    "change":changeNonfatal.percent,
                    "trend":changeNonfatal.trend,
                    "isEstimate":false
                },
                "fatal":{
                    "total":currentFatal,
                    "change":changeFatal.percent,
                    "trend":changeFatal.trend,
                    "isEstimate":false
                },
                "resolved":{
                    "total":currentResolved,
                    "change":changeResolved.percent,
                    "trend":changeResolved.trend,
                    "isEstimate":false
                }
            }
        };

        return dataArr;
    };
    
    countlyCrashes.clearObject = function (obj) {
        if (obj) {
            if (!obj["cr"]) obj["cr"] = 0;
            if (!obj["cru"]) obj["cru"] = 0;
            if (!obj["crnf"]) obj["crnf"] = 0;
            if (!obj["crf"]) obj["crf"] = 0;
            if (!obj["crru"]) obj["crru"] = 0;
        }
        else {
            obj = {"cr":0, "cru":0, "crnf":0, "crf":0, "crru":0};
        }

        return obj;
    };
	
	function setMeta() {
        if (_crashTimeline['meta']) {
			for(var i in _crashTimeline['meta']){
				_metas[i] = (_crashTimeline['meta'][i]) ? _crashTimeline['meta'][i] : [];
			}
        }
    }

    function extendMeta() {
        if (_crashTimeline['meta']) {
			for(var i in _crashTimeline['meta']){
				_metas[i] = countlyCommon.union(_metas[i] , _crashTimeline['meta'][i]);
			}
        }
    }
	
}(window.countlyCrashes = window.countlyCrashes || {}, jQuery));