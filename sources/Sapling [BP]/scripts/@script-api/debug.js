export default class Logger {
	// Logger properties
	static levels = {
		DEBUG: 0,
		INFO: 1,
		WARN: 2,
		ERROR: 3,
		EVENT: 4,
		DISABLED: 5
	};
	
	static colors = {
		'DEBUG': 'u',
		'INFO': 's',
		'WARN': 'p',
		'ERROR': 'm',
		'EVENT': '9',
		'TIMESTAMP': 'q'
	};
	
	static currentLevel = this.levels.DEBUG;
	
	// Logger methods
	static setLogLevel(level) {
		if (this.levels[level] === undefined) {
			this.log('ERROR', `Invalid log level: ${level}`, true);
		} else {
			this.currentLevel = this.levels[level];
			this.log('INFO', `Log level set to ${level}`, true);
		}
	}
	
	static log(level, message, passLevel = false) {
		const IsDisabled = (!passLevel && this.currentLevel === this.levels.DISABLED);

		if (IsDisabled) return;

		const timestamp = new Date().toISOString();
		const color = this.colors[level] || 'f';
		const formattedMessage = `§a[${timestamp}] §${color}[${level}]§r: ${message}`;
			
		console.warn(formattedMessage);
	}
	
	// Logs
	static debug = (message) => this.log('DEBUG', message);
	static info = (message) => this.log('INFO', message);
	static warn = (message) => this.log('WARN', message);
	static error = (message) => this.log('ERROR', message);
	static event = (event, details = {}) => this.log('EVENT', `${event}: ${JSON.stringify(details)}`);
}