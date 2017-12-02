import * as React from 'react'

type TProps = any
type TState = {
	text: string,
}

export default class Note extends React.PureComponent<TProps, TState> {

	state: TState = {
		text: '',
	}

	componentDidMount () {
		this.setState({text: this.props.data})
	}

	onTextChanged = (e) => {
		this.setState({text: e.target.value})
	}

	onBlur = () => {
		this.props.onChange(this.state.text)
	}

	render () {
		const {data, onDelete} = this.props

		return (
			<div className='note' onBlur={this.onBlur}>
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
