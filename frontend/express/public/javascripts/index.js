var navigation = false;

var init = function(){ 
        
    //Globalize('en-gb'); // todo: https://github.com/jquense/react-widgets/issues/98
            
    jQuery.i18n.properties({
        name:'locale',
        cache:true,
        language:countlyCommon.BROWSER_LANG_SHORT,
        path:[countlyGlobal["cdn"]+'/localization/min/'],
        mode:'map'
    });
        
    navigation = get_sidebar_data();
                
    var wrapComponent = function(Component, props) {
        return React.createClass({
            render: function() {
                return React.createElement(Component, props);              
            }
        });
    };
        
    var Router = ReactRouter.Router;
    var Route = ReactRouter.Route;
        
    var __active_app = false;
    var __applications = false;
        
    const App = React.createClass({
        
        mixins: [ ReactRouter.History ],
        
        getInitialState : function(){
        
            return ({
      		    top_bar_first : false,
                top_bar_second : false,
                top_block : false,
                language : false,
                date : false
                    //data_timestamp : false
            })
        },
        
        componentDidMount : function(){
            if (initial_applications.length == 0)
            {
                this.history.pushState(null, "/manage/apps");
            }
        },
            
        date_changed : function(new_date){
                                        
            this.setState({
                date : new_date
            })
        },
        
        path_changed : function(first, second){
                        
            if (!first)
            {
                first = second;
                second = false;
            }
        
            this.setState({
      		    top_bar_first : first,
          		top_bar_second : second
            })
        },            
                    
        change_language : function(language){
                        
            navigation = get_sidebar_data();
                        
            this.setState({
                language : language
            });
        },
        
        render() {
                       
            if ((initial_applications.length != 0) && this.props.location.pathname.indexOf("/manage/users") == -1 && this.props.location.pathname.indexOf("/manage/configurations") == -1 && this.props.location.pathname.indexOf("/manage/apps") == -1 && this.props.location.pathname.indexOf("/manage/applications") == -1 && this.props.location.pathname.indexOf("/crashes/") == -1 && this.props.location.pathname.indexOf("/manage/populator") == -1)
            {
                var show_calendar = true;   
            }
            else
            {
                var show_calendar = false;   
            }
                        
            if (this.props.location.pathname.indexOf("/events") > -1)
            {
                var calendar_offset_top = 70;
            }
            else
            {
                var calendar_offset_top = false;
            }
        
            if (show_calendar)
            {
        
                var calendar = <div id="calendar_block">
                                    <CalendarWrapper
                                        onDateChange={this.date_changed}
                                        offset_top={calendar_offset_top}
                                        language={this.state.language}
                                    />
                                </div>
        
                var container_style = {
                    "border-width" : "1px"
                }
            }
            else
            {        
                var calendar = false;
        
                var container_style = {
                    "top" : "80px",
                    "border-width" : "0px"
                }
            }
        
            if (this.props.location.pathname.indexOf("/events") > -1)
            {
                container_style.top = "211px";
                container_style.zIndex = 2000;
            }
                        
            if (this.state.date || !show_calendar)
            {
                var content_container = <div id="content-container" style={container_style}>
                                            {this.props.children && React.cloneElement(this.props.children, {
                                                language : this.state.language,
                                                date : this.state.date,
                                                active_app : __active_app             
                                            })}
                                        </div>;
            }
            else
            {
                var content_container = false;
            }
                       
            return (
                <div className="app">
                                                    
                    <div id="sidebar">
                        <FullSidebar
                            navigation={navigation}
                            active_app={__active_app}
                            current_location={this.props.location.pathname}
                            applications={__applications}
                            onChange={this.path_changed}
                            countly_version={countly_version}
                            language={this.state.language}
                            on_active_app_change={this.props.route.on_active_app_change}
                        />
                    </div>
        
                    <div id="top_bar">
                        <TopBar
                            user_name={user_full_name}
                            width={window.innerWidth - sidebar_width - 16}
                            first={this.state.top_bar_first}
                            second={this.state.top_bar_second}
                            language={this.state.language}
                            on_change_language={this.change_language}
                        />
                    </div>
        
                    {calendar}                        
                    {content_container}
        
                </div>
            )
        }
    })
        
    var CountlyRouter = React.createClass({
                                
            getInitialState: function() {
                                        
                var active_app_id = countlyCommon.ACTIVE_APP_ID;
        
                var active_app = false;
                
                for (var i = 0; i < initial_applications.length; i++)
                {
              		if (initial_applications[i].id == active_app_id)
              		{
                        active_app = initial_applications[i];
                        break;
              		}
                }
                                 
                if (active_app)
                {
                    active_app.logo = active_app.id + ".png";
                }  
                        
                __applications = initial_applications;
                __active_app = active_app;
        
                return({
                    date : false,
                    applications : initial_applications,
                    active_app : active_app,
                    data_timestamp : false
                })
        
            },
        
            date_change : function(new_date)
            {
                this.setState({
                    date : new_date
                })
            },
        
            on_app_create : function(app){
                                        
                countlyGlobal['apps'][app._id] = app;
                countlyGlobal['admin_apps'][app._id] = app;
                        
                app.id = app._id;
                //delete app._id;
                app.logo = app.id + ".png";
                        
                var applications = this.state.applications;
                        
                applications.push(app);
                        
                __active_app = app;
                        
                countlyCommon.setActiveApp(app.id);
                        
                this.setState({
                    applications : applications
                });
                        
            },
                    
            on_app_delete : function(app_id){
                                        
                var applications = this.state.applications;
                        
                var delete_i = false;
                        
                for (var i = 0; i < applications.length; i++)
                {
                    if (applications[i].id == app_id)
                    {
                        delete_i = i;
                        break;
                    }
                }
                        
                if (delete_i !== false)
                {
                    applications.splice(delete_i, 1);
                }
                        
                __applications = applications;    
                __active_app = applications[0];
                
                this.setState({
                    applications : applications
                });
            },
        
            on_app_edit : function(app_id){
                        
                var change_i = false;
                        
                for (var i = 0; i < __applications.length; i++)
                {
                    if (__applications[i].id == app_id)
                    {
                        change_i = i;
                        break;
                    }
                }
                                                        
                __applications[change_i].name = countlyGlobal['apps'][__applications[change_i].id].name;
                //countlyCommon.setActiveApp(app_id);
                        
                this.setState({
                    applications : __applications
                });
                        
            },
        
            on_active_app_change : function(app){
                                        
                if (!app.id && app._id)
                {
                    app.id = app._id;
                }                                                
                        
                app.logo = app.id + ".png";
                        
                __active_app = app;
                        
                countlyCommon.setActiveApp(app.id);
                        
                this.setState({
                    active_app : app
                })
                          
            },
        
            render() {
                        
                if (admin_of_apps || true)
                {                    
                    var manage_apps_path = <Route path="apps"  component={wrapComponent(ApplicationsPage, {
                                                on_app_create : this.on_app_create,
                                                on_app_edit : this.on_app_edit,
                                                on_app_delete : this.on_app_delete,                                    
                                            })} />;
                }
                else
                {
                    var manage_apps_path = false;
                }              
                        
                // ------------  
                        
                if (global_admin)
                {
                    var manage_users_path = <Route path="users" component={ManageUsersPage}/>;
                }   
                else
                {
                    var manage_users_path = false
                }
                        
                // ------------     
                        
                if(global_admin)
                {
                    var configurations_path = <Route path="configurations" component={wrapComponent(ConfigurationsPage, {
                                                    username : username,
                                                    user_api_key : api_key                                                                         
                                                })}/>;
                }
                else
                {
                    var configurations_path = false;
                }         
        
                return (
                    <Router history={ReactRouter.browserHistory}>
                        <Route path="/" component={App} applications={this.state.applications} active_app={this.state.active_app} on_active_app_change={this.on_active_app_change} onDateChange={this.date_change.bind(this)}  offset_top={110}> // this.props.route.onDateChange
                            <Route path="dashboard" component={Dashboard}/>
                            <Route path="metrics">
                                <Route path="sessions"     component={SessionPage}/>
                                <Route path="users"        component={UserPage}/>
                                <Route path="resolutions"  component={ResolutionsPage}/>
                                <Route path="devices"      component={DevicesPage}/>
                                <Route path="countries"    component={CountriesPage}/>
                                <Route path="carriers"     component={CarrierPage}/>
                                <Route path="map_sessions" component={MapSessionPage}/>
                                <Route path="density"      component={DensitiesPage}/>
                                <Route path="language"     component={LanguagePage}/>
                                <Route path="platforms"	   component={PlatformsPage}/>
                            </Route>
                            <Route path="engagement">
                                <Route path="frequency" component={FrequencyPage}/>
                                <Route path="loyalty"   component={LoyaltyPage}/>
                                <Route path="durations" component={DurationPage}/>
                            </Route>
                                <Route path="events"    component={EventsPage}></Route>
                                <Route path="crashes"   component={CrashesPage}></Route>
                                <Route path="/crashes/:crash_id" component={CrashDetailsPage}/>
                                <Route path="manage">                                    
                                                     
                                {manage_apps_path}                                                                
                                {manage_users_path}                                
                                {configurations_path}                               
                                        
                                <Route path="populator" component={Populator}/>
                                
                            </Route>
                        <Route path="*" component={Dashboard}/></Route>
                    </Router>)
            }
        })
        
        React.render(React.createElement(CountlyRouter), document.getElementById("react_routing"));
            
}

if (window.production)
{
    window.onload=init;
}
else
{
    init();
} 
