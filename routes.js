var Router = require('react-router');
var React = require('react');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var IndexRoute = Router.IndexRoute;

// Application structure
var App = require('./app');

// components of application
var Home = require('./components/home');
var Parties = require('./components/parties');
var NotFound = require('./components/notFound');

var routes = (
    <Route component={App}>
        <Route path="/" component={Home}/>
        <Route path="parties" component={Parties}/>
    </Route>
);

module.exports = routes;

