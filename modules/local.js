module.exports = () => {
	return (req, res, next) => {
		req.app.locals.user = req.session && req.session.user || {};
		next();
	}
}