const VISITED = 0;
const SEARCHED = 1;
const START = 2;
const END = 3;
const PATH = 4;
const NEW = 5;
const delay = ms => new Promise(res => setTimeout(res, ms));

class Grid {
	constructor(rows, cols) {
		this.grid = new Array(rows);
		this.rows = rows;
		this.cols = cols;
		this.graph = new Map();		
		this.visited = new Array(rows)
		for(let i =0; i < rows; i++) {
			this.visited[i] = new Array(cols);
			this.visited[i].fill(false)
			for(let j = 0; j < rows; j++) {
				this.graph.set(`${i},${j}`, []);
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
		this.iterativeDfs();
		this.solveMaze();
	}

	renderPath(end) {
		while(end != null) {
			end.status = PATH;
			end.render();
			end = end.pred;
		}
	}

	

	async solveMaze() {
		let searched = new Set()
		let q = [this.grid[0][0]];

		while(q.length > 0) {
			await delay(25);

			let probe = q.shift();
			probe.status = SEARCHED;
			probe.render();
			searched.add(probe.getKey(), true);
			
			if(probe.row == this.grid.length - 1 && probe.col == this.grid[0].length - 1) {
				this.grid[0][0].status = START;
				this.grid[0][0].render();
				probe.status = END;
				probe.render();
				console.log("We found the end!");
				return Promise.resolve(probe);
			}

			let neighbors = this.graph.get(probe.getKey())
				.filter((box) => !searched.has(box.getKey()));
			neighbors.forEach((n) => {
				n.pred = probe;
				q.push(n);
			});
		}
		

		console.error("I couldn't find the end 😖")
		return Promise.resolve(null);
	}

	async iterativeDfs() {
		let box = this.grid[0][0];
		let stack = new Array();
		box.status = true;
		this.visited[0][0] = true;
		stack.push(box);

		while(stack.length > 0) {
			await delay(25);
			let curr = stack.pop();
			let neighbors = curr.neighbors(VISITED)
				.filter((n) => !this.visited[n.row][n.col]);

			if(neighbors.length > 0){
				let neighbor = neighbors[Math.floor(Math.random(1)*neighbors.length)]
				neighbor.status = true;
				this.visited[neighbor.row][neighbor.col] = true;
				stack.push(curr);
				stack.push(neighbor);			
				curr.join(neighbor)
				curr.join(neighbor);
				this.graph.get(curr.getKey()).push(neighbor);
				this.graph.get(neighbor.getKey()).push(curr);
			}
		}

		return Promise.resolve(null)
	}

	backtrack(box) {
		this.visited[box.row][box.col] = true;
		box.status = true
		box.render();

		let neighbors = box.neighbors(VISITED)

		while(neighbors.length > 0){

			let neighbor = neighbors[Math.floor(Math.random(1)*neighbors.length)]
			
			box.join(neighbor);
			this.graph.get(box.key()).push(neighbor);
			this.graph.get(neighbor.key()).push(box);
			
			this.backtrack(neighbor);
			
			neighbors = box.neighbors().filter((n) => !this.visited[n.row][n.col]);
		}
		
		return;
	}
}

class GridBox {
	w = 20;
	h = 20;
	g = 10;
	status = NEW;
	westWall = true;
	northWall = true;
	eastWall = true;
	southWall = true;
	pred = null;

	constructor(row,col,grid) {
		this.row = row;
		this.col = col;
		this.grid = grid;
		this.render();
	}
	
	neighbors(badStatus) {
		let offsets = [[0,1],[0,-1],[1,0],[-1,0]];
		let neighbors = offsets
			.map((offset) => [this.row+offset[0], this.col+offset[1]])
			.filter((newCoord) => {
				let isValid = true;
				let newCol = newCoord[1];
				let newRow = newCoord[0];

				isValid &&= 0 <= newRow && newRow < this.grid[0].length;		
				isValid &&= 0 <= newCol && newCol < this.grid[1].length;

				return isValid && (this.grid[newCol,newRow].status != badStatus);
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
		
		switch(this.status) {
			case(VISITED):
				ctx.fillStyle = "#55FF55";
				break;
			case(SEARCHED):
				ctx.fillStyle = "#5555FF";
				break;
			case(START):
				ctx.fillStyle = "#FFFF55";
				break;
			case(END):
				ctx.fillStyle = "#55FFFF";
				break;
			case(PATH):
				ctx.fillStyle = "#FFFF55";
				break;
			case(NEW):
				ctx.fillStyle = "#4F4F4F";
				break;
			default:
				ctx.fillStyle = "#FF3F3F";
		}		

		ctx.fillRect(this.w*this.col, this.h*this.row, this.w, this.h);
		ctx.fillStyle = 'black';
		ctx.lineWidth = 1;

		if(this.westWall) {
			ctx.beginPath();
			ctx.moveTo(this.w*this.col, this.h*this.row);
			ctx.lineTo(this.w*this.col, this.h*(this.row+1));
			ctx.stroke(); 
		}

		if(this.northWall) {
			ctx.beginPath();
			ctx.moveTo(this.w*this.col, this.h*this.row);
			ctx.lineTo(this.w*(this.col+1), this.h*this.row);
			ctx.stroke(); 
		}

		if(this.eastWall) {
			ctx.beginPath();
			ctx.moveTo(this.w*(this.col+1), this.h*this.row);
			ctx.lineTo(this.w*(this.col+1), this.h*(this.row+1));
			ctx.stroke(); 
		}

		if(this.southWall) {
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
		return neighbor;
	}	

	getKey() {
		return `${this.row},${this.col}`
	}

	toString() {
		return `[${this.row},${this.col}] `
	}

}
