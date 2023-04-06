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
	var grid = new Array(5)
	for(i=0; i<5; i++) {
		grid[i] = new Array(5)
		for(j=0; j<5; j++) {
			grid[i][j] = new GridBox(i,j,true, true, true, true);
		}		
	}
}

class Maze {
	constructor(graph) {
		width = graph.reduce((a,b) => Math.max(a[1], b[1]));
		height = graph.reduce((a,b) => Math.max(a[0], b[0]));
	}
}

class GridBox {
	w = 100;
	h = 100;
	g = 10;
	visited = false;

	constructor(row,col,l,t,r,b) {
		this.l = l;
		this.t = t;
		this.r = r;
		this.b = b;
		this.row = row;
		this.col = col;
		this.render();
	}
	
	render() {
		const canvas = document.querySelector('canvas');
		const ctx = canvas.getContext('2d');
		if(this.visited) {
			ctx.fillStyle = 'red';
		} else {
			ctx.fillStyle = 'green';
		}
		
		ctx.fillRect(this.w*this.row, this.h*this.col, this.w, this.h);
		ctx.fillStyle = 'black';

		if(this.l) {
			ctx.fillRect(this.w*this.row, this.h*this.col, this.g/2, this.h);
		}

		if(this.t) {
			ctx.fillRect(this.w*this.row, this.h*this.col, this.w, this.g/2);
		}

		if(this.r) {
			ctx.fillRect(this.w*(this.row+1), this.h*this.col, this.g/2, this.h);
		}

		if(this.b) {
			ctx.fillRect(this.w*this.row, this.h*(this.col+1), this.w+this.g/2, this.g/2);
		}

	}


}