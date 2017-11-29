import * as React from 'react'

type TProps = {
	title: string,
	url: string,
	icon: string,
}

export default class BookmarkIcon extends React.PureComponent<TProps> {

	render () {
		const {title, url, icon} = this.props

		return (
			<div className='bookmark-icon' onClick={() => {window.location.href = url}}>
				<div className='bg'>
					<img className='image' src={icon} title={name}/>
				</div>
				<div className='title'> {title} </div>
			</div>
		)
	}
}
