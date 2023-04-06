function maze() {
	let maze = [[0,0],[0,1],[1,1],[1,0]];
	return maze;
}

function showMaze(maze) {
	const canvas = document.querySelector('canvas');
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = 'green';
	// const w = 100
	// const h = 100
	// const g = 10
	// // maze.forEach(el => console.log(el))
	// for(let i=0; i<10; i++) {
	// 	for(let j=0; j<10; j++) {
	// 		let r = ctx.fillRect(g+(w+g)*i, g+(h+g)*j, w, h);
	// 		console.log("What's this?");
	// 	}	
	// }
}

function showBox() {
	var b = new GridBox(0,0,true, true, true, true);
	new GridBox(1,1,true, true, true, true);
}

class Maze {
	constructor(graph) {
		width = graph.reduce((a,b) => Math.max(a[1], b[1]));
		height = graph.reduce((a,b) => Math.max(a[0], b[0]));
	}
}

class GridBox {
	constructor(row,col,l,t,r,b) {
		this.l = l;
		this.t = t;
		this.r = r;
		this.b = b;

		const canvas = document.querySelector('canvas');
		const ctx = canvas.getContext('2d');
		const w = 100
		const h = 100
		const g = 10
		
		ctx.fillStyle = 'green';
		// ctx.fillRect(g, g, w, h);
		ctx.fillRect((w)*row, (h)*col, w, h);
		ctx.fillStyle = 'black';

		if(l) {
			ctx.fillRect((w)*row, (h)*col, g/2, h);
		}

		if(t) {
			ctx.fillRect((w)*row, (h)*col, w, g/2);
		}

		if(r) {
			ctx.fillRect(w+(w)*row, (h)*col, g/2, h);
		}

		if(b) {
			ctx.fillRect((w)*row, (h)*col+h, w+g/2, g/2);
		}
	}	

}