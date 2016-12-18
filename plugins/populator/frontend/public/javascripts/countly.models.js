(function (countlyPopulator, $, undefined) {
	var props = {
		_os: ["Android", "iOS", "Windows Phone"],
        _os_web: ["Android", "iOS", "Windows Phone", "Windows", "OSX"],
		_os_version: ["2.2", "2.3", "3.1", "3.2", "4.0", "4.1", "4.2", "4.3", "4.4", "5.0", "5.1", "6.0", "6.1", "7.0", "7.1", "8.0", "8.1"],
		_resolution: ["320x480", "768x1024", "640x960", "1536x2048", "320x568", "640x1136", "480x800", "240x320", "540x960", "480x854", "240x400", "360x640", "800x1280", "600x1024", "600x800", "768x1366", "720x1280", "1080x1920"],
		_device: ["One Touch Idol X", "Kindle Fire HDX", "Fire Phone", "iPhone 5", "iPhone Mini", "iPhone 4S", "iPhone 5C", "iPad 4", "iPad Air","iPhone 6","Nexus 7","Nexus 10","Nexus 4","Nexus 5", "Windows Phone", "One S", "Optimus L5", "Lumia 920", "Galaxy Note", "Xperia Z"],
		_manufacture: ["Samsung", "Sony Ericsson", "LG", "Google", "HTC", "Nokia", "Apple", "Huaiwei", "Lenovo", "Acer"],
		_carrier: ["Telus", "Rogers Wireless", "T-Mobile", "Bell Canada", "	AT&T", "Verizon", "Vodafone", "Cricket Communications", "O2", "Tele2", "Turkcell", "Orange", "Sprint", "Metro PCS"],
		_app_version: ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2.0", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "2.9", "3.0", "3.1", "3.2"],
		_cpu: ["armv6", "armv7", "x86"],
		_opengl: ["opengl_es1", "opengl_es2"],
		_density: ["XHDPI", "MDPI", "HDPI", "XXHDPI", "TVDPI", "@1", "@2", "@3"],
		_locale: ["en_CA", "fr_FR", "de_DE", "it_IT", "ja_JP", "ko_KR", "en_US"],
        _browser: ["Opera", "Chrome", "Internet Explorer", "Safari", "Firefox"],
        _store: ["com.android.vending","com.google.android.feedback","com.google.vending","com.slideme.sam.manager","com.amazon.venezia","com.sec.android.app.samsungapps","com.nokia.payment.iapenabler","com.qihoo.appstore","cn.goapk.market","com.wandoujia.phoenix2","com.hiapk.marketpho","com.hiapk.marketpad","com.dragon.android.pandaspace","me.onemobile.android","com.aspire.mm","com.xiaomi.market","com.miui.supermarket","com.baidu.appsearch","com.tencent.android.qqdownloader","com.android.browser","com.bbk.appstore","cm.aptoide.pt","com.nduoa.nmarket","com.rim.marketintent","com.lenovo.leos.appstore","com.lenovo.leos.appstore.pad","com.keenhi.mid.kitservice","com.yingyonghui.market","com.moto.mobile.appstore","com.aliyun.wireless.vos.appstore","com.appslib.vending","com.mappn.gfan","com.diguayouxi","um.market.android","com.huawei.appmarket","com.oppo.market","com.taobao.appcenter"],
        _source: ["https://www.google.lv", "https://www.google.co.in/", "https://www.google.ru/", "http://stackoverflow.com/questions", "http://stackoverflow.com/unanswered", "http://stackoverflow.com/tags", "http://r.search.yahoo.com/"]
	};
	var eventsMap = {
		"Login": ["Lost", "Won","[CLY]_star_rating"],
		"Logout": [],
		"Lost": ["Won", "Achievement", "Lost"],
		"Won": ["Lost", "Achievement"],
		"Achievement": ["Sound", "Shared"],
		"Sound": ["Lost", "Won"],
		"Shared": ["Lost", "Won"],
		"[CLY]_star_rating":[]
	};
	var pushEvents = ["[CLY]_push_sent", "[CLY]_push_open", "[CLY]_push_action"];
	var segments  = {
		Login: {referer: ["twitter", "notification", "unknown"]},
		Buy: {screen: ["End Level", "Main screen", "Before End"]},
		Lost: {level: [1,2,3,4,5,6,7,8,9,10,11], mode:["arcade", "physics", "story"], difficulty:["easy", "medium", "hard"]},
		Won: {level: [1,2,3,4,5,6,7,8,9,10,11], mode:["arcade", "physics", "story"], difficulty:["easy", "medium", "hard"]},
		Achievement: {name:["Runner", "Jumper", "Shooter", "Berserker", "Tester"]},
		Sound: {state:["on", "off"]},
		"[CLY]_star_rating": {rating:[5,4,3,2,1],app_version:['1.2','1.3','2.0','3.0','3.5'],"platform":['iOS', 'Android']}
	};
	segments["[CLY]_push_open"]={i:"123456789012345678901234"};
	segments["[CLY]_push_action"]={i:"123456789012345678901234"};
	segments["[CLY]_push_sent"]={i:"123456789012345678901234"};
	segments["[CLY]_view"]={
        name:["Settings Page", "Purchase Page", "Credit Card Entry", "Profile page", "Start page", "Message page"],
        visit:[1],
        start:[0,1],
        exit:[0,1],
        bounce:[0,1]
    };
	var crashProps = ["root", "ram_current", "ram_total", "disk_current", "disk_total", "bat_current", "bat_total", "orientation", "stack", "log", "custom", "features", "settings", "comment", "os", "os_version", "manufacture", "device", "resolution", "app_version"];
    var ip_address = [];
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function capitaliseFirstLetter(string)
	{
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	function createRandomObj()
	{
        var ob = {
            "Facebook Login": (Math.random() > 0.5) ? true : false,
            "Twitter Login": (Math.random() > 0.5) ? true : false
        }

        if(ob["Twitter Login"])
            ob["Twitter Login name"] = chance.twitter();

        if((Math.random() > 0.5))
            ob["Has Apple Watch OS"] = (Math.random() > 0.5) ? true : false;
		return ob;
	}

	// helper functions

	function randomString(size)
	{
		var alphaChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var generatedString = '';
		for(var i = 0; i < size; i++) {
			generatedString += alphaChars[getRandomInt(0,alphaChars.length)];
		}

		return generatedString;
	}
    function getProp(name){
		return props[name][Math.floor(Math.random()*props[name].length)];
	}
	function user(id){
		this.getId = function() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			};
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		};

		this.getProp = getProp;

		var that = this;
        this.stats = {u:0,s:0,x:0,d:0,e:0,r:0,b:0,c:0,p:0};
		this.id = this.getId();
		this.isRegistered = false;
		this.iap = countlyGlobal["apps"][countlyCommon.ACTIVE_APP_ID].iap_event || "";
		if(this.iap != ""){
            eventsMap[this.iap] = segments.Buy;
		}

		this.hasSession = false;
        if(ip_address.length > 0 && Math.random() >= 0.5){
            this.ip = ip_address.pop();
        }
        else
            this.ip = chance.ip();
		this.userdetails = {name: chance.name(), username: chance.twitter().substring(1), email:chance.email(), organization:capitaliseFirstLetter(chance.word()), phone:chance.phone(), gender:chance.gender().charAt(0), byear:chance.birthday().getFullYear(), custom:createRandomObj()};
		this.metrics = {};
		this.startTs = startTs;
		this.endTs = endTs;
		this.events = [];
		this.ts = getRandomInt(this.startTs, this.endTs);
		for(var i in props){
			if(i == "_os" || i == "_os_web"){
                if(i == "_os_web" && countlyGlobal["apps"][countlyCommon.ACTIVE_APP_ID].type == "web"){
                    this.platform = this.getProp(i);
                    this.metrics["_os"] = this.platform;
                }
                else{
                    this.platform = this.getProp(i);
                    this.metrics[i] = this.platform;
                }
			}
			else if(i != "_store" && i != "_source")
				this.metrics[i] = this.getProp(i);
		}
        if(countlyGlobal["apps"][countlyCommon.ACTIVE_APP_ID].type == "web")
            this.metrics["_store"] = this.getProp("_source");
        else if(this.platform == "Android")
            this.metrics["_store"] = this.getProp("_store");

		this.getCrash = function(){
			var crash = {};

            crash._os = this.getProp("_os");
			crash._os_version = this.getProp("_os_version");
			crash._device = this.getProp("_device");
			crash._manufacture = this.getProp("_manufacture");
			crash._resolution = this.getProp("_resolution");
			crash._app_version = this.getProp("_app_version");
			crash._cpu = this.getProp("_cpu");
			crash._opengl = this.getProp("_opengl");

            crash._ram_total = getRandomInt(1, 4)*1024;
			crash._ram_current = getRandomInt(1, crash._ram_total);
			crash._disk_total = getRandomInt(1, 20)*1024;
			crash._disk_current = getRandomInt(1, crash._disk_total);
			crash._bat_total = 100;
			crash._bat_current = getRandomInt(1, crash._bat_total);
			crash._orientation = (Math.random() > 0.5) ? "landscape" : "portrait";

			crash._root = (Math.random() > 0.5) ? true : false;
			crash._online = (Math.random() > 0.5) ? true : false;
			crash._signal = (Math.random() > 0.5) ? true : false;
			crash._muted = (Math.random() > 0.5) ? true : false;
			crash._background = (Math.random() > 0.5) ? true : false;

			crash._error = this.getError();
			crash._logs = this.getLog();
            crash._nonfatal = (Math.random() > 0.5) ? true : false;
            crash._run = getRandomInt(1, 1800);

            var customs = ["facebook", "gideros", "admob", "chartboost", "googleplay"];
            crash._custom = {};
            for(var i = 0; i < customs.length; i++){
                if(Math.random() > 0.5){
                    crash._custom[customs[i]] = getRandomInt(1, 2)+"."+getRandomInt(0, 9);
                }
            }

			return crash;
		};

		this.getError = function(){
			var errors = ["java.lang.RuntimeException", "java.lang.NullPointerException", "java.lang.NoSuchMethodError", "java.lang.NoClassDefFoundError", "java.lang.ExceptionInInitializerError", "java.lang.IllegalStateException"];
			var error = errors[Math.floor(Math.random()*errors.length)]+": com.domain.app.Exception<init>\n";
			var stacks = getRandomInt(5, 9);
			for(var i = 0; i < stacks; i++){
				error += "at com.domain.app.<init>(Activity.java:"+(i*32)+")\n";
			}
			return error;
		};

        this.getLog = function(){
            var actions = [
                "clicked button 1",
                "clicked button 2",
                "clicked button 3",
                "clicked button 4",
                "clicked button 5",
                "rotated phone",
                "clicked back",
                "entered screen",
                "left screen",
                "touched screen",
                "taped screen",
                "long touched screen",
                "swipe left detected",
                "swipe right detected",
                "swipe up detected",
                "swipe down detected",
                "gesture detected",
                "shake detected"
            ];

            var items = getRandomInt(5, 10);
            var logs = [];
            for(var i = 0; i < items; i++){
                logs.push(actions[getRandomInt(0, actions.length-1)]);
            }
            return logs.join("\n");
        };

		this.getEvent = function(id){
            this.stats.e++;
			if (!id) {
				if (this.previousEventId) {
					id = eventsMap[this.previousEventId][Math.floor(Math.random()*eventsMap[this.previousEventId].length)];
				} else {
					id = 'Login';
				}
			}

			if (id in eventsMap) {
            	this.previousEventId = id;
			}

			var event = {
				"key": id,
				"count": 1,
                "timestamp": this.ts,
                "hour": getRandomInt(0, 23),
                "dow": getRandomInt(0, 6)
			};
			this.ts += 1000;
			if(id == this.iap){
				this.stats.b++;
				event.sum = getRandomInt(100, 500)/100;
				var segment;
				event.segmentation = {};
				for(var i in segments["Buy"]){
					segment = segments["Buy"][i];
					event.segmentation[i] = segment[Math.floor(Math.random()*segment.length)];
				}
			}
			else if(segments[id]){
				var segment;
				event.segmentation = {};
				for(var i in segments[id]){
					segment = segments[id][i];
					event.segmentation[i] = segment[Math.floor(Math.random()*segment.length)];
				}
			}
            if(id == "[CLY]_view")
                event.dur = getRandomInt(0, 100);
            else
                event.dur = getRandomInt(0, 10);

			return [event];
		};

        this.getEvents = function(count){
            var events = [];
            for(var i = 0; i < count; i++){
                events.push(this.getEvent()[0]);
            }
            return events;
        };

		this.getPushEvents = function(){
			var events = this.getPushEvent('[CLY]_push_sent');
            if(Math.random() >= 0.5){
                events = events.concat(this.getPushEvent('[CLY]_push_open'));
                if (Math.random() >= 0.8) {
                    events = events.concat(this.getPushEvent('[CLY]_push_action'));
                }
            }
            return events;
		};
		this.getPushEvent = function(id){
            this.stats.e++;
			var event = {
				"key": id,
				"count": 1,
                "timestamp": this.ts,
                "hour": getRandomInt(0, 23),
                "dow": getRandomInt(0, 6),
                "test": 1 // Events starting with [CLY]_ are ignored by the API (internal events). This flag is to bypass that.
			};
			this.ts += 1000;
			if(segments[id]){
				var segment;
				event.segmentation = {};
				for(var i in segments[id]){
					segment = segments[id][i];
					event.segmentation[i] = segment[Math.floor(Math.random()*segment.length)];
				}
			}
			return [event];
		};

		this.startSession = function(){
			this.ts = this.ts+60*60*24+100;
			this.stats.s++;
            var req = {};
			if(!this.isRegistered){
				this.isRegistered = true;
				this.stats.u++;
                var events = this.getEvent("Login").concat(this.getEvent("[CLY]_view")).concat(this.getEvents(4));
				req = {timestamp:this.ts, begin_session:1, metrics:this.metrics, user_details:this.userdetails, events:events};
				if(Math.random() > 0.5){
					this.hasPush = true;
					this.stats.p++;
                    req["token_session"] = 1;
                    req["test_mode"] = 0;
                    req.events = req.events.concat(this.getPushEvents());
					req[this.platform.toLowerCase()+"_token"] = randomString(8);
				}
			}
			else{
                var events = this.getEvent("Login").concat(this.getEvent("[CLY]_view")).concat(this.getEvents(4));
				req = {timestamp:this.ts, begin_session:1, events:events};
			}
            if(this.iap != "" && Math.random() > 0.5){
                req.events = req.events.concat(this.getEvent(this.iap));
            }
            if(Math.random() > 0.5){
                this.stats.c++;
				req["crash"] = this.getCrash();
			}
			this.hasSession = true;
            this.request(req);
			this.timer = setTimeout(function(){that.extendSession()}, timeout);
		};

		this.extendSession = function(){
			if(this.hasSession){
                var req = {};
				this.ts = this.ts + 30;
				this.stats.x++;
				this.stats.d += 30;
                var events = this.getEvent("[CLY]_view").concat(this.getEvents(2));
                req = {timestamp:this.ts, session_duration:30, events:events};
				if(Math.random() > 0.8){
					this.timer = setTimeout(function(){that.extendSession()}, timeout);
				}
				else{
					if(Math.random() > 0.5){
                        this.stats.c++;
						req["crash"] = this.getCrash();
					}
					this.timer = setTimeout(function(){that.endSession()}, timeout);
				}
                this.request(req);
			}
		}

		this.endSession = function(){
			if(this.timer){
				clearTimeout(this.timer)
				this.timer = null;
			}
			if(this.hasSession){
				this.hasSession = false;
                var events = this.getEvents(2).concat(this.getEvent("Logout"));
				this.request({timestamp:this.ts, end_session:1, events:events});
			}
		};

		this.request = function(params){
			this.stats.r++;
			params.device_id = this.id;
			params.ip_address = this.ip;
            params.hour = getRandomInt(0, 23);
            params.dow = getRandomInt(0, 6);
            params.stats = JSON.parse(JSON.stringify(this.stats));
			bulk.push(params);
            this.stats = {u:0,s:0,x:0,d:0,e:0,r:0,b:0,c:0,p:0};
			countlyPopulator.sync();
		};
	}

	var bulk = [];
	var startTs = 1356998400;
	var endTs = new Date().getTime()/1000;
	var timeout = 1000;
	var bucket = 50;
	var generating = false;
	var stopCallback = null;
	var users = [];
	var userAmount = 1000;
	var queued = 0;
	var totalStats = {u:0,s:0,x:0,d:0,e:0,r:0,b:0,c:0,p:0};

	function updateUI(stats){
		for(var i in stats){
			totalStats[i] += stats[i];
			$("#populate-stats-"+i).text(totalStats[i]);
		}
	}

    function createCampaign(id, name, cost, type, callback){
        $.ajax({
			type:"GET",
			url:countlyCommon.API_URL + "/i/campaign/create",
			data:{
				api_key:countlyGlobal["member"].api_key,
				args:JSON.stringify({
                    "_id":id+countlyCommon.ACTIVE_APP_ID,
                    "name":name,
                    "link":"http://count.ly",
                    "cost":cost,
                    "costtype":type,
                    "fingerprint":false,
                    "links":{},
                    "postbacks":[],
                    "app_id":countlyCommon.ACTIVE_APP_ID})
			},
			success:callback,
            error:callback
		});
    }

    function clickCampaign(name){
        var ip = chance.ip();
        if(ip_address.length && Math.random() > 0.5){
            ip = ip_address[Math.floor(Math.random()*ip_address.length)];
        }
        else{
            ip_address.push(ip);
        }
        $.ajax({
			type:"GET",
			url:countlyCommon.API_URL + "/i/campaign/click/"+name+countlyCommon.ACTIVE_APP_ID,
            data:{ip_address:ip, test:true, timestamp:getRandomInt(startTs, endTs)}
		});
    }

    function genereateCampaigns(callback){
        if(typeof countlyAttribution === "undefined"){
            callback();
            return;
        }
        var campaigns = ["social", "ads", "landing"];
        createCampaign("social", "Social Campaign", "0.5", "click", function(){
            createCampaign("ads", "Ads Campaign", "1", "install", function(){
                createCampaign("landing", "Landing page", "30", "campaign", function(){
                    for(var i = 0; i < 100; i++){
                        setTimeout(function(){
                            clickCampaign(campaigns[getRandomInt(0, campaigns.length-1)]);
                        },1);
                    }
                    setTimeout(callback, 3000);
                });
            });
        });
    }

    function generateRetentionUser(ts, users, ids, callback){
        var bulk = [];
        for(var i = 0; i < users; i++){
            for(var j = 0; j < ids.length; j++){
                var metrics = {};
                for(var i in props){
                    if(i == "_os" || i == "_os_web"){
                        if(i == "_os_web" && countlyGlobal["apps"][countlyCommon.ACTIVE_APP_ID].type == "web"){
                            metrics["_os"] = getProp(i);
                        }
                        else{
                            metrics[i] = getProp(i);
                        }
                    }
                    else if(i != "_store" && i != "_source")
                        metrics[i] = getProp(i);
                }
                if(countlyGlobal["apps"][countlyCommon.ACTIVE_APP_ID].type == "web")
                    metrics["_store"] = getProp("_source");
                else if(this.platform == "Android")
                    metrics["_store"] = getProp("_store");

                var userdetails = {name: chance.name(), username: chance.twitter().substring(1), email:chance.email(), organization:capitaliseFirstLetter(chance.word()), phone:chance.phone(), gender:chance.gender().charAt(0), byear:chance.birthday().getFullYear(), custom:createRandomObj()};

                bulk.push({ip_address:chance.ip(), device_id:i+""+ids[j], begin_session:1, metrics:metrics, user_details:userdetails, timestamp:ts, hour:getRandomInt(0, 23), dow:getRandomInt(0, 6)});
                totalStats.s++;
                totalStats.u++;
            }
        }
        totalStats.r++;
        $.ajax({
            type:"GET",
            url:countlyCommon.API_URL + "/i/bulk",
            data:{
				app_key:countlyCommon.ACTIVE_APP_KEY,
				requests:JSON.stringify(bulk)
			},
            success:callback,
            error:callback
        });
    }

    function generateRetention(callback){
        if(typeof countlyRetention === "undefined"){
            callback();
            return;
        }
        var ts = endTs - 60*60*24*9;
        var ids = [ts];
        var users = 10;
        generateRetentionUser(ts, users--, ids, function(){
            ts += 60*60*24;
            ids.push(ts);
            generateRetentionUser(ts, users--, ids, function(){
                ts += 60*60*24;
                ids.push(ts);
                generateRetentionUser(ts, users--, ids, function(){
                    ts += 60*60*24;
                    ids.push(ts);
                    generateRetentionUser(ts, users--, ids, function(){
                        ts += 60*60*24;
                        ids.push(ts);
                        generateRetentionUser(ts, users--, ids, function(){
                            ts += 60*60*24;
                            ids.push(ts);
                            generateRetentionUser(ts, users--, ids, function(){
                                ts += 60*60*24;
                                ids.push(ts);
                                generateRetentionUser(ts, users--, ids, function(){
                                    ts += 60*60*24;
                                    ids.push(ts);
                                    generateRetentionUser(ts, users--, ids, callback);
                                });
                            });
                        });
                    });
                });
            });
        });
    }

	//Public Methods
	countlyPopulator.setStartTime = function(time){
		startTs = time;
	};
	countlyPopulator.getStartTime = function(time){
		return startTs;
	};
	countlyPopulator.setEndTime = function(time){
		endTs = time;
	};
	countlyPopulator.getEndTime = function(time){
		return endTs;
	};
	countlyPopulator.getUserAmount = function(time){
		return userAmount;
	};
	countlyPopulator.generateUI = function(time){
		for(var i in totalStats){
			$("#populate-stats-"+i).text(totalStats[i]);
		}
	};
	countlyPopulator.generateUsers = function (amount) {
		stopCallback = null;
		userAmount = amount;
		bulk = [];
		totalStats = {u:0,s:0,x:0,d:0,e:0,r:0,b:0,c:0,p:0};
		bucket = Math.max(amount/50, 10);
		var mult = (Math.round(queued/10)+1);
		timeout = bucket*10*mult*mult;
		generating = true;
		function createUser(){
			var u = new user();
			users.push(u);
			u.timer = setTimeout(function(){
				u.startSession();
			},Math.random()*timeout);
		}
		function processUser(u){
			if(u && !u.hasSession){
				u.timer = setTimeout(function(){
					u.startSession();
				},Math.random()*timeout);
			}
		}
		function processUsers(){
			for(var i = 0; i < amount; i++){
				processUser(users[i]);
			}
			if(users.length > 0 && generating)
				setTimeout(processUsers, timeout);
			else
				countlyPopulator.sync(true);
		}
        generateRetention(function(){
            genereateCampaigns(function(){
                for(var i = 0; i < amount; i++){
                    createUser();
                }
                setTimeout(processUsers, timeout);
            });
        });
                    // for(var i = 0; i < amount; i++){
                    //     createUser();
                    // }
	};

	countlyPopulator.stopGenerating = function (clb) {
		generating = false;
		stopCallback = clb;
		var u;
		for(var i = 0; i < users.length; i++){
			u = users[i];
			if(u)
				u.endSession();
		}
		users = [];

		if (!countlyPopulator.bulking && stopCallback) {
			countlyPopulator.ensureJobs();
		}
	};

	countlyPopulator.isGenerating = function(){
		return generating;
	}

    countlyPopulator.sync = function (force) {
		if(generating && (force || bulk.length > bucket) && !countlyPopulator.bulking){
			queued++;
			var mult = Math.round(queued/10)+1;
			timeout = bucket*10*mult*mult;
			$("#populate-stats-br").text(queued);
			countlyPopulator.bulking = true;
            var req = bulk.splice(0, bucket);
            var temp = {u:0,s:0,x:0,d:0,e:0,r:0,b:0,c:0,p:0};
            for(var i in req){
                if(req[i].stats){
                    for(var stat in req[i].stats){
                        temp[stat] += req[i].stats[stat];
                    }
                    delete req[i].stats;
                }
            }
			$.ajax({
				type:"POST",
				url:countlyCommon.API_URL + "/i/bulk",
				data:{
					app_key:countlyCommon.ACTIVE_APP_KEY,
					requests:JSON.stringify(req)
				},
				success:function (json) {
					queued--;
					$("#populate-stats-br").text(queued);
					updateUI(temp);
					countlyPopulator.bulking = false;
					countlyPopulator.sync();
					if (!generating && stopCallback) {
						countlyPopulator.ensureJobs();
					}
				},
				error:function(){
					queued--;
					$("#populate-stats-br").text(queued);
					countlyPopulator.bulking = false;
					countlyPopulator.sync();
					if (!generating && stopCallback) {
						countlyPopulator.ensureJobs();
					}
				}
			});
		}
    };

    var ensuringJobs = false;
    countlyPopulator.ensureJobs = function() {
        if(typeof countlyFlow === "undefined"){
            if (stopCallback) { stopCallback(true); }
            return;
        }
    	if (ensuringJobs) { return; }
    	ensuringJobs = true;

    	$.ajax({
    		type: "GET",
    		url: countlyCommon.API_URL + "/i/flows/lastJob",
    		data: {
    			app_key:countlyCommon.ACTIVE_APP_KEY
    		},
			success:function (json) {
    			if (json && json.job) {
    				function checkAgain() {
    					$.ajax({
    						type: "GET",
    						url: countlyCommon.API_URL + "/i/flows/lastJob",
    						data: {
    							job: json.job,
    							app_key:countlyCommon.ACTIVE_APP_KEY
    						},
    						success: function (obj) {
    							if (obj && obj.done) {
    								ensuringJobs = false;
    								if (stopCallback) { stopCallback(true); }
    							} else {
    								if (stopCallback) { stopCallback(false); }
    								setTimeout(checkAgain, 3000);
    							}
    						},
    						error: function(xhr, e, t){
								ensuringJobs = false;
								if (stopCallback) { stopCallback(t); }
    						}
    					});
    				}
    				checkAgain();
    			} else if (json && json.done) {
					if (stopCallback) { stopCallback(true); }
    			} else {
					ensuringJobs = false;
					if (stopCallback) { stopCallback(json); }
    			}
    		},
    		error:function(xhr, e, t){
				ensuringJobs = false;
				if (xhr.responseText && xhr.responseText.indexOf('Invalid path') !== -1) {
	    			if (stopCallback) { stopCallback(true); }
				} else {
	    			if (stopCallback) { stopCallback(t); }
				}
    		}
    	});

    };
}(window.countlyPopulator = window.countlyPopulator || {}, jQuery));