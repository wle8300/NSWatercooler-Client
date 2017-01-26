const DeciferJwtPayload = require('jwt-decode')


module.exports = {
	parseJwt: function () {
		return localStorage.Jwt ? JSON.parse(localStorage.Jwt).jwt : null
	},
	parseJwtPayload: function () {
		return localStorage.Jwt ? DeciferJwtPayload(JSON.parse(localStorage.Jwt).jwt) : null
	}
}