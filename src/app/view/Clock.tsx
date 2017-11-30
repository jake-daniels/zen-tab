
import * as React from 'react'
import Moment from 'moment'

const CHECK_INTERVAL = 1000

type TProps = any
type TState = any

export default class Clock extends React.PureComponent<TProps, TState> {

	state = {
		timerID: null,
		date: null,
		time: null,
	}

	componentDidMount () {
		const id = setInterval(this.setDateTime, CHECK_INTERVAL)
		this.setDateTime()
		this.setState({timerID: id})
	}

	componentWillUnmount () {
		clearInterval(this.state.timerID || 0)
	}

	setDateTime = () => {
		const date = Moment().format('MMM Do YYYY')
		const time = Moment().format('HH:mm')
		if (this.state.time !== time) {
			this.setState({date, time})
		}
	}

	render () {

		const {date, time} = this.state

		return (
			<div className='clock noselect'>
				<span className='time'>{time}</span>
				<span className='date'>{date}</span>
			</div>
		)
	}
}
