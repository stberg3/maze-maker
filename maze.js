class Grid {
	constructor(rows, cols) {
		this.grid = new Array(rows);
		this.rows = rows;
		this.cols = cols;
		this.visited = new Array(rows)
		for(let i =0; i < rows; i++) {
			this.visited[i] = new Array(cols);
			for(let j = 0; j < rows; j++) {
				this.visited[i][j] = false;
			}	
		}
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
		// this.backtrack(this.grid[0][0]);
		this.iterative_dfs();
	}

	iterative_dfs() {
		let box = this.grid[0][0];
		let stack = new Array();
		box.visited = true;
		this.visited[0][0] = true;
		stack.push(box);

		while(stack.length > 0) {
			let curr = stack.pop();
			let neighbors = curr.neighbors()
				.filter((n) => !this.visited[n.row][n.col]);

			if(neighbors.length > 0){
				let neighbor = neighbors[Math.floor(Math.random(1)*neighbors.length)]
				neighbor.visited = true;
				this.visited[neighbor.row][neighbor.col] = true;
				stack.push(curr);
				stack.push(neighbor);
				curr.join(neighbor)
			}
		}
	}

	backtrack(box) {
		this.visited[box.row][box.col] = true;
		box.visited = true
		box.render();

		let neighbors = box.neighbors().filter((n) => !this.visited[n.row][n.col]);

		while(neighbors.length > 0){

			let neighbor = neighbors[Math.floor(Math.random(1)*neighbors.length)]
			box.join(neighbor);
			this.backtrack(box.join(neighbor));
			neighbors = box.neighbors().filter((n) => !this.visited[n.row][n.col]);
		}
		
		return;
	}
}

class GridBox {
	w = 10;
	h = 10;
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
			.map((offset) => [this.row+offset[0], this.col+offset[1]])
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
			ctx.fillStyle = "#FF3333";
		} else {
			ctx.fillStyle = "#55FF55";
		}
		

		ctx.fillRect(this.w*this.col, this.h*this.row, this.w, this.h);
		ctx.fillStyle = 'black';
		ctx.lineWidth = 1;

		if(this.westWall) {
			ctx.strokeStyle = 'black';
			// ctx.fillRect(this.h*this.col, this.w*this.row, this.g/4, this.h);
			ctx.beginPath();
			ctx.moveTo(this.w*this.col, this.h*this.row);
			ctx.lineTo(this.w*this.col, this.h*(this.row+1));
			ctx.stroke(); 
		}

		if(this.northWall) {
			ctx.strokeStyle = 'black';
			ctx.beginPath();
			ctx.moveTo(this.w*this.col, this.h*this.row);
			ctx.lineTo(this.w*(this.col+1), this.h*this.row);
			ctx.stroke(); 
		}

		if(this.eastWall) {
			ctx.strokeStyle = 'black';
			ctx.beginPath();
			ctx.moveTo(this.w*(this.col+1), this.h*this.row);
			ctx.lineTo(this.w*(this.col+1), this.h*(this.row+1));
			ctx.stroke(); 
		}

		if(this.southWall) {
			ctx.strokeStyle = 'black';
			ctx.beginPath();
			ctx.moveTo(this.w*this.col, this.h*(this.row+1));
			ctx.lineTo(this.w*(this.col+1), this.h*(this.row+1));
			ctx.stroke(); 
		}

	}

	join(neighbor) {
		let manhattan = Math.abs(neighbor.col-this.col) + Math.abs(neighbor.row-this.row);
		if(manhattan!= 1) {
			console.error(`Cannot join ${this} with ${neighbor} (Manhattan distance is ${manhattan} but it must be 1)`);
			return this;
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
