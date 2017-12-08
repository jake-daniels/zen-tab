
import * as React from 'react'
import {DragSource} from 'react-dnd'

import {DraggableItems} from 'app/domain/drag-and-drop'
import * as Utils from 'app/domain/utility'

type TProps = any

const dragSource = {
	beginDrag: (props: TProps) => {
		return {id: props.note.id}
	},
}
const collect = (dndConnect: any, monitor: any) => {
	return {
		connectDragSource: dndConnect.dragSource(),
		connectDragPreview: dndConnect.dragPreview(),
		isDragging: monitor.isDragging(),
	}
}
@DragSource(DraggableItems.NOTE, dragSource, collect)
export default class Note extends React.PureComponent<TProps> {

	state = {text: ''}

	constructor (props: TProps) {
		super(props)
		this.state = {text: props.note.text}
	}

	componentWillReceiveProps (nextProps: TProps) {
		if (this.state.text !== nextProps.note.text) {
			this.setState({text: nextProps.note.text})
		}
	}

	textArea: any = null

	inputChangedThrottled = Utils.throttle(this.props.onTextChange, 250)

	inputChanged = (e) => {
		const {note, onTextChange} = this.props
		this.setState({text: e.target.value})
		this.inputChangedThrottled(note.id, e.target.value)
	}

	onMouseUp = (e) => {
		const {note, onSizeChange} = this.props

		let {width, height} = this.textArea.style
		width = Number(width.replace('px', ''))
		height = Number(height.replace('px', ''))

		if (note.size.width !== width || note.size.height !== height) {
			onSizeChange(note.id, {width, height})
		}
	}

	render () {
		const {connectDragSource, connectDragPreview, isDragging} = this.props	// DND
		const {note, index, onDelete} = this.props
		const {width = 0, height = 0} = note.size || {}
		const {x = 20, y = 20} = note.position || {}

		return connectDragPreview(
			<div className={`note ${(isDragging) ? 'dragging' : ''}`} style={{left: x, top: y}}>

				{connectDragSource(
					<div className='header'>
						<i
							className='fa fa-times'
							aria-hidden={true}
							onClick={() => onDelete(note.id)}
						/>
					</div>
				)}

				<textarea
					className='text-area'
					ref={(c) => c && (this.textArea = c)}
					style={{width, height}}
					spellCheck={false}
					value={this.state.text}
					onChange={this.inputChanged}
					onMouseUp={this.onMouseUp}
				/>

			</div>
		)
	}
}
