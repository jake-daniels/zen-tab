
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
	text: string,
	size: Size,
	position?: Position,
}
