var UpdatePageMixin = {

    componentDidMount : function() {

        var self = this;
        
        var data_timestamp = Math.floor(Date.now());

        this.init_data(data_timestamp);

        this.interval = setInterval(function () {

            var data_timestamp = Math.floor(Date.now());

            self.init_data(data_timestamp);

        }, countlyCommon.DASHBOARD_REFRESH_MS);

    },
    
    componentWillUnmount: function() {
        clearInterval(this.interval);
    }
};
