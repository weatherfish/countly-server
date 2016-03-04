var CountlyRouter = React.createClass({

    getInitialState: function() {

        return({

        });

    },

    render : function(){

        return(<ReactRouter history={ReactRouter.browserHistory}>
                  <ReactRouter.Route path="/" component={Dashboard}>
                    <ReactRouter.Route path="sessions" component={SessionPage}/>
                    <ReactRouter.Route path="users" component={UserPage}/>
                    <ReactRouter.Route path="*" component={Dashboard}/>
                  </ReactRouter.Route>
              </ReactRouter>)

    }
})
