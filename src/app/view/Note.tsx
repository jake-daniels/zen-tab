
import * as React from 'react'

import * as Utils from 'app/domain/utility/index'
import * as T from 'app/domain/Types'
import {NoteDragSource} from 'app/domain/drag-and-drop'

interface TProps {
	note: T.Note,
	onTextChange: Function,
	onSizeChange: Function,
	onDelete: Function,

	connectDragSource?: Function,
	connectDragPreview?: Function,
	isDragging?: boolean,
}

interface TState {
	text: string,
	isEditing: boolean,
}


@NoteDragSource()
export default class Note extends React.PureComponent<TProps, TState> {

	state: TState = {
		text: '',
		isEditing: false,
	}

	constructor (props: TProps) {
		super(props)
		this.state.text = props.note.text
	}

	componentWillReceiveProps (nextProps: TProps) {
		const {text} = nextProps.note
		if (this.state.text !== text) {
			this.setState({text})
		}
	}

	textArea: any = null
	textPreview: any = null

	inputChangedThrottled = Utils.throttle(this.props.onTextChange, 250)
	inputChanged = (e) => {
		const {note} = this.props
		this.setState({text: e.target.value})
		this.inputChangedThrottled(note.id, e.target.value)
	}

	getCurrentSize = () => {
		const {isEditing} = this.state

		if (isEditing && this.textArea) {
			let {width, height} = this.textArea.style
			width = Number(width.replace('px', ''))
			height = Number(height.replace('px', ''))
			return {width, height}
		} else {
			let {width, height} = this.textPreview.style
			width = Number(width.replace('px', ''))
			height = Number(height.replace('px', ''))
			return {width, height}
		}
	}

	onMouseUp = (e) => {
		const {note, onSizeChange} = this.props

		const {width, height} = this.getCurrentSize()

		if (note.size.width !== width || note.size.height !== height) {
			onSizeChange(note.id, {width, height})
		} else {
			this.setState({isEditing: true}, () => this.textArea.focus())
		}
	}

	onTextAreaBlur = () => {
		this.setState({isEditing: false})
	}

	render () {
		const {connectDragSource, connectDragPreview, isDragging} = this.props	// DND
		const {note, onDelete} = this.props
		const {width, height} = note.size
		const {x, y} = note.position
		const {text, isEditing} = this.state

		if (!connectDragPreview || !connectDragSource) {
			return null
		}

		const linkProps = {
			target: '_blank',
			onMouseUp: (e) => {
				e.stopPropagation()
			},
		}

		return connectDragPreview(
			<div
				className={`note ${(isDragging) ? 'dragging' : ''}`}
				style={{left: x, top: y}}
			>

				{connectDragSource(
					<div className='header'>
						<i
							className='fa fa-times'
							aria-hidden={true}
							onClick={() => onDelete(note.id)}
						/>
					</div>
				)}

				{(isEditing) && (
						<textarea
							className='text-area'
							ref={(c) => c && (this.textArea = c)}
							style={{width, height}}
							spellCheck={false}
							value={text}
							onChange={this.inputChanged}
							onMouseUp={this.onMouseUp}
							onBlur={this.onTextAreaBlur}
						/>
				)}

				{(!isEditing) && (
					<Utils.Linkify properties={linkProps}>
						<div
							className='text-preview'
							ref={(c) => c && (this.textPreview = c)}
							style={{width, height}}
							spellCheck={false}
							onMouseUp={this.onMouseUp}
						>
							{text}
						</div>
					</Utils.Linkify>
				)}

			</div>
		)
	}
}
