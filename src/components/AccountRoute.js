import env from '../../env'
import utils from '../../utils'
import Shema from '../../shema'

import React from 'react'
import Request from 'superagent'
import MUITextField from 'material-ui/TextField'
import MUIRaisedButton from 'material-ui/RaisedButton';


module.exports = React.createClass({
	propTypes: {
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired,
		changeFooter: React.PropTypes.func.isRequired
	},
	getInitialState: function () {
		return Shema.call(this, {
			email: utils.parseJwtPayload().email,
			password: utils.parseJwtPayload().id
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
					underlineShow={false}
					fullWidth/>
				<MUIRaisedButton
					label="Update Email"
					onTouchTap={this.submitNewEmail}/>
		    <MUITextField
					type="password"
					value={this.state.password}
					onChange={this.changePassword}
					hintText="Password"
					underlineShow={false}
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
		.set({Authorization: 'Bearer ' +utils.parseJwt()})
		.send({email: this.state.email})
		.end((err, response) => {
			
			if (err) throw err

			this.props.routerRef.navigate('/login-signup')
			this.props.restartSession()
		})
	},
	submitNewPassword: function () {
		
		Request
		.put(env.backend+ '/user/' +utils.parseJwtPayload().id+ '/password')
		.set({Authorization: 'Bearer ' +utils.parseJwt()})
		.send({password: this.state.password})
		.end((err, response) => {
			
			if (err) throw err
						
			this.props.routerRef.navigate('/login-signup')
			this.props.restartSession()
		})
	}
})