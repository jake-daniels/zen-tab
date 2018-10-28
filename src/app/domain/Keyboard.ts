
enum EKeyboardEvent {
	CONTROL_DOWN = 'CONTROL_DOWN',
	CONTROL_UP = 'CONTROL_UP',
}

enum EKeyPress {
	DOWN = 'DOWN',
	UP = 'UP',
}

const KeyboardEvents = {

	[EKeyboardEvent.CONTROL_DOWN]: {
		trigger: EKeyPress.DOWN,
		isFired: (e: any) => {
			return (e.key === 'Control')
		}
	},

	[EKeyboardEvent.CONTROL_UP]: {
		trigger: EKeyPress.UP,
		isFired: (e: any) => {
			return (e.key === 'Control')
		}
	},

}

class KeyboardCore {

	callbacks = {}

	Events = EKeyboardEvent

	constructor () {
		Object.keys(KeyboardEvents).forEach((event) => {
			this.callbacks[event] = []
		})
		document.addEventListener('keydown', (e) => this.onKey(e, EKeyPress.DOWN), false)
		document.addEventListener('keyup', (e) => this.onKey(e, EKeyPress.UP), false)
	}

	onKey = (e: any, keyPress: EKeyPress) => {
		const events = Object.keys(KeyboardEvents)

		const relevantEvents = events.filter((event) => {
			const eventConfig = KeyboardEvents[event]
			return (eventConfig.trigger === keyPress)
		})

		relevantEvents.forEach((event) => {
			const eventConfig = KeyboardEvents[event]
			const isFired = eventConfig.isFired(e)
			if (isFired) {
				this.callbacks[event].forEach((callback: any) => callback())
			}
		})
	}

	subscribe = (event: EKeyboardEvent, callback: Function) => {
		this.callbacks[event].push(callback)
	}

	unsubscribe = (event: EKeyboardEvent, callback: Function) => {
		this.callbacks[event] = this.callbacks[event].filter((item: any) => (item !== callback))
	}
}

const Keyboard = new KeyboardCore()
export default Keyboard
