
import * as React from 'react'
import ReactDOM from 'react-dom'
import {DragSource, DropTarget, DragLayer} from 'react-dnd'
import {getEmptyImage} from 'react-dnd-html5-backend'

export const DraggableItems = {
	NOTE: Symbol('NOTE'),
}

export const NoteDragSource = () => {

	const source = {
		beginDrag: (props: any) => {
			return {note: props.note}
		},
	}

	const collect = (connect: any, monitor: any) => {
		return {
			connectDragSource: connect.dragSource(),
			connectDragPreview: connect.dragPreview(),
			isDragging: monitor.isDragging(),
		}
	}

	return DragSource(DraggableItems.NOTE, source, collect)
}

export const NoteDropTarget = () => {

	const target = {
		drop: (props: any, monitor: any, component: any) => {
			const {note} = monitor.getItem()
			const offset = monitor.getSourceClientOffset()

			const clientRect: any = ReactDOM.findDOMNode(component).getBoundingClientRect()
			const position = {
				x: (offset.x - clientRect.x),
				y: (offset.y - clientRect.y),
			}

			props.updateNote(note.id, {position})
		}
	}
	const collect = (connect: any, monitor: any) => {
		return {
			connectDropTarget: connect.dropTarget(),
		}
	}

	return DropTarget(DraggableItems.NOTE, target, collect)
}

export const EMPTY_IMAGE = getEmptyImage()

@DragLayer((monitor) => ({
	item: monitor.getItem(),
	type: monitor.getItemType(),
	currentOffset: monitor.getSourceClientOffset(),
	isDragging: monitor.isDragging(),
}))
export class CustomDragLayer extends React.PureComponent<any> {

	getItemStyle = () => {
		const {currentOffset, item} = this.props
		const {width, height} = item.note.size

		if (!currentOffset) {
			return {
				display: 'none'
			}
		}

		const {x, y} = currentOffset
		const transform = `translate(${x}px, ${y}px)`

		return {
			width,
			height: height + 24,	// due to header
			transform: transform,
			WebkitTransform: transform,
		}
	}

	Item = () => {
		const {type} = this.props

		const itemStyle = this.getItemStyle()

		if (type === DraggableItems.NOTE) {
			return <div style={itemStyle} className='note-drag-preview'/>
		}

		return null
	}

	render () {
		const {isDragging} = this.props

		if (!isDragging) {
			return null
		}

		const layerStyle = {
			position: 'fixed',
			pointerEvents: 'none',
			zIndex: 100,
			left: 0,
			top: 0,
			width: '100%',
			height: '100%',
		}

		return (
			<div style={layerStyle as any}>
				<this.Item/>
			</div>
		)
	}
}
