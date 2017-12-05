import * as React from 'react'
import * as Utils from 'app/domain/utility'

type TProps = any

export default class Note extends React.PureComponent<TProps> {

	textArea: any = null

	inputChangedThrottled = Utils.throttle(this.props.onTextChange, 250)

	inputChanged = (e) => {
		const {note, onTextChange} = this.props
		this.inputChangedThrottled(note.id, e.target.value)
	}

	onMouseUp = (e) => {
		const {note, onSizeChange} = this.props
		let {width, height} = this.textArea.style
		width = Number(width.replace('px', ''))
		height = Number(height.replace('px', ''))

		onSizeChange(note.id, {width, height})
	}


	render () {
		const {note, onDelete} = this.props
		const {width, height} = note.size

		return (
			<div className='note'>
				<div className='header'>
					<i
						className='fa fa-times'
						aria-hidden={true}
						onClick={() => onDelete(note.id)}
					/>
				</div>
				<textarea
					className='text-area'
					ref={(c) => c && (this.textArea = c)}
					style={{width, height}}
					autoFocus={true}
					spellCheck={false}
					defaultValue={note.text}
					onChange={this.inputChanged}
					onMouseUp={this.onMouseUp}
				/>
			</div>
		)
	}
}
