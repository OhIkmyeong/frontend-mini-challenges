export class ConnectFourData{
    constructor(GAME){
        this.GAME = GAME;
        this.board = [];
        this.BLUE = 1;
        this.RED = -1;
    }//constructor

    /* ------------------ [reset] -------------- */
    set_board_data(){
        this.board = [];

        for(let r=0; r<this.GAME.rows; r++){
            const row = [];
            for(let c=0; c<this.GAME.cols; c++){
                row.push(0);
            }
            this.board.push(row);
        }
    }//set_board_data

    /* ------------------ [update] -------------- */

    update_board_data(rIdx,cIdx){
        this.board[rIdx][cIdx] = this.GAME.turnBlue ? this.BLUE : this.RED;
    }//update_board_data

    /* ------------------ [tools] -------------- */

    get_r_idx(cIdx){
        for(let r=this.GAME.rows - 1; r>=0; r--){
            if(this.board[r][cIdx] == 0) return r;
        }
        return -1;
    }//get_r_idx

    get_c_idx = e =>{
        const {clientX} = e;
        const {left,width} = this.GAME.$wrap.getBoundingClientRect();
        const x = (clientX - left - 10);
        const idx = Math.floor((x / width) * this.GAME.cols);
        if(idx < 0) return 0;
        return idx;
    }//get_c_idx

    get_turn_number_value(){
        return this.GAME.turnBlue ? this.BLUE : this.RED;
    }

}//ConnectFourData