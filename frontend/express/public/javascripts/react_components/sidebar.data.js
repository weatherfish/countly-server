//var navigation = [


var get_sidebar_data = function(){

    var data = [{
        key         : jQuery.i18n.map["sidebar.analytics"],
        icon        : 'metrics',
        path        : 'metrics',
        description : 'User profiles offer you a wide overwiew about your User profiles',
        items       : [
                        [jQuery.i18n.map["sidebar.analytics.users"], "/metrics/users"],
                        [jQuery.i18n.map["sidebar.analytics.sessions"], "/metrics/sessions"],
                        [jQuery.i18n.map["sidebar.analytics.countries"],   "/metrics/countries"],
                        [jQuery.i18n.map["sidebar.analytics.devices"], "/metrics/devices"],
                        [jQuery.i18n.map["sidebar.analytics.resolutions"], "/metrics/resolutions"],
                        /*["App Versions", "/analytics/durations"],*/
                        [jQuery.i18n.map["sidebar.analytics.carriers"], "/metrics/carriers"],
                        [jQuery.i18n.map["sidebar.analytics.densities"], "/metrics/density"],
                        [jQuery.i18n.map["sidebar.analytics.languages"], "/metrics/language"],
                        [jQuery.i18n.map["sidebar.analytics.platforms"], "/metrics/platforms"],
                        ["Sessions by Countries", "/metrics/map_sessions"],
                        /*["Platforms", "/analytics/platforms"],
                        ["Densities", "/analytics/densities"],
                        ["Sources ", "/analytics/sources"],
                        ["Languages ", "/analytics/languages"],*/
                      ]
        },
        {
            key: jQuery.i18n.map["sidebar.engagement"],
            icon        : 'engagement',
            path        : 'engagement',
            description : 'Management offer you a wide overwiew about your apps Management',
            items       : [
                            [jQuery.i18n.map["sidebar.analytics.session-frequency"],   "/engagement/frequency"],
                            [jQuery.i18n.map["sidebar.engagement.durations"],   "/engagement/durations"],
                            [jQuery.i18n.map["sidebar.analytics.user-loyalty"],     "/engagement/loyalty"],
                          ]
        },
        {
            key: jQuery.i18n.map["sidebar.events"],
            icon        : 'events',
            path        : 'events',
            description : 'Crashes offer you a wide overwiew about your apps Crashes',
            arrow       : -1, // todo: tmp
            items       : ["events", "/events"]
        },
        {
            key: jQuery.i18n.map["crashes.title"],
            icon        : 'crashes',
            path        : 'crashes',
            description : 'Crashes offer you a wide overwiew about your apps Crashes',
            items       : ["crashes", "/crashes"]
        },
        {
            key: jQuery.i18n.map["sidebar.management"],
            icon        : 'manage',
            path        : 'manage',
            description : '',
            arrow       : -1, // todo: tmp
            items       : [                            
                            ["Populator", "/manage/populator"],
                            /*["E-mails reports", "/manage/todo"],
                            ["My Account", "/manage/todo"],*/
                          ]
    
        }
    ]
    
    if(global_admin){
        data[data.length - 1].items.unshift([jQuery.i18n.map["plugins.configs"], "/manage/configurations"]);
    }
    
    if(true || admin_of_apps){
        data[data.length - 1].items.unshift([jQuery.i18n.map["sidebar.management.applications"], "/manage/apps"]);
    }
    
    if(global_admin){
        data[data.length - 1].items.unshift([jQuery.i18n.map["sidebar.management.users"], "/manage/users"]);
    }

    return data;

}
