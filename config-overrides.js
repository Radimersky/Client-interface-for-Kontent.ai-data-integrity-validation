module.exports = function override(config, env) {
	console.log('Config overriden');
	const fallback = config.resolve.fallback || {};

	Object.assign(fallback, {
		crypto: false,
		stream: false,
	})

    config.resolve.fallback = fallback;
	
	return config;
};