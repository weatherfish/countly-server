var TimeRangeMixin = {
   
    GetTimeRanges : function(data_function, data_function_args){
                
        if (data_function_args)
        {
            var first_set = data_function.apply(this, data_function_args);
        }
        else
        {     
            var first_set = data_function();
        }
                                      
        var current_period = countlyCommon.getPeriod();
         
        console.log("{{{{{{{ current period }}}}}}}}}}}}]]");
        console.log(current_period);
                        
        if (!Array.isArray(current_period))
        {              
            var real_current_period = current_period;
            
            current_period = [this.props.date.period_timestamp[0], this.props.date.period_timestamp[1]];            
        }
        else
        {
            real_current_period = false;
        }
                        
        var current_period_start = current_period[0];
        var current_period_end = current_period[1];
        
        console.log("======= current period ==============");
        console.log(">>", new Date(current_period_start));
        console.log(">>", new Date(current_period_end));
               
        var day_of_week_start = new Date(current_period[0]).getDay(); // todo: 0 is Sunday, 1 Monday
        
        if (day_of_week_start == 0)
        {
            day_of_week_start = 6;
        }
        else
        {
            day_of_week_start -= 1;
        }       
        
        var day_of_week_end = new Date(current_period[1]).getDay(); // todo: 0 is Sunday, 1 Monday
        
        if (day_of_week_end == 0)
        {
            day_of_week_end = 6;
        }
        else
        {
            day_of_week_end -= 1;
        }
                
        var weekly_granularity_border = current_period[0] - (day_of_week_start/*day_of_week_start*/ /*+ 1*/) * (60 * 60 * 24 * 1000);        
        var previous_period_end = weekly_granularity_border - (7 - day_of_week_end) * (60 * 60 * 24 * 1000);                
        var previous_period_start = previous_period_end - (current_period[1] - current_period[0]);     
                
        countlyCommon.setPeriod([previous_period_start, previous_period_end]);
                        
        if (data_function_args)
        {
            var previous_set = data_function.apply(this, data_function_args);
        }
        else
        {     
            var previous_set = data_function();
        }
                                         
        first_set.weekly_granularity[0] = JSON.parse(JSON.stringify(previous_set.weekly_granularity[1]));
               
        first_set.weekly_granularity[0].color = "#bbbbbb";
        first_set.weekly_granularity[0].mode = "ghost";      
               
        // ******************************************** monthly **********************************
        
        var day_of_month_start = new Date(current_period[0]).getDate();
        var day_of_month_end = new Date(current_period[1]).getDate();
                        
        var month_granularity_border = current_period[0] - (day_of_month_start) * (60 * 60 * 24 * 1000);
        
        var days_in_previous_end = new Date(month_granularity_border - (60 * 60 * 24 * 1000)).monthDays();// -1 day (60 * 60 * 24 * 1000) no matter, need to know the number of days in previous perion end
        
        var previous_period_monthly_end = month_granularity_border - (days_in_previous_end - day_of_month_end) * (60 * 60 * 24 * 1000);  
 
        var previous_period_monthly_start = previous_period_monthly_end - (current_period[1] - current_period[0]);    
         
        countlyCommon.setPeriod([previous_period_monthly_start, previous_period_monthly_end]);
                
        if (data_function_args)
        {
            var previous_set_monthly = data_function.apply(this, data_function_args);
        }
        else
        {     
            var previous_set_monthly = data_function();
        }                            
        
        // return time period to default values
        
        if (real_current_period)
        {
            countlyCommon.setPeriod(real_current_period);
        }
        else
        {
            countlyCommon.setPeriod([current_period_start, current_period_end]);
        }                
 
        first_set.monthly_granularity[0] = JSON.parse(JSON.stringify(previous_set_monthly.monthly_granularity[1]));
                
        first_set.monthly_granularity[0].color = "#bbbbbb";
        first_set.monthly_granularity[0].mode = "ghost";
                                                          
        return first_set;
    },
};