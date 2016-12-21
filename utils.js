const DeciferJwtPayload = require('jwt-decode')

const jwt = localStorage.Jwt ? JSON.parse(localStorage.Jwt).jwt : null

module.exports = {
	jwt: jwt,
	jwtPayload: jwt ? DeciferJwtPayload(jwt) : null
}