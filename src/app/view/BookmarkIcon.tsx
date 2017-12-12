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
			<div className='bookmark-icon'>
				<div className='bg'>
					<a href={url} title={name}>
						<img className='image' src={icon} title={name} alt={name}/>
					</a>
				</div>
			</div>
		)
	}
}
