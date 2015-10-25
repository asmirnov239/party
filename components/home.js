var React = require('react');
var BS = require('react-bootstrap');
var title = "Off Campus Party Registration";
var $ = require('jquery');
var DateTimePicker = require('react-widgets').DateTimePicker
var ReactWidgets = require('react-widgets');

// Localization library used by datepicker
var Globalize = require('globalize')
var globalizeLocalizer = require('../node_modules/react-widgets/lib/localizers/globalize')
Globalize.load(
  require( "cldr-data/main/en/ca-gregorian" ),
  require( "cldr-data/supplemental/likelySubtags" ),
  require( "cldr-data/supplemental/timeData" ),
  require( "cldr-data/supplemental/weekData" ),
  require( "cldr-data/main/en/numbers.json"),
  require( "cldr-data/supplemental/numberingSystems.json"),
  require( "cldr-data/main/en/timeZoneNames.json")
  );
Globalize.locale('en');

globalizeLocalizer(Globalize);

function roundMinutes(date, plusMinutes) {
    date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
    date.setMinutes((plusMinutes) ? plusMinutes : 0);
    date.setSeconds(0);
    return date;
}

var validate = function (data) {
    // check name
    // check 
    return true;
}
var Home = React.createClass({
    getInitialState() {
        document.title = title;
        return {
            startTime: this.props.startTime,
            endTime: this.props.endTime
        };
    },
    getDefaultProps() {
        return {
            startTime: roundMinutes(new Date()),
            endTime: roundMinutes(new Date(), 120)
        }
    },
    saveEntry() {
        var data = {};
        for (prop in this.state) {
            // we transform the date objects to string
            if (typeof this.state[prop] == "string") {
                data[prop] = this.state[prop];
            } else {
                data[prop] = this.state[prop].toLocaleString();
            }
        }
        if (validate(data)) {
            var self = this;
            $.ajax({
                type: "POST",
                url: "/api/registerParty",
                data: data,
                success: function () {
                    alert('success');
                    self.setState(self.getInitialState);
                },
                error: function(xhr, status, err) {
                    console.error(status, err.toString());
                },
                dataType: 'json'
            });       
        }
 
    },
    updateForm (property, e) {
        var value;
        if (e.target) {
            value = e.target.value;
        } else {
            value = e;
        }
        this.state[property] = value;
        this.setState(this.state);
    },
    render() {
      return (
        <BS.Grid>
            <BS.Col md={6} mdOffset={3} xs={12}>
                <BS.Row className='show-grid'>
                    <BS.Panel header={title} bsStyle='primary'>
                        <form className="form-horizontal">
                            <BS.Input type="text" label="Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" value={this.state.name} onChange={this.updateForm.bind(null,"name")} />
                            <BS.Input type="text" label="Address" labelClassName="col-xs-2" wrapperClassName="col-xs-10" value={this.state.location} onChange={this.updateForm.bind(null,"location")}/>
                            <BS.Input type="text" label="Phone Number" labelClassName="col-xs-2" wrapperClassName="col-xs-10" value={this.state.number} onChange={this.updateForm.bind(null,"number")}/>
                            <BS.Input label="Start Time" labelClassName="col-xs-2" wrapperClassName="col-xs-10" >
                                <DateTimePicker defaultValue={this.props.startTime} onChange={this.updateForm.bind(null,"startTime")} />
                            </BS.Input>
                            <BS.Input label="End Time" labelClassName="col-xs-2" wrapperClassName="col-xs-10" >
                                <DateTimePicker defaultValue={this.props.endTime} onChange={this.updateForm.bind(null,"endTime")} />
                            </BS.Input>
                        </form>
                        <BS.Button onClick={this.saveEntry} bsStyle='primary' bsSize='large' block>Submit</BS.Button>
                    </BS.Panel>
                </BS.Row>
            </BS.Col>
        </BS.Grid>
        );
  }
});

module.exports = Home;