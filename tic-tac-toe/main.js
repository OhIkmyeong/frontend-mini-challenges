class TicTacToe{
    #scoreO = 0;
    #scoreX = 0;
    constructor(){
        this.$turn = document.getElementById('turn');
        this.$board = document.getElementById('ttt-board');
        
        this.board = null;
        this.TURN_X = true;
        this.answerIdx = []; //[[x,y]x3]
        this.answerDir = ''; //row|col|dig
        
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
        
        this.answerIdx = [];
        this.answerDir = '';
        
        this.remove_popup();
        this.remove_line_effect();
        
        this.clear_board_dom();
        this.clear_board_data();
        
        this.TURN_X = true;
        this.display_turn();

        this.$board.addEventListener('click',this.on_click_board);
    }//reset

    display_turn(){
        const turn = this.get_turn_string();
        this.$turn.textContent = turn;
        this.$turn.style.color = `var(--${turn})`;
    }//display_turn

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
            this.game_win();
            return;
        }

        //무승부시
        const isDraw = this.$board.querySelectorAll('.ttt-cell:not([data-cell])');
        if(!isDraw?.length){
            this.game_draw();
            return;
        }

        //턴 전환
        this.TURN_X = !this.TURN_X;
        this.display_turn();
    }//on_click_board

    update_board_data($cell){
        const idx = Array.prototype.indexOf.call(this.$board.children,$cell);
        const rIdx = parseInt ( idx / 3 );
        const cIdx = idx % 3;

        this.board[rIdx][cIdx] = Number(this.TURN_X);
        // console.table(this.board);
    }//update_board_data

    /* -------------- */

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

        const result = rowResult.some(el=>el); 

        //fill answerIdx
        if(result){
            for(let i=0; i<rowResult.length; i++){
                const res = rowResult[i];
                if(!res) continue;
                this.answerIdx.push([i,0]);
                this.answerIdx.push([i,1]);
                this.answerIdx.push([i,2]);
            }
            this.answerDir = 'row';
        }//if-result
        
        //return Boolean
        return result;
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

        const result = colResult.some(el=>el); 

        //fill answerIdx
        if(result){
            for(let i=0; i<colResult.length; i++){
                const res = colResult[i];
                if(!res) continue;
                this.answerIdx.push([0,i]);
                this.answerIdx.push([1,i]);
                this.answerIdx.push([2,i]);
            }
            this.answerDir = 'col';
        }//if-result
        
        //return Boolean
        return result;
    }//check_vertical
    
    check_diagonal(turnNum){
        if(this.board[1][1] !== turnNum) return false;

        //1.
        if(this.board[0][0] == turnNum && this.board[2][2] == turnNum){
            this.answerIdx.push([0,0]);
            this.answerIdx.push([1,1]);
            this.answerIdx.push([2,2]);
            this.answerDir = 'dig';
            return true;
        }
        
        //2.
        if(this.board[0][2] == turnNum && this.board[2][0] == turnNum){
            this.answerIdx.push([0,2]);
            this.answerIdx.push([1,1]);
            this.answerIdx.push([2,0]);
            this.answerDir = 'dig';
            return true;
        }

        return false;
    }//check_diagonal

    /* --------- */

    game_win(){
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
        const $line = this.add_line_effect();
        this.$board.appendChild($line);
        //누가 이겼는지 팝업으로 표시
        $line.addEventListener('animationend',()=>{
            this.make_popup(`👍${this.get_turn_string().toUpperCase()}👍win!`);
        },{once:true});
    }//game_win

    /** 무승부 */
    game_draw(){
        //board에 이벤트 제거
        this.$board.removeEventListener('click',this.on_click_board);

        //무승부 팝업 표시
        this.make_popup("DRAW🙂");
    }//game_draw

    /* ---------------- */
    /**
     * 게임 종료시 팝업 메세지를 띄움
     * @param {String} message 
     */
    make_popup(message){
        setTimeout(()=>{
            const popup = document.createElement('DIV');
            popup.id = 'ttt-popup';
            popup.textContent = message;
            this.$board.appendChild(popup);
        },500);
    }//make_popup

    remove_popup(){
        const popup = document.getElementById('ttt-popup');
        if(popup) this.$board.removeChild(popup);
    }//remove_popup

    /**
     * 이긴 cell을 기준으로 
     * @returns {DOM} #ttt-win-line
     */
    add_line_effect(){
        // console.log(this.answerIdx);
        const $line = document.createElement('DIV');
        $line.id = 'ttt-win-line';
        $line.style.background = `var(--${this.get_turn_string()})`;

        $line.classList.add(this.answerDir);
        const [x,y] = this.answerIdx[0];

        switch(this.answerDir){
            case "row":{
                $line.classList.add(`row-${x+1}`);
            }break;
            case "col":{
                $line.classList.add(`col-${y+1}`);
            }break;
            case "dig":{
                $line.classList.add(`dig-${y > 0 ? y : y + 1}`);
            }break;
        }

        return $line;
    }//add_line_effect

    remove_line_effect(){
        const $line = document.getElementById('ttt-win-line');
        if($line)this.$board.removeChild($line);
    }//remove_line_effect
}//TicTacToe

new TicTacToe();