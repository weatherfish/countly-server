
window.AssistantView = countlyView.extend({

    initialize: function () {

    },
    beforeRender: function() {

        if(this.template)
            return $.when(countlyAssistant.initialize()).then(function () {});
        else{
            var self = this;
            return $.when($.get(countlyGlobal["path"]+'/assistant/templates/panel.html', function(src){
                self.template = Handlebars.compile(src);
            }), countlyAssistant.initialize()).then(function () {});
        }
    },
    renderCommon:function (isRefresh) {
        var data = countlyAssistant.getDataForApp(countlyCommon.ACTIVE_APP_ID);

        this.templateData = {
            "page-title":jQuery.i18n.map["assistant.title"],
            all_notifs: data.notifications,
            saved_private: data.notifs_saved_private,
            saved_global: data.notifs_saved_global,
            icon_styling_class: 'assistant_icon_regular',
        };

        var changeNotification = function (id, is_private, is_save, parent) {

            if(typeof Countly !== "undefined") {
                var nAction = is_save ? "save" : "unsave";
                var nKey = is_private ? "assistant-change-status-private" : "assistant-change-status-global";
                var sendObj = ['add_event', {
                    "key": nKey,
                    "count": 1,
                    "segmentation": {
                        "action" : nAction
                    }
                }];
                Countly.q.push(sendObj);
            }


            $.when(countlyAssistant.changeNotification(id, is_private, is_save)).then(function (data) {
               // CountlyHelpers.alert(6, "green");
                if(true || data.result == "Success"){//todo finish this
                    
                    var refresh_stuff = function () {
                        $.when(countlyAssistant.initialize()).then(function () {
                            self.renderCommon();
                            app.localize();

                        });
                    };

                    if(!is_save) {
                        parent.slideUp(function () {
                            refresh_stuff();
                        });
                    } else {
                        parent.fadeTo(500, 0.2, function () {
                            parent.fadeTo(500, 1, function () {
                                refresh_stuff();
                            });
                        });
                    }
                }
                else{
                    CountlyHelpers.alert(data.result, "red");
                }
            }).fail(function (data) {
                CountlyHelpers.alert(data, "red");
            });
        };

        var self = this;
        if (!isRefresh) {
            //CountlyHelpers.alert("tab: " + store.get("assistant_tab"), "green");
            $(this.el).html(this.template(this.templateData));

            $( "#tabs" ).tabs({
                selected: store.get("assistant_tab") || 0,
                show: function( event, ui ) {
                    store.set("assistant_tab", ui.index);

                    var tabName = ["all", "saved-private", "saved-global"][ui.index];
                    if(typeof Countly !== "undefined") {
                        Countly.q.push(['add_event', {
                            "key": "assistant-click-tab",
                            "count": 1,
                            "segmentation": {
                                "tab_name" : tabName
                            }
                        }]);
                    }
                }
            });

            $(".btn-save-global").on("click", function(){
                var id = $(this).data("id");//notification id
                var parent = $(this).parents(".assistant_notif");
                changeNotification(id, false, true, parent);
            });

            $(".btn-save-private").on("click", function(){
                var id = $(this).data("id");//notification id
                var parent = $(this).parents(".assistant_notif");
                //CountlyHelpers.alert(7, "green");
                changeNotification(id, true, true, parent);
            });

            $(".btn-unsave-global").on("click", function(){
                var id = $(this).data("id");//notification id
                var parent = $(this).parents(".assistant_notif");
                CountlyHelpers.confirm(jQuery.i18n.map["assistant.confirm-unsave-global"], "red", function (result) {
                    if (!result) {
                        return true;
                    }
                    changeNotification(id, false, false, parent);
                });
            });

            $(".btn-unsave-private").on("click", function(){
                var id = $(this).data("id");//notification id
                var parent = $(this).parents(".assistant_notif");
                CountlyHelpers.confirm(jQuery.i18n.map["assistant.confirm-unsave-private"], "red", function (result) {
                    if (!result) {
                        return true;
                    }
                    changeNotification(id, true, false, parent);
                });
            });

            $("#assistant_container").css("height", $( window ).height() - $("#content-footer").height());
        }
    }
});

//register views
app.assistantView = new AssistantView();

app.route("/analytics/assistant", 'assistant', function () {
    this.renderWhenReady(this.assistantView);
});

$( document ).ready(function() {
    var menu = '<a href="#/analytics/assistant" class="item">'+
        '<div class="logo densities"></div>'+
        '<div class="text" data-localize="sidebar.analytics.assistant">Assistant</div>'+
        '</a>';
    $('#mobile-type #analytics-submenu').append(menu);
    $('#web-type #analytics-submenu').append(menu);
});