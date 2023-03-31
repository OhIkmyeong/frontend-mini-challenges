export class ConnectFourDomMaker{
    constructor(){
        this.$wrap = document.getElementById('cnf');
        this.$slot = document.getElementById('cnf-slots');
        this.$board = document.getElementById('cnf-board');
        this.$reset = document.getElementById('cnf-reset');
        this.$result = document.getElementById('cnf-result');
        this.$moving = document.getElementById('cnf-moving');

        this.resultText = {
            playing : "💫Playing...",
            win : {
                blue : "💙 BLUE WIN 💙",
                red : "💕 RED WIN 💕"
            },
            draw : "😂DRAW💦"
        };
    }//constructor

    /* -----------------------------[DRAW]----------------------------- */

    draw_slot(){
        const $frag = document.createDocumentFragment();

        const cellWidth = `calc(100% / ${this.cols})`;

        for(let i=0; i<this.cols; i++){
            const $slot = document.createElement('DIV');
            $slot.classList.add('cnf-slots-slot');
            $slot.dataset.col = i;
            $slot.style.width = cellWidth;
            $frag.appendChild($slot);
        }//for
        
        this.$slot.appendChild($frag);
    }//draw_slot

    draw_board(){
        const $frag = document.createDocumentFragment();

        const cellWidth = `calc(100% / ${this.cols} - 18px)`;
        
        for(let r=0; r<this.rows; r++){
            for(let c=0; c<this.cols; c++){
                const $cell = document.createElement('DIV');
                $cell.classList.add('cnf-board-cell');
                $cell.dataset.row = r;
                $cell.dataset.col = c;
                $cell.style.width = cellWidth;
                $frag.appendChild($cell);
            }//for-c
        }//for-r
        
        this.$board.appendChild($frag);
    }//draw_board

    /* -----------------------------[STYLING - GENERAL]----------------------------- */
    
    set_style_turn(){
        this.$wrap.style.setProperty('--turn', `var(--${this.blueOrRed})`);
    }//set_style_turn

    /* -----------------------------[STYLING - MOVING]----------------------------- */
    
    set_style_moving(){
        const cellWidth = `calc(100% / ${this.cols})`;
        const {height} = this.$slot.getBoundingClientRect(); 
        this.$moving.style.width = cellWidth;
        this.$moving.style.top = `${height}px`;
        this.reset_moving_top();
    }//set_style_moving

    reset_moving_top(){
        this.$moving.classList.add('off');
        this.$moving.style.transform = `translateY(10px)`;
        this.$moving.style.left = `0px`;
    }//reset_moving_top

    move_moving_top(rIdx,cIdx){
        return new Promise(res=>{
            const $cell = this.$board.querySelector(`[data-row="${rIdx}"][data-col="${cIdx}"]`);
            this.$moving.classList.remove('off');
            this.$moving.style.left = `${$cell.offsetLeft - 10}px`;
            this.$moving.style.transform = `translateY(${$cell.offsetTop}px)`;
            
            this.$moving.addEventListener('transitionend', ()=>{
                this.reset_moving_top();
                res();
            }, {once:true});
        });
    }//move_moving_top
    
    /* -----------------------------[STYLING - BOARD]----------------------------- */

    reset_board_dom(){
        const $$cell = this.$board.querySelectorAll('.cnf-board-cell');
        $$cell.forEach($cell =>{
            $cell.classList.remove('on');
            $cell.classList.remove('blue');
            $cell.classList.remove('red');
        });
    }//reset_board_dom

    update_board_dom(rIdx,cIdx){
        const $$cell = this.$board.querySelectorAll('.cnf-board-cell');
        const idx = this.cols * rIdx + cIdx;
        $$cell[idx].classList.add(`${this.turnBlue ? "blue" : "red"}`);
    }//update_board_dom


    update_winner_cell(idxArray){
        idxArray.forEach(info=>{
            const [rIdx,cIdx] = info;
            const $cell = this.$board.querySelector(`[data-row="${rIdx}"][data-col="${cIdx}"]`);
            $cell.classList.add('on');
        });
    }//update_winner_cell

    /* --------------------- STYLING - RESET BUTTON ---------------- */
    disable_reset(){
        this.$reset.disabled = true;
    }//disable_reset
    enable_reset(){
        this.$reset.disabled = false;
    }//enable_reset
    
}//class-ConnectFourDomMaker