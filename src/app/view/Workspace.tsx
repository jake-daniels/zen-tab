import * as React from 'react'
import Clock from 'app/view/Clock'

type TProps = any

export default class Workspace extends React.PureComponent<TProps> {

	render () {
		return (
			<div className='workspace'>
				<Clock/>
			</div>
		)
	}
}
