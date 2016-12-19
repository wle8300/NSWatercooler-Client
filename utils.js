const DeciferJwtPayload = require('jwt-decode')

const jwt = JSON.parse(localStorage.Jwt).jwt

module.exports = {
	jwt: jwt,
	jwtPayload: DeciferJwtPayload(jwt)
}