
import React from 'react'
import ReactDOM from 'react-dom'


const getContextMenuId = (id: string) => `${id}_menu`

interface IPropsContextMenuTrigger {
	id: string,
	className?: string,
	children: any,
	onMenuActive: (position: any) => void,
}

export class ContextMenuTrigger extends React.PureComponent<IPropsContextMenuTrigger> {

	private menu: any = null

	private onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		const node = ReactDOM.findDOMNode(this.menu)
		const isTriggered = (e.target === node)

		if (!isTriggered) {
			return
		}

		e.preventDefault()

		const {x, y} = ((node as any).getBoundingClientRect() as any)
		const left = e.clientX - x
		const top = e.clientY - y

		this.setContextMenu(true, left, top)
		this.props.onMenuActive({x: left, y: top})
	}

	private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
		this.setContextMenu(false, 0, 0)
	}

	private setContextMenu = (isVisible: boolean, left: number, top: number) => {
		const {id} = this.props

		const contextMenuId = getContextMenuId(id)
		const menu = document.getElementById(contextMenuId) as any

		menu.style.display = (isVisible) ? 'block' : 'none'
		menu.style.left = `${left}px`
		menu.style.top = `${top}px`
	}

	public render () {
		const {children, id, className} = this.props

		if (React.Children.count(children) > 1) {
			console.error('Component ContextMenuTrigger must contain only 1 child element.')
			return null
		}

		const childWithRef = React.cloneElement((children as any), {
			ref: (c: any) => (c && (this.menu = c))
		})

		const style  = {
			position: 'relative',
			width: '100%',
			height: '100%',
		}

		return (
			<div
				id={id}
				style={style as any}
				className={`context-menu-trigger ${className}`}
				onContextMenu={this.onContextMenu}
				onClick={this.onClick}
			>
				{childWithRef}
			</div>
		)
	}
}

interface IPropsContextMenu {
	id: string,
	children: any,
	className?: string,
	onClick?: (e: any) => void,
}

export class ContextMenu extends React.PureComponent<IPropsContextMenu> {

	private itemClicked = (e: React.MouseEvent<HTMLDivElement>) => {
		const {id, onClick} = this.props

		const contextMenuId = getContextMenuId(id)
		const menu = document.getElementById(contextMenuId) as any

		menu.style.display = 'none'
		menu.style.left = '0px'
		menu.style.top = '0px'

		if (onClick) {
			onClick(e)
		}
	}

	public render () {
		const {children, id} = this.props

		const contextMenuId = getContextMenuId(id)

		const style = {
			display: 'none',
			position: 'absolute',
			left: 0,
			top: 0,
		}

		return (
			<div
				id={contextMenuId}
				style={style as any}
				onClick={this.itemClicked}
			>
				{children}
			</div>
		)
	}
}

interface IPropsMenuItem {
	children: any,
	className?: string,
	onClick?: (e: any) => void,
}

export class MenuItem extends React.PureComponent<IPropsMenuItem> {

	public render () {
		const {children, className, onClick} = this.props
		const style = {width: '100%', height: '100%'}

		return (
			<div
				className={`context-menu-item ${className}`}
				style={style as any}
				onClick={onClick}
			>
				{children}
			</div>
		)
	}
}
