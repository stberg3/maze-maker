
function showBox() {
	var grid = new Array(5)
	
	for(i=0; i<5; i++) {
		grid[i] = new Array(5)
		
		for(j=0; j<5; j++) {
			grid[i][j] = new GridBox(i,j,true, true, true, true);
		}		
	}

	backtrack(grid[0][1], grid);
}


function backtrack(box,grid) {	
	console.log(`[${box.col},${box.row}]`)

	grid[box.col][box.row].visited = true;
	grid[box.col][box.row].render();

	let offsets = [[0,1],[0,-1],[1,0],[-1,0]];
	let neighbors = offsets
		.map((offset) => [box.col+offset[0], box.row+offset[1]])
		.filter((newCoord) => {
			let okay = true;
			let newCol = newCoord[1];
			let newRow = newCoord[0];

			okay &&= newCol >= 0
			okay &&= newRow >= 0
			okay &&= newCol < grid.length
			okay &&= newRow < grid[0].length			

			return okay && !grid[newCol,newRow].visited;
		})
		.map((newCoord) => {
			let newCol = newCoord[0];
			let newRow = newCoord[1];
			return grid[newCol,newRow];
		});

	console.log(`BOX ${box}: (${neighbors.length}) ` + neighbors.join(';'))
	if(neighbors.length == 0) return;

	let neighbor = neighbors[Math.floor(Math.random(1)*neighbors.length)]
	console.log(`Joining ${box} to ${neighbor}`)
	console.log(`\t BOX ${box.row} ${box.col}`)
	console.log(`\t NEIGHBOR ${neighbor} ${neighbor.row} ${neighbor.col}`)
	box.join(neighbor);
	backtrack(neighbor, grid);
	
	return
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

	join(neighbor) {
		console.log(`We're joining ${neighbor} with ${this}`);
		console.log(`\t ${this.col}||${neighbor.col} ${this.row}||${neighbor.row}`);

		if(this.col < neighbor.col) {
			neighbor.l = false;
			this.r = false;
		} else if (neighbor.col < this.col) {
			neighbor.r = false;
			this.l = false;
		} else if(this.row < neighbor.row) {
			neighbor.t = false;
			this.b = false;
		} else if (neighbor.row < this.row) {
			neighbor.b = false;
			this.t = false;
		} else {
			console.error("Something is wrong with this relation");
		}

		this.render;
		neighbor.render;
	}

	toString() {
		return `[${this.col},${this.row}] ${this.visited ? 'visited' : 'unvisited'}`
	}

}