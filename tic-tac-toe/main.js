class TicTacToe{
    #scoreO = 0;
    #scoreX = 0;
    constructor(){
        this.$board = document.getElementById('ttt-board');
        
        this.board = null;
        this.TURN_X = true;
        
        this.init();
    }//constructor

    init(){
        this.display_score();
        this.reset();

        //이벤트 추가
        document.getElementById('reset').addEventListener('click', this.reset);
    }//init

    reset = () =>{
        this.$board.removeEventListener('click',this.on_click_board);
        this.clear_board_dom();
        this.clear_board_data();
        this.TURN_X = true;
        this.$board.addEventListener('click',this.on_click_board);
    }//reset

    clear_board_dom(){
        const $$cell = this.$board.children;

        for(let i=0; i<$$cell.length; i++){
            const $cell = $$cell[i];
            $cell.textContent = '';
            $cell.removeAttribute('data-cell');
        }//for
    }//clear_board_dom

    clear_board_data(){
        //x가 1, o는 0
        this.board = [];
        for(let r=0; r<3; r++){
            const row = [];
            for(let c=0; c<3; c++){
                row.push(-1);
            }
            this.board.push(row);
        }
    }//clear_board_data

    display_score(){
        const $scoreO = document.getElementById('score-o');
        const $scoreX = document.getElementById('score-x');
        $scoreO.textContent = this.#scoreO;
        $scoreX.textContent = this.#scoreX;
    }//display_score

    get_turn_string(){
        return this.TURN_X ? "x" : "o";
    }//get_turn_string

    /* ------------- */
    on_click_board = e =>{
        if(!e.target.classList.contains('ttt-cell')) return;
        if(e.target.dataset.cell) return;
        
        const turn = this.get_turn_string();
        const $cell = e.target;

        //DOM에 반영
        $cell.dataset.cell = turn;
        $cell.textContent = turn;

        //data 반영
        this.update_board_data($cell);

        //이겼는지 확인
        const isWin = this.is_win();

        //승리시
        if(isWin){
            this.win();
            return;
        }

        //턴 전환
        this.TURN_X = !this.TURN_X;
    }//on_click_board

    update_board_data($cell){
        const idx = Array.prototype.indexOf.call(this.$board.children,$cell);
        const rIdx = parseInt ( idx / 3 );
        const cIdx = idx % 3;

        this.board[rIdx][cIdx] = Number(this.TURN_X);
        console.table(this.board);
    }//update_board_data

    is_win(){
        const turnNum = this.TURN_X ? 1 : 0;
        if(this.check_horizontal(turnNum)) return true;        
        if(this.check_vertical(turnNum)) return true;        
        if(this.check_diagonal(turnNum)) return true;        

        return false;
    }//is_win

    check_horizontal(turnNum){
        const rowResult = [];

        this.board.forEach(row =>{
            rowResult.push(row.every(el => el == turnNum));
        })

        return rowResult.some(el=>el);
    }//check_horizontal
    
    check_vertical(turnNum){
        const colResult = [];
        for(let r=0; r<3; r++){
            const temp = [];
            for(let c=0; c<3; c++){
                const cell = this.board[c][r];
                temp.push(cell == turnNum)
            }
            colResult.push(temp.every(cell=>cell))
        }//for

        return colResult.some(el=>el);
    }//check_vertical
    
    check_diagonal(turnNum){
        if(this.board[1][1] !== turnNum) return false;

        //1.
        if(this.board[0][0] == turnNum && this.board[2][2] == turnNum) return true;
        
        //2.
        if(this.board[0][2] == turnNum && this.board[2][0] == turnNum) return true;

        return false;
    }//check_diagonal

    /* --------- */
    win(){
        //board에 이벤트 제거
        this.$board.removeEventListener('click',this.on_click_board);

        //점수 업데이트 표시
        if(this.TURN_X){
            this.#scoreX++;
        }else{
            this.#scoreO++;
        }
        this.display_score();

        //이펙트(대각선)
        //누가 이겼는지 팝업으로 표시

    }//win

    draw(){}//draw

    make_popup(){}//make_popup

    line_effect(){}//line_effect
}//TicTacToe

new TicTacToe();