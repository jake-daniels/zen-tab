
export {}

import classnames from 'classnames'
import Mousetrap from 'mousetrap'

Mousetrap.prototype.stopCallback = () => false

declare global {
	function cn (...args: any[]): string
	function mousetrap(): MousetrapStatic
}

const GLOBAL = (window as any)
GLOBAL.cn = classnames
