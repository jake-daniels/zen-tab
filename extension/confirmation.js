
const content = `
	<div class='zen-tab-confirmation-modal-content'>
		<span class='text'>The link is saved!</span>
		<div class='checkmark'></div>
	</div>
`

const modal = document.createElement('div')
modal.setAttribute('id', 'zenTabConfirmationModal')
modal.setAttribute('class', 'zen-tab-confirmation-modal')
modal.innerHTML = content
document.body.appendChild(modal)
