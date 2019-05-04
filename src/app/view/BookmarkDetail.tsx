import React, { PureComponent } from 'react'
import { ILink, IStore } from 'app/globals/interfaces'
import { EBookmarkType, EPanel } from 'app/globals/enums'

interface IProps {
	bookmark: ILink
	onSave: (bookmark: ILink) => void
	onCancel: () => void
}

export default class BookmarkDetail extends PureComponent<IProps> {
	private titleRef = React.createRef<HTMLInputElement>()
	private urlRef = React.createRef<HTMLInputElement>()
	private faviconRef = React.createRef<HTMLInputElement>()

	private save = () => {
		const { bookmark, onSave } = this.props
		const title = this.titleRef.current!.value
		const url = this.urlRef.current!.value
		const useFavicon = this.faviconRef.current!.checked
		if (title !== '' && url !== '') {
			onSave({ ...bookmark, title, url, useFavicon })
		}
	}

	public render() {
		const { bookmark, onCancel } = this.props

		return (
			<div className='bookmark-detail'>
				<div className='backdrop'>
					<div className='modal'>
						<div className='line'>
							<span className='label'>Title</span>
							<input ref={this.titleRef} defaultValue={bookmark.title} autoFocus={true} />
						</div>

						<div className='line'>
							<span className='label'>URL</span>
							<input ref={this.urlRef} defaultValue={bookmark.url} />
						</div>

						<div className='line'>
							<label className='label checkbox'>
								<input ref={this.faviconRef} type='checkbox' defaultChecked={bookmark.useFavicon} />
								<span>Use favicon</span>
							</label>
							<button onClick={onCancel}>CANCEL</button>
							<button onClick={this.save}>SAVE</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
