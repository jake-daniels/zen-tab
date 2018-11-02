import React from 'react'
import {LinkDragSource, LinkDropTarget, EMPTY_IMAGE} from 'app/domain/drag-and-drop'

interface IProps {
	dragMode: boolean,
	link: ILink,
	onDelete: (id: string) => void,

	showDropSpot: (source: ILink, position: number) => void,
	drop: () => void,
	connectDragSource?: (source: any) => any,
	connectDropTarget?: (target: any) => any,
	connectDragPreview?: (preview: any) => any,
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
			<a
				className={cn('link', {
					'dragging': isDragging,
					'drag-mode': dragMode,
				})}
				href={link.url}
			>
				<i
					className='fa fa-times'
					aria-hidden={true}
					onClick={this.onDeleteClicked}
				/>
				<span className='title no-wrap noselect'> {link.title} </span>
				<span className='url no-wrap noselect'> {link.url} </span>
			</a>
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
