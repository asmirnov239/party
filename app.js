var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Header = require('./components/header');

var App = React.createClass({
    render() {
    	var divStyle = {
    		marginTop: "100px"
    	};
        return (
            <div>
                <Header/>
                <div style={divStyle}>
                	{this.props.children}
            	</div>
            </div>
        );
    }
});

module.exports = App;
