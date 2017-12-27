
export interface Size {
	width: number,
	height: number,
}

export interface Position {
	x: number,
	y: number,
}

export interface Note {
	id: string,
	created: string,
	updated: string,
	text: string,
	size: Size,
	position: Position,
}

export interface Link {
	id: string,
	created: string,
	updated: string,
	title: string,
	url: string,
}
