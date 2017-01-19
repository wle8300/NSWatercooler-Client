import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

import React from 'react'
import Request from 'superagent'
import MUITextField from 'material-ui/TextField'
import MUIRaisedButton from 'material-ui/RaisedButton';


module.exports = React.createClass({
	propTypes: {
		changeMarquee: React.PropTypes.func.isRequired,
		changeFooter: React.PropTypes.func.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {
			email: utils.parseJwtPayload().email,
			password: '•••••••••'
		})
	},
	render: function () {
		return (
			<div style={{margin: '1.5rem'}}>
		    <MUITextField
					type="email"
					value={this.state.email}
					onChange={this.changeEmail}
					hintText="Email"
					fullWidth/>
				<MUIRaisedButton
					label="Update Email"
					onTouchTap={this.submitNewEmail}/>
		    <MUITextField
					type="password"
					value={this.state.password}
					onChange={this.changePassword}
					hintText="Password"
					fullWidth/>
				<MUIRaisedButton
					label="Update Password"
					onTouchTap={this.submitNewPassword}/>
			</div>
		)
	},
	componentWillMount: function () {

		this.props.changeMarquee('Account')
		this.props.changeFooter(false)
	},
	changeEmail: function (e) {
		
		this.setState(Shema.call(this, {email: e.target.value}, true))
	},
	changePassword: function (e) {

		this.setState(Shema.call(this, {password: e.target.value}, true))
	},
	submitNewEmail: function () {
		
		Request
		.put(env.backend+ '/user/' +utils.parseJwtPayload().id+ '/email')
		.send({email: this.state.email})
		.end((err, response) => {
			
			if (err) throw err
			
			// use resopnse.body to mutate l.s.jwt
			localStorage.Jwt = JSON.stringify(response.body)
		})
	},
	submitNewPassword: function () {
		
	}
})