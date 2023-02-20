class ChessBoard{
    constructor(){
        this.$board = document.getElementById('chess-board');
        this.board = [];
    }//constructor

    /**
     * fill cells in board
     * @param {Number} row 
     * @param {Number} col 
     */
    draw_cell(row,col){
        this.$board.style.gridTemplateColumns = `repeat(${col},var(--wid-cell))`;
        
        const $frag = document.createDocumentFragment();
        for(let r=0; r<row; r++){
            const row = [];
            const $row = document.createElement("DIV");
            $row.classList.add('chess-board-row');
            for(let c=0; c<col; c++){
                const $cell = document.createElement('DIV');
                $cell.classList.add('cell');
                const cellBlack = c % 2;
                $cell.classList.add(`cell-${r % 2 ? (cellBlack ? "white" : "black") : (cellBlack ? "black" : "white")}`);
                $row.appendChild($cell);
                row.push(c);
            }//for-c
            $frag.appendChild($row);
            this.board.push(row);
        }//for-r
        this.$board.appendChild($frag);
    }//draw_cell

    init(){
        this.$board.addEventListener('click',this.on_click_board);
    }//init

    on_click_board = e =>{
        if(!(e.target.classList.contains('cell'))) return;
        const $cell = e.target; 
        if($cell.dataset.clicked){
            this.reset_cell();
            return;
        }
        this.reset_cell();
        const $row = $cell.parentElement;
        const rIdx = Array.prototype.indexOf.call(this.$board.children, $row);
        const cIdx = Array.prototype.indexOf.call($row.children, $cell);
        $cell.setAttribute('data-clicked',`${rIdx}${cIdx}`);

        this.cell_red($cell);
        this.fill_cell_up_left(rIdx,cIdx);
        this.fill_cell_up_right(rIdx,cIdx);
        this.fill_cell_down_left(rIdx,cIdx);
        this.fill_cell_down_right(rIdx,cIdx);
    }//on_click_board

    cell_red($cell){
        $cell.classList.add('cell-red');
    };

    reset_cell(){
        const $$cell = this.$board.querySelectorAll('.cell');
        $$cell.forEach($cell => {
            $cell.classList.remove('cell-red');
            $cell.removeAttribute('data-clicked');
        });
    }//reset_cell

    fill_cell_up_left(r,c){
        r--;
        c--;
        while(r >= 0 && c >= 0){
            const $row = this.$board.children[r];
            const $cell = $row.children[c];
            this.cell_red($cell);
            r--;
            c--;
        }
    }//fill_cell_up_left

    fill_cell_up_right(r,c){
        r--;
        c++;
        const maxC = this.board[0].at(-1);
        while(r>=0 && c<=maxC){
            const $row = this.$board.children[r];
            const $cell = $row.children[c];
            this.cell_red($cell);
            r--;
            c++;
        }
    }//fill_cell_up_right

    fill_cell_down_left(r,c){
        r++;
        c--;
        const maxR = this.board.length - 1;
        while(r<=maxR && c>=0){
            const $row = this.$board.children[r];
            const $cell = $row.children[c];
            this.cell_red($cell);
            r++;
            c--;
        }
    }//fill_cell_down_left

    fill_cell_down_right(r,c){
        r++;
        c++;
        const maxR = this.board.length - 1;
        const maxC = this.board[0].at(-1);
        while(r<=maxR && c<=maxC){
            const $row = this.$board.children[r];
            const $cell = $row.children[c];
            this.cell_red($cell);
            r++;
            c++;
        }
    }//fill_cell_down_right
}//ChessBoard


const CB = new ChessBoard();
CB.draw_cell(8,8);
CB.init();