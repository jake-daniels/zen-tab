
export type Size = {
	width: number,
	height: number,
}

export type Position = {
	x: number,
	y: number,
}

export type Note = {
	id: string,
	created: string,
	updated: string,
	text: string,
	size: Size,
	position: Position,
}
