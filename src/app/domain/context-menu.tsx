
import * as React from 'react'
import ReactDOM from 'react-dom'


const getContextMenuId = (id: string) => `${id}_menu`

interface TPropsContextMenuTrigger {
	id: string,
	className?: string,
	children: any,
}

export class ContextMenuTrigger extends React.PureComponent<TPropsContextMenuTrigger> {

	menu: any = null

	onContextMenu = (e) => {
		const node = ReactDOM.findDOMNode(this.menu)
		const isTriggered = (e.target === node)

		if (!isTriggered) {
			return
		}

		e.preventDefault()

		const {x, y} = (node.getBoundingClientRect() as any)
		const left = e.clientX - x
		const top = e.clientY - y

		this.setContextMenu(true, left, top)
	}

	onClick = (e) => {
		this.setContextMenu(false, 0, 0)
	}

	setContextMenu = (isVisible: boolean, left: number, top: number) => {
		const {id} = this.props

		const contextMenuId = getContextMenuId(id)
		const menu = document.getElementById(contextMenuId) as any

		menu.style.display = (isVisible) ? 'block' : 'none'
		menu.style.left = `${left}px`
		menu.style.top = `${top}px`
	}

	render () {
		const {children, id, className} = this.props

		if (React.Children.count(children) > 1) {
			console.error('Component ContextMenuTrigger must contain only 1 child element.')
			return null
		}

		const childWithRef = React.cloneElement((children as any), {
			ref: (c) => (c && (this.menu = c))
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

interface TPropsContextMenu {
	id: string,
	children: any,
	className?: string,
	onClick?: (e: any) => void,
}

export class ContextMenu extends React.PureComponent<TPropsContextMenu> {

	itemClicked = (e) => {
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

	render () {
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

interface TPropsMenuItem {
	children: any,
	className?: string,
	onClick?: (e: any) => void,
}

export class MenuItem extends React.PureComponent<TPropsMenuItem> {

	render () {
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
