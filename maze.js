class Grid {
	constructor(rows, cols) {
		this.grid = new Array(rows);
		this.rows = rows;
		this.cols = cols;
		this.render();
	}

	render() {	
		for(let i=0; i<this.rows; i++) {
			this.grid[i] = new Array(5)
			
			for(let j=0; j<this.cols; j++) {
				this.grid[i][j] = new GridBox(i, j, this.grid);
			}		
		}
	}

	makeMaze() {		
		backtrack(grid[0][1], grid);
	}


	backtrack(box, grid) {	
		console.log(`[${box.col},${box.row}]`)

		grid[box.row][box.col].visited = true;
		grid[box.row][box.col].render();

		let offsets = [[0,1],[0,-1],[1,0],[-1,0]];
		let neighbors = grid[box.row][box.col].neighbors()

		if(neighbors.length == 0) return;

		let neighbor = neighbors[Math.floor(Math.random(1)*neighbors.length)]
		box.join(neighbor);
		backtrack(neighbor, grid);
		
		return;
	}
}

class GridBox {
	w = 100;
	h = 100;
	g = 10;
	visited = false;

	constructor(row,col,grid) {
		this.l = true;
		this.t = true;
		this.r = true;
		this.b = true;
		this.row = row;
		this.col = col;
		this.grid = grid;
		this.render();
	}
	
	neighbors() {
		let offsets = [[0,1],[0,-1],[1,0],[-1,0]];
		let neighbors = offsets
			.map((offset) => [this.col+offset[0], this.row+offset[1]])
			.filter((newCoord) => {
				let isValid = true;
				let newCol = newCoord[1];
				let newRow = newCoord[0];

				isValid &&= 0 <= newRow && newRow < this.grid[0].length;		
				isValid &&= 0 <= newCol && newCol < this.grid[1].length;

				return isValid && !this.grid[newCol,newRow].visited;
			}).map((newCoord) => {
				let newRow = newCoord[0];
				let newCol = newCoord[1];
				return this.grid[newRow][newCol];
			});

		return neighbors;
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
