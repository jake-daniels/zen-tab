import React from 'react'
import { LinkDragSource, LinkDropTarget, EMPTY_IMAGE } from 'app/domain/drag-and-drop'
import URI from 'urijs'
import cn from 'classnames'
import { ILink, IStore } from 'app/globals/interfaces'
import { EBookmarkType, EPanel } from 'app/globals/enums'
import { ReactComponent as Edit } from 'img/edit.svg'
import { ReactComponent as Times } from 'img/times.svg'

interface IProps {
	link: ILink
	dragMode: boolean
	onDelete: (id: string) => void
	onEdit: (id: string) => void

	showDropSpot: (source: ILink, position: number) => void
	drop: () => void
	connectDragSource?: (source: any) => any
	connectDropTarget?: (target: any) => any
	connectDragPreview?: (preview: any) => any
	isDragging?: boolean
}

@LinkDragSource()
@LinkDropTarget()
export default class Bookmark extends React.PureComponent<IProps> {
	public componentDidMount() {
		const { connectDragPreview } = this.props
		if (connectDragPreview) {
			connectDragPreview(EMPTY_IMAGE)
		}
	}

	private onDeleteClicked = (e: React.MouseEvent<HTMLElement>) => {
		const { link, onDelete } = this.props
		onDelete(link.id)
		e.preventDefault()
		e.stopPropagation()
	}

	private onEditClicked = (e: React.MouseEvent<HTMLElement>) => {
		const { link, onEdit } = this.props
		onEdit(link.id)
		e.preventDefault()
		e.stopPropagation()
	}

	public render() {
		const { connectDragSource, connectDropTarget, isDragging } = this.props
		const { dragMode, link } = this.props

		if (!connectDragSource || !connectDropTarget) {
			return null
		}

		const icon = link.useFavicon
			? `${new URI(link.url).origin()}/favicon.ico`
			: `https://www.google.com/s2/favicons?domain_url=${link.url}`

		const result = (
			<a
				className={cn('bookmark', {
					dragging: isDragging,
					'drag-mode': dragMode,
				})}
				href={link.url}
			>
				<img src={icon} />
				<span className='title no-wrap noselect'>{link.title}</span>
				<div className='fas' onClick={this.onEditClicked}>
					<Edit width={18} height={18} />
				</div>
				<div className='fas' onClick={this.onDeleteClicked}>
					<Times width={18} height={18} />
				</div>
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
export class BookmarkDropSpot extends React.PureComponent<any> {
	public render() {
		const { connectDropTarget, height } = this.props
		return connectDropTarget(
			<div className='drop-spot' style={{ height }}>
				Drop here
			</div>,
		)
	}
}
