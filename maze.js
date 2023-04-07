class Grid {
	constructor(rows, cols) {
		this.grid = new Array(rows);
		this.rows = rows;
		this.cols = cols;
		this.render();
	}

	render() {	
		for(let i=0; i<this.rows; i++) {
			this.grid[i] = new Array(this.cols)
			
			for(let j=0; j<this.cols; j++) {
				this.grid[i][j] = new GridBox(i, j, this.grid);
			}		
		}
	}

	makeMaze() {
		this.backtrack(this.grid[0][1]);
		// this.grid[1][1].join(this.grid[1][0])
	}


	backtrack(box) {
		if(box.visited) return;
		console.log(`[${box.col},${box.row}]`)

		box.visited = true;
		box.render();

		let neighbors = box.neighbors()

		if(neighbors.length == 0) return;

		let neighbor = neighbors[Math.floor(Math.random(1)*neighbors.length)]
		box.join(neighbor);
		this.backtrack(neighbor);
		
		return;
	}
}

class GridBox {
	w = 100;
	h = 100;
	g = 10;
	visited = false;
	westWall = true;
	northWall = true;
	eastWall = true;
	southWall = true;

	constructor(row,col,grid) {
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
		
		ctx.fillRect(this.w*this.col, this.h*this.row, this.w, this.h);
		ctx.fillStyle = 'black';

		if(this.westWall) {
			ctx.fillStyle = 'indianred';
			ctx.fillRect(this.h*this.col, this.w*this.row, this.g/4, this.h);
		}

		if(this.northWall) {
			ctx.fillStyle = 'blue';
			ctx.fillRect(this.w*this.col, this.h*this.row, this.w, this.g/4);
		}

		if(this.eastWall) {
			ctx.fillStyle = 'yellow';
			ctx.fillRect(this.w*(this.col+1), this.row*this.h, this.g/4, this.h);
		}

		if(this.southWall) {
			ctx.fillStyle = 'orange';
			ctx.fillRect(this.w*this.col, this.h*(this.row+1), this.w, this.g/4);
		}

	}

	join(neighbor) {
		let manhattan = Math.abs(neighbor.col-this.col) + Math.abs(neighbor.row-this.row);
		if(manhattan!= 1) {
			console.error(`Cannot join ${this} with ${neighbor} (Manhattan distance is ${manhattan} but it must be 1)`);
			return;
		}

		if(this.col < neighbor.col) {
			this.eastWall = false;
			neighbor.westWall = false;
		} else if (neighbor.col < this.col) {
			this.westWall = false;
			neighbor.eastWall = false;
		} else if(this.row < neighbor.row) {
			this.southWall = false;
			neighbor.northWall = false;
		} else if (neighbor.row < this.row) {
			this.northWall = false;
			neighbor.southWall = false;
		} else {
			console.error("Something is wrong with this relation");
		}

		this.render();
		neighbor.render();
		console.log(`Joined \n\t${this} with \n\t${neighbor}`)
		return neighbor;
	}

	toString() {
		return `[${this.row},${this.col}] ` + 
				 // `${this.visited ? 'visited' : 'unvisited'} ` +
				 `N: ${this.northWall ? 'X' : 'O'} ` + 
				 `E: ${this.eastWall ? 'X' : 'O'} ` + 
				 `S: ${this.southWall ? 'X' : 'O'} ` +
				 `W: ${this.northWall ? 'X' : 'O'}`
	}

}
