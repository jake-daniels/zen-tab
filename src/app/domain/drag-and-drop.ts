
import ReactDOM from 'react-dom'
import {DragSource, DropTarget} from 'react-dnd'


export const DraggableItems = {
	NOTE: Symbol('NOTE'),
}


export const NoteDragSource = () => {

	const source = {
		beginDrag: (props: any) => {
			return {id: props.note.id}
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
			const {id} = monitor.getItem()
			const offset = monitor.getSourceClientOffset()

			const clientRect: any = ReactDOM.findDOMNode(component).getBoundingClientRect()
			const position = {
				x: (offset.x - clientRect.x),
				y: (offset.y - clientRect.y),
			}

			props.updateNote(id, {position})
		}
	}
	const collect = (connect: any, monitor: any) => {
		return {
			connectDropTarget: connect.dropTarget(),
		}
	}

	return DropTarget(DraggableItems.NOTE, target, collect)
}
