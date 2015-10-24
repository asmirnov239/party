var React = require('react');
var BS = require('react-bootstrap');
var title = "Party Registration";

var $ = require('jquery');

var DateTimePicker = require('react-widgets').DateTimePicker
var ReactWidgets = require('react-widgets');
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

var Home = React.createClass({
    getInitialState() {
        document.title = title;
        return {};
    },
    saveEntry() {
        //var data = this.refs.number.getValue();
        //var inputNode = this.refs.number.getInputDOMNode();
        $.ajax({
            type: "POST",
            url: "/api/registerParty",
            data: {'entry': 5},
            success: function () {
                alert('success');
                //inputNode.value = "";
            },
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            },
            dataType: 'json'
        });        
    },
    updateForm (e) {
        alert('hi');
    },
    render() {
      return (
        <BS.Grid>
            <BS.Col md={6} mdOffset={3} xs={12}>
                <BS.Row className='show-grid'>
                    <BS.Panel header={title} bsStyle='primary'>
                        <form className="form-horizontal">
                            <BS.Input type="text" label="Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" onChange={this.updateForm} />
                            <BS.Input type="text" label="Location" labelClassName="col-xs-2" wrapperClassName="col-xs-10" onChange={this.updateForm}/>
                            <BS.Input type="text" label="Phone Number" labelClassName="col-xs-2" wrapperClassName="col-xs-10" onChange={this.updateForm}/>
                            <BS.Input label="Start Time" labelClassName="col-xs-2" wrapperClassName="col-xs-10" >
                                <DateTimePicker defaultValue={roundMinutes(new Date())} onChange={this.updateForm} />
                            </BS.Input>
                            <BS.Input label="End Time" labelClassName="col-xs-2" wrapperClassName="col-xs-10" >
                                <DateTimePicker defaultValue={roundMinutes(new Date(),120)} onChange={this.updateForm} />
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