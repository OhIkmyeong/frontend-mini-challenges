import { ConnectFourData } from "./ConnectFourData.js";
import { ConnectFourDomMaker } from "./ConnectFourDomMaker.js";

/* 멀티 상속 안 하고 하나만 상속시킨 경우 ㅠ */
export class ConnectFour extends ConnectFourDomMaker{
    #turnBlue = true;
    #rows = 6;
    #cols = 7;

    constructor(){
        super();
        this.DATA = new ConnectFourData(this);
        
    }//constructor
    
    /* -------------------- [GETTER] -------------------- */

    get rows(){return this.#rows};
    get cols(){return this.#cols};
    get turnBlue(){return this.#turnBlue};
    get blueOrRed(){return this.#turnBlue ? "blue" : "red"}
    
    /* -------------------- [BUILDER] -------------------- */

    init_game(){
        /* DOM - DRAW */
        this.draw_slot();
        this.draw_board();

        /* RESET */
        this.reset();

        /* ADD RESET EVENT */
        this.$reset.addEventListener('click', ()=>{
            this.remove_event();
            this.reset();
        });
    }//init

    reset(){
        this.#turnBlue = true;
        this.disable_reset();
        this.DATA.set_board_data();
        this.set_style_turn();
        this.set_style_moving();
        this.add_event();
        this.reset_board_dom();
        this.$result.textContent = this.resultText.playing;
    }//reset    

    /* -------------------- [EVENT] -------------------- */

    add_event(){
        this.$wrap.addEventListener('mousemove',this.on_move);
        this.$wrap.addEventListener('click', this.on_click);
    }//add_event

    remove_event(){
        this.$wrap.removeEventListener('mousemove',this.on_move);
        this.$wrap.removeEventListener('click', this.on_click);
    }//remove_event

    on_move=(e)=>{
        const cIdx = this.DATA.get_c_idx(e);
        const $$sib = Array.from(this.$slot.children);
        $$sib.forEach($sib => $sib.classList.remove('on'));
        const $slot = this.$slot.children[cIdx]; 
        $slot.classList.add('on');
    }//on_move

    on_click = async(e) =>{
        /* enable reset */
        this.enable_reset();
        
        /* early return */
        const cIdx = this.DATA.get_c_idx(e);
        const rIdx = this.DATA.get_r_idx(cIdx);
        if(rIdx < 0) return

        /* 애니메이션 효과 */
        await this.move_moving_top(rIdx,cIdx);

        /* update board data */
        this.DATA.update_board_data(rIdx,cIdx)

        /* update board dom */
        this.update_board_dom(rIdx,cIdx)

        /* cacul score */
        if(this.is_win(rIdx,cIdx)){
            this.game_win();
            return;
        }
        if(this.is_draw()){
            this.game_draw();
            return;
        }
        /* change turn */
        this.#turnBlue = !this.#turnBlue;
        this.set_style_turn();
    }//on_click

    /* ------------------------- [FUNC] ----------------------- */

    is_draw(){
        return this.DATA.board.every(row=>row.every(col => col !== 0));
    }//is_draw

    is_win(rIdx,cIdx){
        const blueOrRed = this.#turnBlue ? "blue" : "red";
        if(this.inspect_horizontal(rIdx,cIdx)){
            console.log( blueOrRed ,'수평')
            return true;
        }
        if(this.inspect_vertical(rIdx,cIdx)){
            console.log(blueOrRed ,'수직')
            return true;
        }
        if(this.inspect_diagonal_1(rIdx,cIdx)){
            console.log(blueOrRed, '대각선 /');
            return true;
        }
        if(this.inspect_diagonal_2(rIdx,cIdx)){
            console.log(blueOrRed, '대각선 \\');
            return true;
        }
        return false;
    }//is_win

    /* ------------------------- [INSPECT] ----------------------- */

    inspect_horizontal(rIdx,cIdx){
        const turn = this.DATA.get_turn_number_value();
        const result = [];
        const candidate = this.DATA.board[rIdx];
        const min = Math.max(cIdx - 3, 0);
        const max = Math.min(cIdx + 3, this.#cols - 1);

        for(let c=cIdx; c>=min; c--){
            if(candidate[c] != turn) break;
            result.push([rIdx,c]);
        }

        for(let c=cIdx+1; c<=max; c++){
            if(candidate[c] != turn) break;
            result.push([rIdx,c]);
        }
        
        const isWin = result.length >= 4 ? true : false; 
        if(isWin) this.update_winner_cell(result);
        return isWin;
    }//inspect_horizontal

    inspect_vertical(rIdx,cIdx){
        const turn = this.DATA.get_turn_number_value();
        const result = [];
        const candidate = this.DATA.board.map(row => row[cIdx]);
        const min = Math.max(rIdx - 3, 0);
        const max = Math.min(rIdx + 3, this.#rows - 1);

        for(let idx = rIdx; idx>=min; idx--){
            if(candidate[idx] != turn) break;
            result.push([idx,cIdx]);
        }

        for(let idx = rIdx + 1; idx <= max; idx++){
            if(candidate[idx] != turn) break;
            result.push([idx,cIdx]);
        }

        const isWin = result.length >= 4 ? true : false; 
        if(isWin) this.update_winner_cell(result);
        return isWin;
    }//inspect_vertical
    
    inspect_diagonal_1(rIdx,cIdx){
        const turn = this.DATA.get_turn_number_value();
        const result = [];

        /* 오른쪽 위 검사 */
        for(let i=0; i<this.#rows; i++){
            const R = rIdx - i;
            const C = cIdx + i;
            if(R < 0) break;
            if(C >= this.#cols) break;
            if(this.DATA.board[R][C] != turn) break;
            result.push([R,C]);
        }//for

        /* 왼쪽 아래 검사 */
        for(let i=1; i<this.#rows; i++){
            const R = rIdx + i;
            const C = cIdx - i;
            if(R >= this.#rows) break;
            if(C < 0) break;
            if(this.DATA.board[R][C] != turn) break;
            result.push([R,C]);
        }

        const isWin = result.length >= 4 ? true : false; 
        if(isWin) this.update_winner_cell(result);
        return isWin;
    }//inspect_diagonal_1
    
    inspect_diagonal_2(rIdx,cIdx){
        const turn = this.DATA.get_turn_number_value();
        const result = [];

        /* 왼쪽 위 검사 */
        for(let i=0; i<this.#rows; i++){
            const R = rIdx - i;
            const C = cIdx - i;
            if(R < 0) break;
            if(C < 0) break;
            if(this.DATA.board[R][C] != turn) break;
            result.push([R,C]);
        }//for

        /* 오른쪽 아래 검사 */
        for(let i=1; i<this.#rows; i++){
            const R = rIdx + i;
            const C = cIdx + i;
            if(R >= this.#rows) break;
            if(C >= this.#cols) break;
            if(this.DATA.board[R][C] != turn) break;
            result.push([R,C]);
        }

        const isWin = result.length >= 4 ? true : false; 
        if(isWin) this.update_winner_cell(result);
        return isWin;
    }//inspect_diagonal_2

    /* ------------------------- [RESULT] ----------------------- */
    game_draw(){
        this.remove_event();
        this.$result.textContent = this.resultText.draw;
    }//game_draw

    game_win(){
        this.remove_event();
        const {blue,red} = this.resultText.win;
        this.$result.textContent = this.#turnBlue ? blue : red; 
    }//game_win
}//ConnectFour