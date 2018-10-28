
import React from 'react'
import ReactDOM from 'react-dom'
import {DragSource, DropTarget, DragLayer} from 'react-dnd'
import {getEmptyImage} from 'react-dnd-html5-backend'

export const EMPTY_IMAGE = getEmptyImage()

export const DraggableItems = {
	LINK: Symbol('LINK'),
}

const getClientRect = (component: any) => {
	return (ReactDOM.findDOMNode(component) as any).getBoundingClientRect() as any
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

	const getDropSpotOrder = (sourceLink: any, targetLink: any, targetHoverPosition: string) => {
		if (sourceLink.order > targetLink.order) {
			if (targetHoverPosition === 'top') {
				return targetLink.order
			} else {
				return targetLink.order + 1
			}
		} else {
			if (targetHoverPosition === 'top') {
				return targetLink.order - 1
			} else {
				return targetLink.order
			}
		}
	}

	const spec = {
		hover: (props: any, monitor: any, component: any) => {
			if (props.isDropSpot) {
				return
			}

			const sourceItem = monitor.getItem()
			const linkRect = getClientRect(component)
			const linkVerticalMiddle = linkRect.height / 2
			const cursorY = monitor.getClientOffset().y - linkRect.top
			const targetHoverPosition = (cursorY < linkVerticalMiddle) ? 'top' : 'bottom'
			const dropSpotOrder = getDropSpotOrder(sourceItem.link, props.link, targetHoverPosition)

			props.showDropSpot(sourceItem, dropSpotOrder)
		},
		drop: (props: any) => props.drop(),
	}

	const collect = (connect: any, monitor: any) => {
		return {
			connectDropTarget: connect.dropTarget(),
		}
	}

	return DropTarget(DraggableItems.LINK, spec, collect)
}


const ITEM_PREVIEW_CONFIG = {

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
	monitor,
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
		// const {monitor} = this.props

		// console.log(this.props.currentOffset)
		// console.log(monitor.getSourceClientOffset())

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
