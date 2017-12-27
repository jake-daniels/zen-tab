
import * as React from 'react'
import Moment from 'moment'

const CHECK_INTERVAL = 1000

interface TState {
	timerID: number | null,
	date: string,
	time: string,
}

export default class Clock extends React.PureComponent<any, TState> {

	state: TState = {
		timerID: null,
		date: '',
		time: '',
	}

	componentDidMount () {
		const id = window.setInterval(this.setDateTime, CHECK_INTERVAL)
		this.setDateTime()
		this.setState({timerID: id})
	}

	componentWillUnmount () {
		if (this.state.timerID) {
			window.clearInterval(this.state.timerID)
		}
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
