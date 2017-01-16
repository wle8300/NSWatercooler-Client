import env from '../../env'
import Shema from '../../shema'

import React from 'react'
import MUITextField from 'material-ui/TextField'
import MUIRaisedButton from 'material-ui/RaisedButton'
import Request from 'superagent'


module.exports = React.createClass({
	displayName: 'LoginForm',
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any])
	},
	getInitialState: function () {
		return Shema.call(this, {email: '', password: ''})
	},
	render: function () {
		return (
		  <div style={{padding: '1rem'}}>
		    <MUITextField
					type="email"
					value={this.state.email}
					onChange={this.changeEmail}
					hintText="Email"
					underlineShow={false}
					fullWidth/>
		    <MUITextField
					type="password"
					value={this.state.password}
					onChange={this.changePassword}
					hintText="Password"
					underlineShow={false}
					fullWidth/>
				<MUIRaisedButton
					label="Login"
					onTouchTap={this.submitLogin}
					secondary
					fullWidth/>
		  </div>
		)
	},
	changeEmail: function (e) {
		
		this.setState(Shema.call(this, {email: e.target.value}, true))
	},
	changePassword: function (e) {

		this.setState(Shema.call(this, {password: e.target.value}, true))
	},
	submitLogin: function () {
		
		Request
		.post(env.backend+ '/jwt')
		.send({
			email: this.state.email,
			password: this.state.password
		})
		.end((err, response) => {
			
			if (err) throw err
				
			localStorage.Jwt = JSON.stringify(response.body)
			this.props.routerRef.navigate('/')
		})
	}
})