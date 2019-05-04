import React from 'react'
import { format } from 'date-fns'
import { ILink, IStore } from 'app/globals/interfaces'
import { EBookmarkType, EPanel } from 'app/globals/enums'

const TIMER_CHECK_INTERVAL = 1000

interface IState {
	date: string
	time: string
}

export default class Clock extends React.PureComponent<any, IState> {
	private timer: number = 0

	public state: IState = {
		date: '',
		time: '',
	}

	public componentDidMount() {
		this.timer = window.setInterval(this.setDateTime, TIMER_CHECK_INTERVAL)
		this.setDateTime()
	}

	public componentWillUnmount() {
		window.clearInterval(this.timer)
	}

	private setDateTime = () => {
		const date = format(new Date(), 'MMM Do YYYY')
		const time = format(new Date(), 'HH:mm')
		if (this.state.time !== time) {
			this.setState({ date, time })
		}
	}

	public render() {
		const { date, time } = this.state

		return (
			<div className='clock noselect'>
				<span className='time'> {time} </span>
				<span className='date'> {date} </span>
			</div>
		)
	}
}
