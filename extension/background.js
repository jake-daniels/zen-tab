
const APP_TMP_STORE_LS_KEY = 'zen-tab-tmp'

chrome.commands.onCommand.addListener(function (command) {
	if (command === 'save-link-event') {
		chrome.tabs.query({active: true}, (tabs) => {
			const title = tabs[0].title
			const url = tabs[0].url
			const initModal = `
				document.getElementById('zenTabSaveLinkModal').style.display = 'block'
				document.getElementById('zenTabSaveLinkModalTitleInput').value = '${title}'
				document.getElementById('zenTabSaveLinkModalUrlInput').value = '${url}'
			`
			chrome.tabs.executeScript({code: initModal})
		})
	} else {
		console.warn('Unknown event received: ', command)
	}
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request && request.type === 'SAVE_LINK') {
		saveLink(request.payload)
	}
})

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

