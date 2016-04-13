countlyCommon.DEBUG = false;
countlyCommon.API_URL = countlyGlobal["path"] || "";
countlyCommon.API_PARTS = {
    data:{
        "w":countlyCommon.API_URL + "/i",
        "r":countlyCommon.API_URL + "/o"
    },
    apps:{
        "w":countlyCommon.API_URL + "/i/apps",
        "r":countlyCommon.API_URL + "/o/apps"
    },
    users:{
        "w":countlyCommon.API_URL + "/i/users",
        "r":countlyCommon.API_URL + "/o/users"
    }
};
countlyCommon.DASHBOARD_REFRESH_MS = 10000;
countlyCommon.DASHBOARD_IDLE_MS = 3000000;
countlyCommon.GRAPH_COLORS = ["#1A8AF3", "#F2B702", "#FF7D7D", "#9FC126", "#5DCBFF", "#0FB654", "#A63818", "#F73930", "#FD8927", "#F9BD34", "#FF7575", "#1A8AF3", "#5DCBFF", "#9521B8", "#26C1B9", "#9FC126", "#0FB654", "#A63818", "#F73930", "#FD8927", "#F9BD34", "#FF7575"];
countlyCommon.CITY_DATA = true;