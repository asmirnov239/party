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
        $.ajax({
            url: "/api/getparties",
            dataType: 'json',
            cache: false,
            success: function (data) {
                if (data.length === 0) {
                    this.state.message = "No parties nearby. For complaints please coordinate with local law enforcement.";
                }
                this.setState({data: data, message: this.state.message});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
	render() {
        var notify = function (id) {
            $.ajax({
                url: "/api/notify",
                dataType: 'json',
                cache: false,
                data: {"id": id},
                success: function (data) {
                    alert("success");
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
            console.log("sent " + id);
        };
        var self = this;
        var key = -1;
        var entries = this.state.data.map(function (element){
            //var date = self.parseDate(entry.dateTime);
            return (
                <BS.Panel key={key++} header={""} bsStyle='primary'>
                    <span>{element.location}</span>
                    <span className="notify-noise-complaint-button">
                        <BS.Button onClick={notify.bind(this,"1445748965839")} bsStyle="primary">Make Noise Complaint</BS.Button>
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