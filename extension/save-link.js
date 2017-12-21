
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

const onCancel = () => {
	document.getElementById('zenTabSaveLinkModal').style.display = 'none'
}

const onSave = () => {
	document.getElementById('zenTabSaveLinkModal').style.display = 'none'

	const title = document.getElementById('zenTabSaveLinkModalTitleInput').value
	const url = document.getElementById('zenTabSaveLinkModalUrlInput').value
	const message = {
		type: 'SAVE_LINK',
		payload: {title, url},
	}
	chrome.runtime.sendMessage(message)
}

document
	.getElementById('zenTabSaveLinkModalCancelButton')
	.addEventListener('click', onCancel)

document
	.getElementById('zenTabSaveLinkModalSaveButton')
	.addEventListener('click', onSave)
