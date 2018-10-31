import React from 'react'
import {LinkDragSource, LinkDropTarget, EMPTY_IMAGE} from 'app/domain/drag-and-drop'

interface IProps {
	link: ILink,
	dragMode: boolean,
	onDelete: (id: string) => void,
	onEdit: (id: string) => void,

	showDropSpot: (source: ILink, position: number) => void,
	drop: () => void,
	connectDragSource?: (source: any) => any,
	connectDropTarget?: (target: any) => any,
	connectDragPreview?: (preview: any) => any,
	isDragging?: boolean,
}

@LinkDragSource()
@LinkDropTarget()
export default class Bookmark extends React.PureComponent<IProps> {

	public componentDidMount () {
		const {connectDragPreview} = this.props
		if (connectDragPreview) {
			connectDragPreview(EMPTY_IMAGE)
		}
	}

	private onClicked = () => {
		window.location.href = this.props.link.url
	}

	private onDeleteClicked = (e: React.MouseEvent<HTMLElement>) => {
		const {link, onDelete} = this.props
		onDelete(link.id)
		e.stopPropagation()
	}

	private onEditClicked = (e: React.MouseEvent<HTMLElement>) => {
		const {link, onEdit} = this.props
		onEdit(link.id)
		e.stopPropagation()
	}

	public render () {
		const {connectDragSource, connectDropTarget, isDragging} = this.props
		const {dragMode, link} = this.props

		if (!connectDragSource || !connectDropTarget) {
			return null
		}

		const icon = `https://www.google.com/s2/favicons?domain_url=${link.url}`

		const result = (
			<div
				className={cn('bookmark', {
					'dragging': isDragging,
					'drag-mode': dragMode,
				})}
				onClick={this.onClicked}
			>
				<img src={icon} />
				<span className='title no-wrap noselect'>{link.title}</span>
				<i
					className='fas fa-edit'
					aria-hidden={true}
					onClick={this.onEditClicked}
				/>
				<i
					className='fas fa-times'
					aria-hidden={true}
					onClick={this.onDeleteClicked}
				/>
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
export class BookmarkDropSpot extends React.PureComponent<any> {
	public render () {
		const {connectDropTarget, height} = this.props
		return connectDropTarget(
			<div className='drop-spot' style={{height}}>
				Drop here
			</div>
		)
	}
}
