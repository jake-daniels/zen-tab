
enum EKeyboardEvent {
	SHIFT_DOWN = 'SHIFT_DOWN',
	SHIFT_UP = 'SHIFT_UP',
}

enum EKeyPress {
	DOWN = 'DOWN',
	UP = 'UP',
}

const KeyboardEvents = {
	[EKeyboardEvent.SHIFT_DOWN]: {
		trigger: EKeyPress.DOWN,
		isFired: (e: any) => {
			return (e.key === 'Shift')
		}
	},
	[EKeyboardEvent.SHIFT_UP]: {
		trigger: EKeyPress.UP,
		isFired: (e: any) => {
			return (e.key === 'Shift')
		}
	},
}

class KeyboardCore {

	private callbacks = {}

	public Events = EKeyboardEvent

	public constructor () {
		Object.keys(KeyboardEvents).forEach((event) => {
			this.callbacks[event] = []
		})
		document.addEventListener('keydown', (e) => this.onKey(e, EKeyPress.DOWN), false)
		document.addEventListener('keyup', (e) => this.onKey(e, EKeyPress.UP), false)
	}

	private onKey = (e: any, keyPress: EKeyPress) => {
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

	public subscribe = (event: EKeyboardEvent, callback: any) => {
		this.callbacks[event].push(callback)
	}

	public unsubscribe = (event: EKeyboardEvent, callback: any) => {
		this.callbacks[event] = this.callbacks[event].filter((item: any) => (item !== callback))
	}
}

const Keyboard = new KeyboardCore()
export default Keyboard
