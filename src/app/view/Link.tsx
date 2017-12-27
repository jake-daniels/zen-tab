
import * as React from 'react'
import * as T from 'app/domain/Types'
import * as Utils from 'app/domain/utility/index'

interface TProps {
	link: T.Link,
	onDelete: Function,
	onTitleChange: Function,
}
interface TState {
	title: string,
}

export default class Link extends React.PureComponent<TProps, TState> {

	state: TState = {
		title: '',
	}

	constructor (props: TProps) {
		super(props)
		this.state.title = props.link.title
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
		const {link} = this.props
		const {title} = this.state

		return (
			<div className='link' onClick={this.onClicked}>
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
	}
}
