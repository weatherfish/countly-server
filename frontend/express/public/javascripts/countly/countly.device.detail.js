(function (countlyDeviceDetails, $, undefined) {

    //Private Properties
    var _periodObj = {},
        _deviceDetailsDb = {},
        _os = [],
        _resolutions = [],
        _os_versions = [],
        _activeAppKey = 0,
        _initialized = false,
        _period = null;
        
    countlyDeviceDetails.os_mapping = {
        "unknown":{short: "unk", name: "Unknown"},
        "undefined":{short: "unk", name: "Unknown"},
        "tvos":{short: "atv", name: "Apple TV"},
        "watchos":{short: "wos", name: "Apple Watch"},
        "unity editor":{short: "uty", name: "Unknown"},
        "qnx":{short: "qnx", name: "QNX"},
        "os/2":{short: "os2", name: "OS/2"},
        "windows":{short: "mw", name: "Windows"},
        "open bsd":{short: "ob", name: "Open BSD"},
        "searchbot":{short: "sb", name: "SearchBot"},
        "sun os":{short: "so", name: "Sun OS"},
        "beos":{short: "bo", name: "BeOS"},
        "mac osx":{short: "o", name: "Mac"},
        "macos":{short: "o", name: "Mac"},
        "mac":{short: "o", name: "Mac"},
        "osx":{short: "o", name: "Mac"},
        "linux":{short: "l", name: "Linux"},
        "unix":{short: "u", name: "UNIX"},
        "ios":{short: "i", name: "iOS"},
        "android":{short: "a", name: "Android"},
        "blackberry":{short: "b", name: "BlackBerry"},
        "windows phone":{short: "w", name: "Windows Phone"},
        "wp":{short: "w", name: "Windows Phone"},
        "roku":{short: "r", name: "Roku"},
        "symbian":{short: "s", name: "Symbian"},
        "chrome":{short: "c", name: "Chrome OS"},
        "debian":{short: "d", name: "Debian"},
        "nokia":{short: "n", name: "Nokia"},
        "firefox":{short: "f", name: "Firefox OS"},
        "tizen":{short: "t", name: "Tizen"}
    };

    //Public Methods
    countlyDeviceDetails.initialize = function () {
        if (_initialized && _period == countlyCommon.getPeriodForAjax() && _activeAppKey == countlyCommon.ACTIVE_APP_KEY) {
            return countlyDeviceDetails.refresh();
        }

        _period = countlyCommon.getPeriodForAjax();

        if (!countlyCommon.DEBUG) {
            _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
            _initialized = true;

            return $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.r,
                data:{
                    "api_key":countlyGlobal.member.api_key,
                    "app_id":countlyCommon.ACTIVE_APP_ID,
                    "method":"device_details",
                    "period":_period
                },
                dataType:"jsonp",
                success:function (json) {
                    _deviceDetailsDb = json;
                    setMeta();

                    countlyAppVersion.initialize();
                }
            });
        } else {
            _deviceDetailsDb = {"2012":{}};
            return true;
        }
    };

    countlyDeviceDetails.refresh = function () {
        _periodObj = countlyCommon.periodObj;

        if (!countlyCommon.DEBUG) {

            if (_activeAppKey != countlyCommon.ACTIVE_APP_KEY) {
                _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
                return countlyDeviceDetails.initialize();
            }

            return $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.r,
                data:{
                    "api_key":countlyGlobal.member.api_key,
                    "app_id":countlyCommon.ACTIVE_APP_ID,
                    "method":"device_details",
                    "action":"refresh"
                },
                dataType:"jsonp",
                success:function (json) {
                    countlyCommon.extendDbObj(_deviceDetailsDb, json);
                    extendMeta();

                    countlyAppVersion.refresh(json);
                }
            });
        } else {
            _deviceDetailsDb = {"2012":{}};
            return true;
        }
    };

    countlyDeviceDetails.reset = function () {
        _deviceDetailsDb = {};
        setMeta();
    };

    countlyDeviceDetails.clearDeviceDetailsObject = function (obj) {
        if (obj) {
            if (!obj["t"]) obj["t"] = 0;
            if (!obj["n"]) obj["n"] = 0;
            if (!obj["u"]) obj["u"] = 0;
        }
        else {
            obj = {"t":0, "n":0, "u":0};
        }

        return obj;
    };

    countlyDeviceDetails.getPlatforms = function () {
        return _os;
    };

    countlyDeviceDetails.getPlatformBars = function () {
        return countlyCommon.extractBarData(_deviceDetailsDb, _os, countlyDeviceDetails.clearDeviceDetailsObject);
    };

    countlyDeviceDetails.getPlatformData = function () {

        var chartData = countlyCommon.extractTwoLevelData(_deviceDetailsDb, _os, countlyDeviceDetails.clearDeviceDetailsObject, [
            {
                name:"os_",
                func:function (rangeArr, dataObj) {
                    if(countlyDeviceDetails.os_mapping[rangeArr.toLowerCase()])
                        return countlyDeviceDetails.os_mapping[rangeArr.toLowerCase()].name;
                    return rangeArr;
                }
            },
            {
                name:"origos_",
                func:function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ], "platforms");
        chartData.chartData = countlyCommon.mergeMetricsByName(chartData.chartData, "os_");
        var platformNames = _.pluck(chartData.chartData, 'os_'),
            platformTotal = _.pluck(chartData.chartData, 'u'),
            chartData2 = [];

        var sum = _.reduce(platformTotal, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < platformNames.length; i++) {
            var percent = (platformTotal[i] / sum) * 100;
            chartData2[i] = {data:[
                [0, platformTotal[i]]
            ], label:platformNames[i]};
        }

        chartData.chartDP = {};
        chartData.chartDP.dp = chartData2;

        return chartData;
    };

    countlyDeviceDetails.getResolutionBars = function () {
        return countlyCommon.extractBarData(_deviceDetailsDb, _resolutions, countlyDeviceDetails.clearDeviceDetailsObject);
    };

    countlyDeviceDetails.getResolutionData = function () {
        var chartData = countlyCommon.extractTwoLevelData(_deviceDetailsDb, _resolutions, countlyDeviceDetails.clearDeviceDetailsObject, [
            {
                name:"resolution",
                func:function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            {
                name:"width",
                func:function (rangeArr, dataObj) {
                    return "<a>" + rangeArr.split("x")[0] + "</a>";
                }
            },
            {
                name:"height",
                func:function (rangeArr, dataObj) {
                    return "<a>" + rangeArr.split("x")[1] + "</a>";
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ], "resolutions");

        var resolutions = _.pluck(chartData.chartData, 'resolution'),
            resolutionTotal = _.pluck(chartData.chartData, 'u'),
            resolutionNew = _.pluck(chartData.chartData, 'n'),
            chartData2 = [],
            chartData3 = [];

        var sum = _.reduce(resolutionTotal, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < resolutions.length; i++) {
            var percent = (resolutionTotal[i] / sum) * 100;
            chartData2[i] = {data:[
                [0, resolutionTotal[i]]
            ], label:resolutions[i]};
        }

        var sum2 = _.reduce(resolutionNew, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < resolutions.length; i++) {
            var percent = (resolutionNew[i] / sum) * 100;
            chartData3[i] = {data:[
                [0, resolutionNew[i]]
            ], label:resolutions[i]};
        }

        chartData.chartDPTotal = {};
        chartData.chartDPTotal.dp = chartData2;

        chartData.chartDPNew = {};
        chartData.chartDPNew.dp = chartData3;

        return chartData;
    };

    countlyDeviceDetails.getOSVersionBars = function () {
        var osVersions = countlyCommon.extractBarData(_deviceDetailsDb, _os_versions, countlyDeviceDetails.clearDeviceDetailsObject);

        for (var i = 0; i < osVersions.length; i++) {
            osVersions[i].name = countlyDeviceDetails.fixOSVersion(osVersions[i].name);
        }

        return osVersions;
    };

    countlyDeviceDetails.getOSVersionData = function (os) {
        var oSVersionData = countlyCommon.extractTwoLevelData(_deviceDetailsDb, _os_versions, countlyDeviceDetails.clearDeviceDetailsObject, [
            {
                name:"os_version",
                func:function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ], "platform_versions");

        var osSegmentation = ((os) ? os : ((_os) ? _os[0] : null)),
            platformVersionTotal = _.pluck(oSVersionData.chartData, 'u'),
            chartData2 = [];
        var osName = osSegmentation;
        if(osSegmentation){
            if(countlyDeviceDetails.os_mapping[osSegmentation.toLowerCase()])
                osName = countlyDeviceDetails.os_mapping[osSegmentation.toLowerCase()].short;
            else
                osName = osSegmentation.toLowerCase()[0];
        }

        if (oSVersionData.chartData) {
            for (var i = 0; i < oSVersionData.chartData.length; i++) {
                if (!new RegExp("^"+osName+"([0-9]+|unknown)").test(oSVersionData.chartData[i].os_version)) {
                    delete oSVersionData.chartData[i];
                }
                else{
                    oSVersionData.chartData[i].os_version = countlyDeviceDetails.fixOSVersion(oSVersionData.chartData[i].os_version);
                }
            }
        }

        oSVersionData.chartData = _.compact(oSVersionData.chartData);

        var platformVersionNames = _.pluck(oSVersionData.chartData, 'os_version'),
            platformNames = [];

        var sum = _.reduce(platformVersionTotal, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < platformVersionNames.length; i++) {
            var percent = (platformVersionTotal[i] / sum) * 100;

            chartData2[chartData2.length] = {data:[
                [0, platformVersionTotal[i]]
            ], label:platformVersionNames[i].replace(((countlyDeviceDetails.os_mapping[osSegmentation.toLowerCase()]) ? countlyDeviceDetails.os_mapping[osSegmentation.toLowerCase()].name : osSegmentation) + " ", "")};
        }

        oSVersionData.chartDP = {};
        oSVersionData.chartDP.dp = chartData2;
        oSVersionData.os = [];

        if (_os && _os.length > 1) {
            for (var i = 0; i < _os.length; i++) {
                //if (_os[i] != osSegmentation) {
                //    continue;
                //}

                oSVersionData.os.push({
                    "name":_os[i],
                    "class":_os[i].toLowerCase()
                });
            }
        }

        return oSVersionData;
    };

    countlyDeviceDetails.fixOSVersion = function(osName) {
        osName = (osName+"").replace(/:/g, ".");
        
        for(var i in countlyDeviceDetails.os_mapping){
            osName = osName.replace(new RegExp("^"+countlyDeviceDetails.os_mapping[i].short,"g"), countlyDeviceDetails.os_mapping[i].name+" ");
        }
        return osName;
    };

    countlyDeviceDetails.getDbObj = function() {
        return _deviceDetailsDb;
    };

    function setMeta() {
        if (_deviceDetailsDb['meta']) {
            _os = (_deviceDetailsDb['meta']['os']) ? _deviceDetailsDb['meta']['os'] : [];
            _resolutions = (_deviceDetailsDb['meta']['resolutions']) ? _deviceDetailsDb['meta']['resolutions'] : [];
            _os_versions = (_deviceDetailsDb['meta']['os_versions']) ? _deviceDetailsDb['meta']['os_versions'] : [];
        } else {
            _os = [];
            _resolutions = [];
            _os_versions = [];
        }

        if (_os_versions.length) {
            _os_versions = _os_versions.join(",").replace(/\./g, ":").split(",");
        }
    }

    function extendMeta() {
        if (_deviceDetailsDb['meta']) {
            _os = countlyCommon.union(_os, _deviceDetailsDb['meta']['os']);
            _resolutions = countlyCommon.union(_resolutions, _deviceDetailsDb['meta']['resolutions']);
            _os_versions = countlyCommon.union(_os_versions, _deviceDetailsDb['meta']['os_versions']);
        }

        if (_os_versions.length) {
            _os_versions = _os_versions.join(",").replace(/\./g, ":").split(",");
        }
    }

}(window.countlyDeviceDetails = window.countlyDeviceDetails || {}, jQuery));
