
import React from 'react'

interface IProps {
	title: string,
	url: string,
	icon: string,
}

export default class BookmarkIcon extends React.PureComponent<IProps> {

	render () {
		const {title, url, icon} = this.props

		return (
			<div className='bookmark-icon'>
				<div className='bg'>
					<a href={url} title={title}>
						<img className='image' src={icon} title={title} alt={title}/>
					</a>
				</div>
			</div>
		)
	}
}
