
import * as React from 'react'
import ReactDOM from 'react-dom'
import {DragSource, DropTarget, DragLayer} from 'react-dnd'
import {getEmptyImage} from 'react-dnd-html5-backend'

export const EMPTY_IMAGE = getEmptyImage()

export const DraggableItems = {
	NOTE: Symbol('NOTE'),
	LINK: Symbol('LINK'),
}

const getClientRect = (component: any) => {
	return ReactDOM.findDOMNode(component).getBoundingClientRect() as any
}

export const NoteDragSource = () => {

	const spec = {
		beginDrag: (props: any, monitor: any, component: any) => {
			const clientRect = getClientRect(component)
			return {note: props.note, clientRect}
		},
		// canDrag: (props: any, monitor: any) => {

		// },
	}

	const collect = (connect: any, monitor: any) => {
		return {
			connectDragSource: connect.dragSource(),
			connectDragPreview: connect.dragPreview(),
			isDragging: monitor.isDragging(),
		}
	}

	return DragSource(DraggableItems.NOTE, spec, collect)
}

export const NoteDropTarget = () => {

	const spec = {
		drop: (props: any, monitor: any, component: any) => {
			const {id} = monitor.getItem().note
			const offset = monitor.getSourceClientOffset()

			const clientRect = getClientRect(component)
			const position = {
				x: (offset.x - clientRect.x),
				y: (offset.y - clientRect.y),
			}

			props.updateNote(id, {position})
		},
	}
	const collect = (connect: any, monitor: any) => {
		return {
			connectDropTarget: connect.dropTarget(),
		}
	}

	return DropTarget(DraggableItems.NOTE, spec, collect)
}

export const LinkDragSource = () => {

	const spec = {
		beginDrag: (props: any, monitor: any, component: any) => {
			const clientRect = getClientRect(component)
			return {link: props.link, clientRect}
		},
	}

	const collect = (connect: any, monitor: any) => {
		return {
			connectDragSource: connect.dragSource(),
			connectDragPreview: connect.dragPreview(),
			isDragging: monitor.isDragging(),
		}
	}

	return DragSource(DraggableItems.LINK, spec, collect)
}

export const LinkDropTarget = () => {

	const spec = {
		hover: (props: any, monitor: any, component: any) => {

			if (props.isDropSpot) {
				return
			}

			const clientRect = getClientRect(component)
			const clientRectMiddleY = clientRect.height / 2
			const cursorY = monitor.getClientOffset().y - clientRect.top

			const sourceLinkOrder = monitor.getItem().link.order

			let dropSpotPosition

			if (sourceLinkOrder > props.link.order) {
				dropSpotPosition = (cursorY < clientRectMiddleY)
					? props.link.order
					: props.link.order + 1
			} else {
				dropSpotPosition = (cursorY < clientRectMiddleY)
					? props.link.order - 1
					: props.link.order
			}

			const sourceLinkClientRect = monitor.getItem().clientRect

			props.showDropSpot(dropSpotPosition, sourceLinkClientRect, sourceLinkOrder)
		},
		drop: (props: any, monitor: any, component: any) => {
			const sourceLink = monitor.getItem().link
			props.drop(sourceLink)
		},
	}
	const collect = (connect: any, monitor: any) => {
		return {
			connectDropTarget: connect.dropTarget(),
		}
	}

	return DropTarget(DraggableItems.LINK, spec, collect)
}


const ITEM_PREVIEW_CONFIG = {

	[DraggableItems.NOTE]: {
		className: 'note-drag-preview',
		getStyle: (clientRect: any, currentOffset: any) => {
			const {width, height} = clientRect
			const {x, y} = currentOffset
			const transform = `translate(${x}px, ${y}px)`
			return {width, height, transform}
		},
	},

	[DraggableItems.LINK]: {
		className: 'link-drag-preview',
		getStyle: (clientRect: any, currentOffset: any) => {
			const {width, height, left} = clientRect
			const {y} = currentOffset
			const transform = `translate(${0}px, ${y}px)`
			return {width, height, left, transform}
		},
	},

}

@DragLayer((monitor) => ({
	item: monitor.getItem(),
	type: monitor.getItemType(),
	currentOffset: monitor.getSourceClientOffset(),
	isDragging: monitor.isDragging(),
}))
export class CustomDragLayer extends React.PureComponent<any> {

	Item = () => {
		const {type, item, currentOffset} = this.props

		let itemProps = {}

		if (currentOffset) {
			const config = ITEM_PREVIEW_CONFIG[type]
			const style = config.getStyle(item.clientRect, currentOffset)
			const className = config.className
			itemProps = {style, className}
		} else {
			itemProps = {
				style: {display: 'none'},
				className: '',
			}
		}

		return <div {...itemProps}/>
	}

	render () {
		const {isDragging} = this.props

		// console.log(this.props.currentOffset)

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
