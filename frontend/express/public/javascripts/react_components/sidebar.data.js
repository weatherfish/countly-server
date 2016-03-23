var navigation = [
    {
        key         : 'Metrics',
        icon        : 'metrics',
        path        : 'metrics',
        description : 'User profiles offer you a wide overwiew about your User profiles',
        items       : [
                        ["Users", "/metrics/users"],
                        ["Sessions", "/metrics/sessions"],
                        ["Countries",   "/metrics/countries"],
                        ["Devices", "/metrics/devices"],
                        ["Resolutions", "/metrics/resolutions"],
                        /*["App Versions", "/analytics/durations"],*/
                        ["Carriers", "/metrics/carriers"],
                        ["Sessions by Countries", "/metrics/map_sessions"],
                        /*["Platforms", "/analytics/platforms"],
                        ["Densities", "/analytics/densities"],
                        ["Sources ", "/analytics/sources"],
                        ["Languages ", "/analytics/languages"],*/
                      ]
    },
    {
        key: 'Engagement',
        icon        : 'engagement',
        path        : 'engagement',
        description : 'Management offer you a wide overwiew about your apps Management',
        items       : [
                        ["Frequency",   "/engagement/frequency"],
                        ["Durations",   "/engagement/durations"],
                        ["Loyalty",     "/engagement/loyalty"],
                      ]
    },
    {
        key: 'Events',
        icon        : 'funnels',
        path        : 'events',
        description : 'Crashes offer you a wide overwiew about your apps Crashes',
        arrow       : -1, // todo: tmp
        items       : ["events", "/events"]
    },
    {
        key: 'Crashes',
        icon        : 'crashes',
        path        : 'crashes',
        description : 'Crashes offer you a wide overwiew about your apps Crashes',
        items       : ["crashes", "/crashes"]
    },
    {
        key: 'Management',
        icon        : 'manage',
        path        : 'manage',
        description : '',
        arrow       : -1, // todo: tmp
        items       : [
                        ["Configurations", "/manage/configurations"],
                        ["Applications", "/manage/apps"],
                        ["User Roles", "/manage/users"],
                        ["E-mails reports", "/manage/todo"],
                        ["My Account", "/manage/todo"],
                      ]

    }
    /*
    {
        key         : 'User profiles',
        icon        : 'user',
        path        : 'user',
        description : 'Metrics offer you a wide overwiew about your apps performance',
        items       : [
                        ["Frequency", "/analytics/frequency"],
                        ["Countries",   "/analytics/countries"],
                        ["Loyalty",     "/analytics/loyalty"],
                        ["Devices",     "/analytics/devices"],
                        ["Platforms",   "/analytics/platforms"],
                        ["Versions",    "/analytics/versions"],
                        ["Carriers",    "/analytics/carriers"],
                        ["Events",      "/analytics/events"],
                        ["Resolutions", "/analytics/resolutions"],
                        ["Durations",   "/analytics/durations"],
                      ]
    },

    {
        key: 'Messaging',
        icon        : 'messaging',
        path        : 'messaging',
        description : 'Management offer you a wide overwiew about your apps Management',
        items       : [
                        ["Versions3",    "/analytics/versions"],
                        ["Carriers3",    "/analytics/carriers"],
                        ["Frequency3",   "/analytics/frequency"],
                        ["Resolutions3", "/analytics/resolutions"],
                        ["Durations3",   "/analytics/durations"],


                      ]
    },

    {
        key: 'Funnels',
        icon        : 'funnels',
        path        : 'funnels',
        description : 'Funnels offer you a wide overwiew about Funnels',
        arrow       : -1, // todo: tmp
        items       : [
                        ["Events4",      "/analytics/events"],
                        ["Resolutions4", "/analytics/resolutions"],
                        ["Durations4",   "/analytics/durations"],
                        ["Loyalty4",     "/analytics/loyalty"],
                        ["Devices4",     "/analytics/devices"],
                        ["Platforms4",   "/analytics/platforms"],
                      ]
    },
    {
        key: 'Drill',
        icon        : 'drill',
        path        : 'drill',
        description : 'Crashes offer you a wide overwiew about your apps Crashes',
        arrow       : -1, // todo: tmp
        items       : [
                        ["Loyalty5",     "/analytics/loyalty"],
                        ["Devices5",     "/analytics/devices"],
                        ["Platforms5",   "/analytics/platforms"],
                        ["Versions5",    "/analytics/versions"],
                        ["Carriers5",    "/analytics/carriers"],
                        ["Frequency5",   "/analytics/frequency"],
                        ["Events5",      "/analytics/events"],
                        ["Resolutions5", "/analytics/resolutions"],
                        ["Durations5",   "/analytics/durations"],
                      ]
    },
    */
];
