/** @jsx React.DOM */

/*
 A countly view is defined as a page corresponding to a url fragment such
 as #/manage/apps. This interface defines common functions or properties
 the view object has. A view may override any function or property.

 */

var initializeOnce = _.once(function() {
    return $.when(countlyEvent.initialize()).then(function() {});
});

var Template = function () {
    this.cached = {};
};
var T = new Template();

$.extend(Template.prototype, {
    render:function (name, callback) {
        if (T.isCached(name)) {
            callback(T.cached[name]);
        } else {
            $.get(T.urlFor(name), function (raw) {
                T.store(name, raw);
                T.render(name, callback);
            });
        }
    },
    renderSync:function (name, callback) {
        if (!T.isCached(name)) {
            T.fetch(name);
        }
        T.render(name, callback);
    },
    prefetch:function (name) {
        $.get(T.urlFor(name), function (raw) {
            T.store(name, raw);
        });
    },
    fetch:function (name) {
        // synchronous, for those times when you need it.
        if (!T.isCached(name)) {
            var raw = $.ajax({'url':T.urlFor(name), 'async':false}).responseText;
            T.store(name, raw);
        }
    },
    isCached:function (name) {
        return !!T.cached[name];
    },
    store:function (name, raw) {
        T.cached[name] = Handlebars.compile(raw);
    },
    urlFor:function (name) {
        //return "/resources/templates/"+ name + ".handlebars";
        return name + ".html";
    }
});

/*
 Some helper functions to be used throughout all views. Includes custom
 popup, alert and confirm dialogs for the time being.
 */
(function (CountlyHelpers, $, undefined) {

    CountlyHelpers.parseAndShowMsg = function (msg) {
        if (!msg || !msg.length) {
            return true;
        }

        if (_.isArray(msg)) {
            msg = msg[0];
        }

        var type = "info",
            message = "",
            msgArr = msg.split("|");

        if (msgArr.length > 1) {
            type = msgArr[0];
            message = msgArr[1];
        } else {
            message = msg;
        }

        CountlyHelpers.notify({type:type, message:message});

        delete countlyGlobal["message"];
    };

	CountlyHelpers.notify = function (msg) {
		$.titleAlert((msg.title || msg.message || msg.info || "Notification"), {
			requireBlur:true,
			stopOnFocus:true,
			duration:(msg.delay || 10000),
			interval:1000
		});
		$.amaran({
			content:{
				title: msg.title || "Notification",
				message:msg.message || "",
				info:msg.info || "",
				icon:msg.icon || 'fa fa-info'
			},
			theme:'awesome '+ (msg.type || "ok"),
			position: msg.position || 'top right',
			delay: msg.delay || 10000,
			sticky: msg.sticky || false,
			clearAll: msg.clearAll || false,
			closeButton:true,
			closeOnClick:(msg.closeOnClick === false) ? false : true,
			onClick: msg.onClick || null
		});
	};

    CountlyHelpers.popup = function (element, custClass, isHTML) {
        var dialog = $("#cly-popup").clone();
        dialog.removeAttr("id");
        if (custClass) {
            dialog.addClass(custClass);
        }

        if (isHTML) {
            dialog.find(".content").html(element);
        } else {
            dialog.find(".content").html($(element).html());
        }

        revealDialog(dialog);
    };

    CountlyHelpers.openResource = function(url) {
        var dialog = $("#cly-resource").clone();
        dialog.removeAttr("id");
        dialog.find(".content").html("<iframe style='border-radius:5px; border:none; width:800px; height:600px;' src='" + url + "'></iframe>");

        revealDialog(dialog);
    };

    CountlyHelpers.alert = function (msg, type) {
        var dialog = $("#cly-alert").clone();
        dialog.removeAttr("id");
        dialog.find(".message").html(msg);

        dialog.addClass(type);
        revealDialog(dialog);
    };

    CountlyHelpers.confirm = function (msg, type, callback, buttonText) {
        var dialog = $("#cly-confirm").clone();
        dialog.removeAttr("id");
        dialog.find(".message").html(msg);

        if (buttonText && buttonText.length == 2) {
            dialog.find("#dialog-cancel").text(buttonText[0]);
            dialog.find("#dialog-continue").text(buttonText[1]);
        }

        dialog.addClass(type);
        revealDialog(dialog);

        dialog.find("#dialog-cancel").on('click', function () {
            callback(false);
        });

        dialog.find("#dialog-continue").on('click', function () {
            callback(true);
        });
    };

	CountlyHelpers.loading = function (msg) {
        var dialog = $("#cly-loading").clone();
        dialog.removeAttr("id");
        dialog.find(".message").html(msg);
        dialog.addClass('cly-loading');
        revealDialog(dialog);
        return dialog;
    };

    CountlyHelpers.setUpDateSelectors = function(self) {

        $(event_emitter).on('date_choise', function(e, period){

            self.dateChanged(period.period);

        }.bind(self));

        $("#month").text(moment().year());
        $("#day").text(moment().format("MMM"));
        $("#yesterday").text(moment().subtract("days",1).format("Do"));

        $("#date-selector").find(">.button").click(function () {
            if ($(this).hasClass("selected")) {
                return true;
            }

            self.dateFromSelected = null;
            self.dateToSelected = null;

            $(".date-selector").removeClass("selected").removeClass("active");
            $(this).addClass("selected");
            var selectedPeriod = $(this).attr("id");

            if (countlyCommon.getPeriod() == selectedPeriod) {
                return true;
            }

            countlyCommon.setPeriod(selectedPeriod);

            self.dateChanged(selectedPeriod);

            $("#" + selectedPeriod).addClass("active");
        });

        $("#date-selector").find(">.button").each(function(){
            if (countlyCommon.getPeriod() == $(this).attr("id")) {
                $(this).addClass("active").addClass("selected");
            }
        });
    };

    CountlyHelpers.initializeSelect = function (element) {
        element = element || $("#content-container");
        element.off("click", ".cly-select").on("click", ".cly-select", function (e) {
            if ($(this).hasClass("disabled")) {
                return true;
            }

            $(this).removeClass("req");

            var selectItems = $(this).find(".select-items"),
                itemCount = selectItems.find(".item").length;

            if (!selectItems.length) {
                return false;
            }

            $(".cly-select").find(".search").remove();

            if (selectItems.is(":visible")) {
                $(this).removeClass("active");
            } else {
                $(".cly-select").removeClass("active");
                $(".select-items").hide();
                $(this).addClass("active");

                if (itemCount > 10 && !$(this).hasClass("centered")) {
                    $("<div class='search'><div class='inner'><input type='text' /><i class= fa fa-search'></i></div></div>").insertBefore($(this).find(".select-items"));
                }
            }

            if ($(this).hasClass("centered")) {
                var height = $(this).find(".select-items").height();
                $(this).find(".select-items").css("margin-top", (-(height/2).toFixed(0) - ($(this).height()/2).toFixed(0)) + "px");
            }

            if ($(this).find(".select-items").is(":visible")) {
                $(this).find(".select-items").hide();
            } else {
                $(this).find(".select-items").show();
                $(this).find(".select-items>div").addClass("scroll-list");
                $(this).find(".scroll-list").slimScroll({
                    height:'100%',
                    start:'top',
                    wheelStep:10,
                    position:'right',
                    disableFadeOut:true
                });
            }

            $(this).find(".search input").focus();

            $("#date-picker").hide();
            e.stopPropagation();
        });

        element.off("click", ".select-items .item").on("click", ".select-items .item", function () {
            var selectedItem = $(this).parents(".cly-select").find(".text");
            selectedItem.text($(this).text());
            selectedItem.data("value", $(this).data("value"));
        });

        element.off("click", ".cly-select .search").on("click", ".cly-select .search", function (e) {
            e.stopPropagation();
        });

        element.off("keyup", ".cly-select .search input").on("keyup", ".cly-select .search input", function(event) {
            if (!$(this).val()) {
                $(this).parents(".cly-select").find(".item").removeClass("hidden");
                $(this).parents(".cly-select").find(".group").show();
            } else {
                $(this).parents(".cly-select").find(".item:not(:contains('" + $(this).val() + "'))").addClass("hidden");
                $(this).parents(".cly-select").find(".item:contains('" + $(this).val() + "')").removeClass("hidden");
                var prevHeader = $(this).parents(".cly-select").find(".group").first();
                prevHeader.siblings().each(function(){
                    if($(this).hasClass("group")){
                        if(prevHeader)
                            prevHeader.hide();
                        prevHeader = $(this);
                    }
                    else if($(this).hasClass("item") && $(this).is(":visible")){
                        prevHeader = null;
                    }

                    if(!$(this).next().length && prevHeader)
                        prevHeader.hide();
                })
            }
        });

        element.off('mouseenter').on('mouseenter', ".cly-select .item", function () {
            var item = $(this);

            if (this.offsetWidth < this.scrollWidth && !item.attr('title')) {
                item.attr('title', item.text());
            }
        });

        $(window).click(function () {
            $(".select-items").hide();
            $(".cly-select").find(".search").remove();
        });
    };

    CountlyHelpers.refreshTable = function(dTable, newDataArr) {
        var oSettings = dTable.fnSettings();
        dTable.fnClearTable(false);

		if(newDataArr && newDataArr.length)
			for (var i=0; i < newDataArr.length; i++) {
				dTable.oApi._fnAddData(oSettings, newDataArr[i]);
			}

        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
        dTable.fnStandingRedraw();
    };

	CountlyHelpers.expandRows = function(dTable, getData){
		dTable.aOpen = [];
		dTable.on("click", "tr", function (e){
			var nTr = this;
			var id = $(nTr).attr("id");
			if(!id){
				e.stopPropagation();
			}
			else{
				var i = $.inArray( id, dTable.aOpen );

				if ( i === -1 ) {
					$(nTr).addClass("selected");
					var nDetailsRow = dTable.fnOpen( nTr, getData(dTable.fnGetData( nTr )), 'details' );
					$('div.datatablesubrow', nDetailsRow).slideDown();
					dTable.aOpen.push( id );
				}
				else {
					$(nTr).removeClass("selected");
					$('div.datatablesubrow', $(nTr).next()[0]).slideUp( function () {
						dTable.fnClose( nTr );
						dTable.aOpen.splice( i, 1 );
					} );
				}
			}
		});
	};

	CountlyHelpers.reopenRows = function(dTable, getData){
		var nTr;
		var oSettings = dTable.fnSettings();
		if(dTable.aOpen){
			$.each( dTable.aOpen, function ( i, id ) {
				var nTr = $("#"+id)[0];
				$(nTr).addClass("selected");
				var nDetailsRow = dTable.fnOpen( nTr, getData(dTable.fnGetData( nTr )), 'details' );
				$('div.datatablesubrow', nDetailsRow).show();
			});
		}
	};

    CountlyHelpers.closeRows = function(dTable){
        if(dTable.aOpen){
			$.each( dTable.aOpen, function ( i, id ) {
				var nTr = $("#"+id)[0];
				$(nTr).removeClass("selected");
				$('div.datatablesubrow', $(nTr).next()[0]).slideUp( function () {
					dTable.fnClose( nTr );
					dTable.aOpen.splice( i, 1 );
				} );
			});
		}
    };

	CountlyHelpers.appIdsToNames = function(context){
        var ret = "";

        for (var i = 0; i < context.length; i++) {
            if (!context[i]) {
                continue;
            } else if (!countlyGlobal['apps'][context[i]]) {
                ret += 'deleted app';
            } else {
                ret += countlyGlobal['apps'][context[i]]["name"];
            }

            if (context.length > 1 && i != context.length - 1) {
                ret += ", ";
            }
        }

        return ret;
    };

    CountlyHelpers.loadJS = function(js, callback){
		var fileref=document.createElement('script'),
        loaded;
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", js);
        if (callback) {
            fileref.onreadystatechange = fileref.onload = function() {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName("head")[0].appendChild(fileref);
	};

    CountlyHelpers.loadCSS = function(css, callback){
		var fileref=document.createElement("link"),
        loaded;
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", css);
        if (callback) {
            fileref.onreadystatechange = fileref.onload = function() {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName("head")[0].appendChild(fileref)
	};

    CountlyHelpers.messageText = function(messagePerLocale) {
        if (!messagePerLocale) {
            return '';
        } else if (messagePerLocale['default']) {
            return messagePerLocale['default'];
        } else if (messagePerLocale.en) {
            return messagePerLocale.en;
        } else {
            for (var locale in messagePerLocale) return messagePerLocale[locale];
        }
        return '';
    };

    CountlyHelpers.clip = function(f) {
        return function(opt) {
            var res = f(opt);
            return '<div class="clip' + (res ? '' : ' nothing') + '">' + (res || jQuery.i18n.map['push.no-message']) + '</div>';
        }
    };

	CountlyHelpers.createMetricModel = function (countlyMetric, _name, $, fetchValue) {
		//Private Properties
		var _periodObj = {},
			_Db = {},
			_metrics = [],
			_activeAppKey = 0,
			_initialized = false,
			_period = null;

		//Public Methods
		countlyMetric.initialize = function () {
			if (_initialized &&  _period == countlyCommon.getPeriodForAjax() && _activeAppKey == countlyCommon.ACTIVE_APP_KEY) {
				return this.refresh();
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
						"method":_name,
						"period":_period
					},
					dataType:"jsonp",
					success:function (json) {

              console.log("+++ ajax call 1 finish +++");
              console.log(json);

  						_Db = json;
  						setMeta();
					}
				});
			} else {
				_Db = {"2012":{}};
				return true;
			}
		};

		countlyMetric.refresh = function () {
			_periodObj = countlyCommon.periodObj;

			if (!countlyCommon.DEBUG) {

				if (_activeAppKey != countlyCommon.ACTIVE_APP_KEY) {
					_activeAppKey = countlyCommon.ACTIVE_APP_KEY;
					return this.initialize();
				}

				return $.ajax({
					type:"GET",
					url:countlyCommon.API_PARTS.data.r,
					data:{
						"api_key":countlyGlobal.member.api_key,
						"app_id":countlyCommon.ACTIVE_APP_ID,
						"method":_name,
						"action":"refresh"
					},
					dataType:"jsonp",
					success:function (json) {
						countlyCommon.extendDbObj(_Db, json);
						extendMeta();
					}
				});
			} else {
				_Db = {"2012":{}};

				return true;
			}
		};

		countlyMetric.reset = function () {
			_Db = {};
			setMeta();
		};

    countlyMetric.clearObject = function (obj) {
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

		countlyMetric.getData = function () {

      /*
          todo: look clearObjectFunc below
      */

      var clearObjectFunc = function (obj) {
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

			var chartData = countlyCommon.extractTwoLevelData(_Db, _metrics, clearObjectFunc, [
				{
					name:_name,
					func:function (rangeArr, dataObj) {
                        if(fetchValue)
                            return fetchValue(rangeArr);
                        else
                            return rangeArr;
					}
				},
				{ "name":"t" },
				{ "name":"u" },
				{ "name":"n" }
			]);
            chartData.chartData = countlyCommon.mergeMetricsByName(chartData.chartData, _name);
			var namesData = _.pluck(chartData.chartData, _name),
				totalData = _.pluck(chartData.chartData, 't'),
				newData = _.pluck(chartData.chartData, 'n'),
				chartData2 = [],
				chartData3 = [];

			var sum = _.reduce(totalData, function (memo, num) {
				return memo + num;
			}, 0);

			for (var i = 0; i < namesData.length; i++) {
				var percent = (totalData[i] / sum) * 100;
				chartData2[i] = {data:[
					[0, totalData[i]]
				], label:namesData[i]};
			}

			var sum2 = _.reduce(newData, function (memo, num) {
				return memo + num;
			}, 0);

			for (var i = 0; i < namesData.length; i++) {
				var percent = (newData[i] / sum) * 100;
				chartData3[i] = {data:[
					[0, newData[i]]
				], label:namesData[i]};
			}

			chartData.chartDPTotal = {};
			chartData.chartDPTotal.dp = chartData2;

			chartData.chartDPNew = {};
			chartData.chartDPNew.dp = chartData3;

			return chartData;
		};

		countlyMetric.getBars = function () {
			return countlyCommon.extractBarData(_Db, _metrics, this.clearObject);
		};

		function setMeta() {
			if (_Db['meta']) {
				_metrics = (_Db['meta'][_name]) ? _Db['meta'][_name] : [];
			} else {
				_metrics = [];
			}
		}

		function extendMeta() {
			if (_Db['meta']) {
				_metrics = countlyCommon.union(_metrics, _Db['meta'][_name]);
			}
		}

	};

    CountlyHelpers.initializeTextSelect = function () {
        $("#content-container").on("click", ".cly-text-select", function (e) {
            if ($(this).hasClass("disabled")) {
                return true;
            }

            initItems($(this));

            $("#date-picker").hide();
            e.stopPropagation();
        });

        $("#content-container").on("click", ".select-items .item", function () {
            var selectedItem = $(this).parents(".cly-text-select").find(".text");
            selectedItem.text($(this).text());
            selectedItem.data("value", $(this).data("value"));
            selectedItem.val($(this).text());
        });

        $("#content-container").on("keyup", ".cly-text-select input", function(event) {
            initItems($(this).parents(".cly-text-select"), true);

            $(this).data("value", $(this).val());

            if (!$(this).val()) {
                $(this).parents(".cly-text-select").find(".item").removeClass("hidden");
            } else {
                $(this).parents(".cly-text-select").find(".item:not(:contains('" + $(this).val() + "'))").addClass("hidden");
                $(this).parents(".cly-text-select").find(".item:contains('" + $(this).val() + "')").removeClass("hidden");
            }
        });

        function initItems(select, forceShow) {
            select.removeClass("req");

            var selectItems = select.find(".select-items");

            if (!selectItems.length) {
                return false;
            }

            if (select.find(".select-items").is(":visible") && !forceShow) {
                select.find(".select-items").hide();
            } else {
                select.find(".select-items").show();
                select.find(".select-items>div").addClass("scroll-list");
                select.find(".scroll-list").slimScroll({
                    height:'100%',
                    start:'top',
                    wheelStep:10,
                    position:'right',
                    disableFadeOut:true
                });
            }
        }

        $(window).click(function () {
            $(".select-items").hide();
        });
    };

    CountlyHelpers.initializeHugeDropdown = function () {
        var dropdownHideFunc;

        $("#content-container").on("mouseenter", ".cly-huge-dropdown-activator", function (e) {
            clearInterval(dropdownHideFunc);

            var target = $(this).next(".cly-huge-dropdown");

            target.trigger("huge-dropdown-init");
            target.find(".scroll").slimScroll({
                height:'100%',
                start:'top',
                wheelStep:10,
                position:'right',
                disableFadeOut:true
            });

            target.find(".button-container .title").text($(this).text());
            target.fadeIn("slow");
        });

        $("#content-container").on("mouseleave", ".cly-huge-dropdown", function (e) {
            var target = $(this);
            dropdownHideFunc = setTimeout(function() { target.fadeOut("fast") }, 500);
        });

        $("#content-container").on("mouseenter", ".cly-huge-dropdown", function (e) {
            clearInterval(dropdownHideFunc);
        });

        $("#content-container").on("close", ".cly-huge-dropdown", function (e) {
            $(this).fadeOut("fast");
        });
    };

    function revealDialog(dialog) {
        $("body").append(dialog);

        var dialogHeight = dialog.outerHeight()+5,
            dialogWidth = dialog.outerWidth()+5;

        dialog.css({
            "height":dialogHeight,
            "margin-top":Math.floor(-dialogHeight / 2),
            "width":dialogWidth,
            "margin-left":Math.floor(-dialogWidth / 2)
        });

        $("#overlay").fadeIn();
        dialog.fadeIn(app.tipsify.bind(app, $("#help-toggle").hasClass("active"), dialog));
    }

	function changeDialogHeight(dialog, height, animate) {
        var dialogHeight = height || dialog.attr('data-height') || dialog.height() + 15,
            dialogWidth = dialog.width(),
            maxHeight = $("#sidebar").height() - 40;

        dialog.attr('data-height', height);

        if (dialogHeight > maxHeight) {
            dialog[animate ? 'animate' : 'css']({
                "height":maxHeight,
                "margin-top":Math.floor(-maxHeight / 2),
                "width":dialogWidth,
                "margin-left":Math.floor(-dialogWidth / 2),
                "overflow-y": "auto"
            });
        } else {
            dialog[animate ? 'animate' : 'css']({
                "height":dialogHeight,
                "margin-top":Math.floor(-dialogHeight / 2),
                "width":dialogWidth,
                "margin-left":Math.floor(-dialogWidth / 2)
            });
        }
    }

	CountlyHelpers.revealDialog = revealDialog;
    CountlyHelpers.changeDialogHeight = changeDialogHeight;

    CountlyHelpers.removeDialog = function(dialog){
        dialog.remove();
        $("#overlay").fadeOut();
    };

    $(document).ready(function () {
        $("#overlay").click(function () {
            var dialog = $(".dialog:visible:not(.cly-loading)");
            if (dialog.length) {
                dialog.fadeOut().remove();
                $(this).hide();
            }
        });

        $("#dialog-ok, #dialog-cancel, #dialog-continue").live('click', function () {
            $(this).parents(".dialog:visible").fadeOut().remove();
            if (!$('.dialog:visible').length) $("#overlay").hide();
        });

        $(document).keyup(function (e) {
            // ESC
            if (e.keyCode == 27) {
                $(".dialog:visible").animate({
                    top:0,
                    opacity:0
                }, {
                    duration:1000,
                    easing:'easeOutQuart',
                    complete:function () {
                        $(this).remove();
                    }
                });

                $("#overlay").hide();
            }
        });
    });

}(window.CountlyHelpers = window.CountlyHelpers || {}, jQuery));

$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
