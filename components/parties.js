var React = require('react');
var BS = require('react-bootstrap');
var title = "Parties near by";
var $ = require('jquery');



var Parties = React.createClass({
    getInitialState() {
        document.title = title;
        return {
            data: [],
            message : "Searching nearby..."
        };
    },
    parseDate(dateStr) {
        var d = new Date(parseInt(dateStr, 10));
        return (d.getMonth() + 1) + "." + d.getDate() + "." + d.getYear() % 100 + " @ " + d.getHours() + ":" + d.getMinutes();
    },
    componentDidMount() {
        var self = this;
        navigator.geolocation.getCurrentPosition(function(geoposition){
            getParties(geoposition.coords.longitude, geoposition.coords.latitude); 
        });
        function getParties(latitude, longitude) {
            $.ajax({
                method: "POST",
                url: "/api/getparties",
                dataType: 'json',
                data: {
                    latitude: latitude,
                    longitude: longitude
                },
                cache: false,
                success: function (data) {
                    if (data.length === 0) {
                        self.state.message = "No parties nearby. For complaints please coordinate with local law enforcement.";
                    }
                    self.setState({data: data, message: self.state.message});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });
        }
    },
	render() {
        var notify = function (id) {
            $.ajax({
                url: "/api/notify",
                dataType: 'json',
                cache: false,
                type: "POST",
                data: {"id": id},
                success: function (data) {
                    alert("success");
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });
        };
        var self = this;
        var key = -1;
        var entries = this.state.data.map(function (element){
            return (
                <BS.Panel key={key++} header={""} bsStyle='primary'>
                    <span>{element.location}</span>
                    <span className="notify-noise-complaint-button">
                        <BS.Button onClick={notify.bind(this, element.loggedTime)} bsStyle="primary">Make Noise Complaint</BS.Button>
                    </span>
                </BS.Panel>
            );
        });
		return (
            <BS.Grid>
                <BS.Col md={6} mdOffset={3} xs={12}>
                    <BS.Row className='show-grid'>
                        {(entries.length) ? entries : <p>{this.state.message}</p>}
                    </BS.Row>
                </BS.Col>
            </BS.Grid>
		);
	}
});

module.exports = Parties;