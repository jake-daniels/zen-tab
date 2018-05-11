
export {}
import {classNames, chrome as devChrome, IChrome} from 'app/domain/utility'


declare global {
	function cn(classes: Object): string
	const chrome: IChrome
}

const _global = (window as any)
_global.cn = classNames

if (process.env.NODE_ENV === 'development') {
	_global.chrome = devChrome
}
