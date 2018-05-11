
export function classNames(classes: Object): string {
	return Object.keys(classes)
		.reduce((result, key) => (classes[key]) ? `${result} ${key}` : result, '')
		.trim()
}
