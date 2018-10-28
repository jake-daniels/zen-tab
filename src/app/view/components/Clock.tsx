
import React from 'react'
import Moment from 'moment'

const TIMER_CHECK_INTERVAL = 1000

interface IState {
	date: string,
	time: string,
}

export default class Clock extends React.PureComponent<any, IState> {

	timer: number = 0

	state: IState = {
		date: '',
		time: '',
	}

	componentDidMount () {
		this.timer = window.setInterval(this.setDateTime, TIMER_CHECK_INTERVAL)
		this.setDateTime()
	}

	componentWillUnmount () {
		window.clearInterval(this.timer)
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
				<span className='time'> {time} </span>
				<span className='date'> {date} </span>
			</div>
		)
	}
}
