
import * as React from 'react'
import LinkifyIt from 'linkify-it'
import tlds from 'tlds'

const linkify = new LinkifyIt()
linkify.tlds(tlds)

interface TProps {
	className?: string,
	component?: any,
	properties?: Object,
	urlRegex?: Object,
	emailRegex?: Object,
}

export class Linkify extends React.PureComponent<any, TProps> {

	static MATCH = 'LINKIFY_MATCH'

	static defaultProps = {
		className: 'linkify',
		component: 'a',
		properties: {},
	}

	parseCounter: number = 0

	getMatches = (str: string) => {
		return linkify.match(str)
	}

	parseString = (str: string) => {
		let elements: Array<any> = []

		if (str === '') {
			return elements
		}

		const matches = this.getMatches(str)
		if (!matches) {
			return str
		}

		let lastIndex = 0
		matches.forEach((match, idx) => {
			// Push the preceding text if there is any
			if (match.index > lastIndex) {
				elements.push(str.substring(lastIndex, match.index))
			}
			// Shallow update values that specified the match
			let props = {
				href: match.url,
				key: `parse${this.parseCounter}match${idx}`,
			}

			if (this.props.properties !== undefined) {
				Object.keys(this.props.properties).forEach((key) => {
					if (this.props.properties !== undefined) {
						let val = this.props.properties[key]
						if (val === Linkify.MATCH) {
							val = match.url
						}

						props[key] = val
					}
				})
			}

			elements.push(React.createElement(
				this.props.component,
				props,
				match.text
			))
			lastIndex = match.lastIndex
		})

		if (lastIndex < str.length) {
			elements.push(str.substring(lastIndex))
		}

		return (elements.length === 1) ? elements[0] : elements
	}

	parse = (children: any) => {
		let parsed: any = children

		if (typeof children === 'string') {
			parsed = this.parseString(children)
		} else if (
			React.isValidElement(children) &&
			(children.type !== 'a') &&
			(children.type !== 'button')
		) {
			parsed = React.cloneElement(
				(children as any),
				{key: `parse${++this.parseCounter}`},
				this.parse((children.props as any).children)
			)
		} else if (children instanceof Array) {
			parsed = children.map(child => {
				return this.parse(child)
			})
		}

		return parsed
	}

	render () {
		const {children, className} = this.props

		this.parseCounter = 0

		const parsedChildren = this.parse(children)

		return (
			<span className={className}>
				{parsedChildren}
			</span>
		)
	}
}
