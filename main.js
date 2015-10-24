var React = require('react');
var ReactRouter = require('react-router');
var ReactDOM = require('react-dom');
var Route = ReactRouter.route;

var routes = require('./routes.js')

var Router = ReactRouter.Router;
// Components
ReactDOM.render(<Router routes={routes} />, document.getElementById('content'));
