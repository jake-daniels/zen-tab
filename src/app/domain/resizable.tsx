import React from 'react'
import * as Actions from 'app/store/actions'
import { ILink, IStore } from 'app/globals/interfaces'
import { EBookmarkType, EPanel } from 'app/globals/enums'

interface IState {
	isDown: boolean
	position: number | null
}

export const resizable = (panel: EPanel) => (Component: any) => {
	return class extends React.Component<IState> {
		public state: IState = {
			isDown: false,
			position: null,
		}

		private handleMouseDown = () => {
			this.setState({ isDown: true })
		}

		private detectorMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
			this.setState({ position: e.clientX })
		}

		private detectorMouseUp = () => {
			if (this.state.isDown) {
				this.setState({ isDown: false, position: null })
			}
		}

		private detectorMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
			if (this.state.isDown) {
				const diff = e.clientX - this.state.position!
				Actions.changePanelWidth(panel, diff)
				this.setState({ position: e.clientX })
			}
		}

		public render() {
			return (
				<div className='resizable-box'>
					<Component {...this.props} />
					<div className='handle' onMouseDown={this.handleMouseDown} />
					<div
						className='detector'
						onMouseDown={this.detectorMouseDown}
						onMouseUp={this.detectorMouseUp}
						onMouseMove={this.detectorMouseMove}
					/>
				</div>
			)
		}
	} as any
}
