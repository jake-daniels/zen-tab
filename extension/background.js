
// Constants

const APP_TMP_STORE_LS_KEY = 'zen-tab-tmp'
const MESSAGE_SAVE_LINK = 'MESSAGE_SAVE_LINK'
const MESSAGE_SHOW_MODAL = 'MESSAGE_SHOW_MODAL'

const ECommand = {
	SAVE_LINK_COMMAND: 'save-link-command',
}

const CommandConfig = {
	[ECommand.SAVE_LINK_COMMAND]: {
		execute: () => {
			chrome.tabs.query({active: true}, (tabs) => {
				const {id, title, url} = tabs[0]
				saveLink({title, url})
			})
			const initModal = `
					document.getElementById('zenTabConfirmationModal').style.opacity = 1
					document.getElementById('zenTabConfirmationModal').style.transition = 'opacity 0.5s'
					window.setTimeout(function() {
						document.getElementById('zenTabConfirmationModal').style.opacity = 0
					}, 3000)
				`
			chrome.tabs.executeScript({code: initModal})
		}
	}
	// [ECommand.SAVE_LINK_COMMAND]: {
	// 	execute: () => {
	// 		chrome.tabs.query({active: true}, (tabs) => {
	// 			const {id, title, url} = tabs[0]
	// 			const initModal = `
	// 				document.getElementById('zenTabSaveLinkModal').style.display = 'block'
	// 				document.getElementById('zenTabSaveLinkModalTitleInput').value = \`${title}\`
	// 				document.getElementById('zenTabSaveLinkModalUrlInput').value = \`${url}\`
	// 			`
	// 			chrome.tabs.executeScript({code: initModal})

	// 			const message = {
	// 				type: MESSAGE_SHOW_MODAL,
	// 				payload: {isVisible: true},
	// 			}
	// 			chrome.tabs.sendMessage(id, message)
	// 		})
	// 	}
	// }
}


// Chrome API

chrome.commands.onCommand.addListener(function (command) {
	if (Object.keys(CommandConfig).includes(command)) {
		CommandConfig[command].execute()
	} else {
		console.warn('Unknown event received: ', command)
	}
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request && request.type === MESSAGE_SAVE_LINK) {
		saveLink(request.payload)
	}
})

// Functions

function saveLink ({title, url}) {
	const tmpStoreEncoded = localStorage.getItem(APP_TMP_STORE_LS_KEY)
	const tmpStore = (tmpStoreEncoded) ? JSON.parse(tmpStoreEncoded) : {}

	if (Array.isArray(tmpStore.linksToSave)) {
		tmpStore.linksToSave.push({title, url})
	} else {
		tmpStore.linksToSave = [{title, url}]
	}

	localStorage.setItem(APP_TMP_STORE_LS_KEY, JSON.stringify(tmpStore))
}

