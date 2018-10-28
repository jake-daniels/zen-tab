
import React from 'react'

import {LinkDragSource, LinkDropTarget, EMPTY_IMAGE} from 'app/domain/drag-and-drop'


interface IProps {
	dragMode: boolean,
	link: ILink,
	onDelete: Function,
	onTitleChange: Function,
	showDropSpot: Function,
	drop: Function,

	connectDragSource?: Function,
	connectDropTarget?: Function,
	connectDragPreview?: Function,
	isDragging?: boolean,
}
interface IState {
	title: string,
}

@LinkDragSource()
@LinkDropTarget()
export default class Link extends React.PureComponent<IProps, IState> {

	state: IState = {
		title: '',
	}

	constructor (props: IProps) {
		super(props)
		this.state.title = props.link.title
	}

	componentDidMount () {
		const {connectDragPreview} = this.props
		if (connectDragPreview) {
			connectDragPreview(EMPTY_IMAGE)
		}
	}

	componentWillReceiveProps (nexIProps: IProps) {
		const {title} = nexIProps.link
		if (this.state.title !== title) {
			this.setState({title})
		}
	}

	inputChanged = (e: any) => {
		const {link} = this.props
		this.setState({title: e.target.value})
	}

	onClicked = (e: any) => {
		window.open(this.props.link.url, '_blank')
	}

	linkDeleted = (e: any) => {
		const {link, onDelete} = this.props
		onDelete(link.id)
		e.stopPropagation()
	}

	render () {
		const {title} = this.state
		const {connectDragSource, connectDropTarget, isDragging} = this.props
		const {dragMode, link} = this.props

		if (!connectDragSource || !connectDropTarget) {
			return null
		}

		const result = (
			<div
				className={cn({
					'link': true,
					'dragging': isDragging,
					'drag-mode': dragMode,
				})}
				onClick={this.onClicked}
			>
				<i
					className='fa fa-times'
					aria-hidden={true}
					onClick={this.linkDeleted}
				/>
				<input
					className='title'
					value={title}
					onClick={(e) => e.stopPropagation()}
					onChange={this.inputChanged}
					spellCheck={false}
				/>
				<span className='url'> {link.url} </span>
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
	render () {
		const {connectDropTarget, height} = this.props

		return connectDropTarget(
			<div className='link-drop-spot' style={{height}}>
				Drop here
			</div>
		)
	}
}
