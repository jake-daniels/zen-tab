
import * as React from 'react'

import * as T from 'app/domain/Types'
import * as Utils from 'app/domain/utility/index'
import {LinkDragSource, LinkDropTarget, EMPTY_IMAGE} from 'app/domain/drag-and-drop'


interface TProps {
	dragMode: boolean,
	link: T.Link,
	onDelete: Function,
	onTitleChange: Function,
	showDropSpot: Function,
	drop: Function,

	connectDragSource?: Function,
	connectDropTarget?: Function,
	connectDragPreview?: Function,
	isDragging?: boolean,
}
interface TState {
	title: string,
}

@LinkDragSource()
@LinkDropTarget()
export default class Link extends React.PureComponent<TProps, TState> {

	state: TState = {
		title: '',
	}

	constructor (props: TProps) {
		super(props)
		this.state.title = props.link.title
	}

	componentDidMount () {
		const {connectDragPreview} = this.props
		if (connectDragPreview) {
			connectDragPreview(EMPTY_IMAGE)
		}
	}

	componentWillReceiveProps (nextProps: TProps) {
		const {title} = nextProps.link
		if (this.state.title !== title) {
			this.setState({title})
		}
	}

	inputChangedThrottled = Utils.throttle(this.props.onTitleChange, 250)
	inputChanged = (e) => {
		const {link} = this.props
		this.setState({title: e.target.value})
		this.inputChangedThrottled(link.id, e.target.value)
	}

	onClicked = (e) => {
		window.open(this.props.link.url, '_blank')
	}

	linkDeleted = (e) => {
		const {link, onDelete} = this.props
		onDelete(link.id)
		e.stopPropagation()
	}

	render () {
		const {title} = this.state
		const {connectDragSource, connectDropTarget, isDragging} = this.props	// DND
		const {dragMode, link} = this.props

		if (!connectDragSource || !connectDropTarget) {
			return null
		}

		const result = (
			<div
				className={`link ${(isDragging) ? 'dragging' : ''} ${(dragMode) ? 'drag-mode' : ''}`}
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
			return connectDropTarget(
				connectDragSource(
					result
				)
			)
		} else {
			return result
		}
	}
}
