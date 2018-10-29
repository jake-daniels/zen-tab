import React from 'react'
import {LinkDragSource, LinkDropTarget, EMPTY_IMAGE} from 'app/domain/drag-and-drop'

interface IProps {
	dragMode: boolean,
	link: ILink,
	onDelete: Function,
	showDropSpot: Function,
	drop: Function,
	connectDragSource?: Function,
	connectDropTarget?: Function,
	connectDragPreview?: Function,
	isDragging?: boolean,
}

@LinkDragSource()
@LinkDropTarget()
export default class Link extends React.PureComponent<IProps> {

	public componentDidMount () {
		const {connectDragPreview} = this.props
		if (connectDragPreview) {
			connectDragPreview(EMPTY_IMAGE)
		}
	}

	private onClicked = () => {
		window.open(this.props.link.url, '_blank')
	}

	private onDeleteClicked = (e: React.MouseEvent<HTMLElement>) => {
		const {link, onDelete} = this.props
		onDelete(link.id)
		e.stopPropagation()
	}

	public render () {
		const {connectDragSource, connectDropTarget, isDragging} = this.props
		const {dragMode, link} = this.props

		if (!connectDragSource || !connectDropTarget) {
			return null
		}

		const result = (
			<div
				className={cn('link', {
					'dragging': isDragging,
					'drag-mode': dragMode,
				})}
				onClick={this.onClicked}
			>
				<i
					className='fa fa-times'
					aria-hidden={true}
					onClick={this.onDeleteClicked}
				/>
				<span className='title no-wrap'> {link.title} </span>
				<span className='url no-wrap'> {link.url} </span>
			</div>
		)

		if (dragMode) {
			return connectDropTarget(connectDragSource(result))
		} else {
			return result
		}
	}
}

@LinkDropTarget()
export class LinkDropSpot extends React.PureComponent<any> {
	public render () {
		const {connectDropTarget, height} = this.props
		return connectDropTarget(
			<div className='drop-spot' style={{height}}>
				Drop here
			</div>
		)
	}
}
