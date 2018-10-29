import React, {PureComponent} from 'react'

interface IProps {
	bookmark: ILink,
	onSave: (bookmark: ILink) => void,
	onCancel: () => void,
}

export default class BookmarkDetail extends PureComponent<IProps> {

	private titleRef = React.createRef<HTMLInputElement>()
	private urlRef = React.createRef<HTMLInputElement>()

	private save = () => {
		const {bookmark, onSave} = this.props
		const title = this.titleRef.current!.value
		const url = this.urlRef.current!.value
		if (title !== '' && url !== '') {
			onSave({...bookmark, title, url})
		}
	}

	public render () {
		const {bookmark, onCancel} = this.props

		return (
			<div className='bookmark-detail'>
				<div className='backdrop'>
					<div className='modal'>

						<div className='line'>
							<span className='label'>Title</span>
							<input ref={this.titleRef} defaultValue={bookmark.title} autoFocus={true}/>
						</div>

						<div className='line'>
							<span className='label'>URL</span>
							<input ref={this.urlRef} defaultValue={bookmark.url} />
						</div>

						<div className='line'>
							<button onClick={onCancel}>CANCEL</button>
							<button onClick={this.save}>SAVE</button>
						</div>

					</div>
				</div>
			</div>
		)
	}
}
