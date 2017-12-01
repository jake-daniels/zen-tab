import * as React from 'react'

type TProps = any
type TState = any

export default class Note extends React.PureComponent<TProps, TState> {

	state: TState = {
		text: null
	}

	componentDidMount () {
		this.setState({text: this.props.data})
	}

	onTextChanged = (e) => {
		this.setState({text: e.target.value})
	}

	render () {
		const {data, onDelete} = this.props

		return (
			<div className='note'>
				<div className='header'>
					<i className='fa fa-times' aria-hidden={true} onClick={onDelete}/>
				</div>
				<textarea
					className='text-area'
					autoFocus={true}
					spellCheck={false}
					onChange={this.onTextChanged}
					defaultValue={data}
				/>
			</div>
		)
	}
}
