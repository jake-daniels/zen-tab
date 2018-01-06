
const content = `
	<div class='backdrop'>
		<div class='modal'>
			<div class='line'>
				<span class='label'> Title </span>
				<input type='text' id='zenTabSaveLinkModalTitleInput' spellcheck='false'/>
			</div>
			<div class='line'>
				<span class='label'> URL </span>
				<input type='text' id='zenTabSaveLinkModalUrlInput' spellcheck='false'/>
			</div>
			<div class='line footer'>
				<button id='zenTabSaveLinkModalCancelButton' class='cancel-button'> Cancel </button>
				<button id='zenTabSaveLinkModalSaveButton' class='save-button'> Save </button>
			</div>
		</div>
	</div>
`

const modal = document.createElement('div')
modal.setAttribute('id', 'zenTabSaveLinkModal')
modal.setAttribute('class', 'save-link-modal')
modal.innerHTML = content
document.body.appendChild(modal)



const MESSAGE_SAVE_LINK = 'MESSAGE_SAVE_LINK'
const MESSAGE_SHOW_MODAL = 'MESSAGE_SHOW_MODAL'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request && request.type === MESSAGE_SHOW_MODAL) {
		document.addEventListener('keypress', onKeyPress)
	}
})

function closeModal () {
	document.getElementById('zenTabSaveLinkModal').style.display = 'none'
	document.removeEventListener('keypress', onKeyPress)
}

function sendLinkToBackgroundPage () {
	const title = document.getElementById('zenTabSaveLinkModalTitleInput').value
	const url = document.getElementById('zenTabSaveLinkModalUrlInput').value
	const message = {
		type: MESSAGE_SAVE_LINK,
		payload: {title, url},
	}

	chrome.runtime.sendMessage(message)

	closeModal()
}

function onKeyPress (e) {
	const isVisible = (document.getElementById('zenTabSaveLinkModal').style.display === 'block')
	const enterPressed = (e.key === 'Enter')
	if (isVisible && enterPressed) {
		sendLinkToBackgroundPage()
	}
}

document
	.getElementById('zenTabSaveLinkModalCancelButton')
	.addEventListener('click', closeModal)

document
	.getElementById('zenTabSaveLinkModalSaveButton')
	.addEventListener('click', sendLinkToBackgroundPage)

