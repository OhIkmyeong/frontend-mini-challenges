class ConnectFour{
    #turnBlue = true;
    #rows = 6;
    #cols = 7;

    constructor(){
        this.$slot = document.getElementById('cnf-slots');
        this.$board = document.getElementById('cnf-board');
        this.$resete = document.getElementById('cnf-reset');
        this.$reseult = document.getElementById('cnf-result');
        
        this.init();

        /* 이벤트 추가 */
        this.$slot.addEventListener('mousemove',this.on_move_slot)
    }//constructor

    init(){
        this.draw_slot();
        this.draw_board();
    }//init

    reset(){
        this.#turnBlue = true;
    }//reset

    /* -----[DOM]----- */
    draw_slot(){
        const $frag = document.createDocumentFragment();

        for(let i=0; i<this.#cols; i++){
            const $slot = document.createElement('DIV');
            $slot.classList.add('cnf-slots-slot');
            $slot.dataset.col = i;
            $slot.style.width = `calc(100% / ${this.#cols})`;
            $frag.appendChild($slot);
        }//for
        
        this.$slot.appendChild($frag);
    }//draw_slot

    draw_board(){
        const $frag = document.createDocumentFragment();
        
        for(let r=0; r<this.#rows; r++){
            for(let c=0; c<this.#cols; c++){
                const $cell = document.createElement('DIV');
                $cell.classList.add('cnf-board-cell');
                $cell.dataset.row = r;
                $cell.dataset.col = c;
                $cell.style.width = `calc(100% / ${this.#cols})`;
                $frag.appendChild($cell);
            }//for-c
        }//for-r
        
        this.$board.appendChild($frag);
    }//draw_board

    /* -----[EVENT]----- */
    on_move_slot=(e)=>{
    }//on_move_slot
}//ConnectFour

new ConnectFour();