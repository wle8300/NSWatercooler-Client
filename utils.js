const DeciferJwtPayload = require('jwt-decode')


module.exports = {
	parseJwt: function () {
		return JSON.parse(localStorage.Jwt).jwt
	},
	parseJwtPayload: function () {
		return localStorage.Jwt ? DeciferJwtPayload(JSON.parse(localStorage.Jwt).jwt) : null
	}
}