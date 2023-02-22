class MatchPair{
    #attepmt = 0;
    #range = null;
    #prev = null;
    #curr = null;
    
    constructor(){
        this.$board = document.getElementById('match-pair');
        this.$range = document.getElementById('mpRange');
        this.$restart = document.getElementById('match-pair-restart');
        this.itemList = ["👱‍♀️","🚩","🥗","🧀","🍮","🍎","🍒","🥑","🍄","🍅","🍌"]; 
        this.boardData = [];
        this.init();
    }//constructor

    init(){
        this.reset();
        this.$range.addEventListener('input', this.reset);
        this.$restart.addEventListener('click',this.reset);
        
    }//init

    reset = ()=>{
        this.$board.innerHTML = "";
        this.#attepmt = 0;
        this.#range = Number(this.$range.value);
        this.#prev = null;
        this.#curr = null;
        this.remove_popup();
        this.display_attempt();
        this.draw_board();
        this.set_board_data();
        this.add_click_board();
    }//reset

    /* -------DATA------- */
    get_pos = idx => [parseInt(idx / this.#range), idx % this.#range];

    get_idx = (r,c) => ((r * this.#range) + c);

    set_board_data(){
        this.boardData = [];

        for(let r=0; r<this.#range; r++){
            const row = [];
            for(let c=0; c<this.#range; c++){
                row.push(r * this.#range + c);
            }
            this.boardData.push(row);
        }

        const candidate = Array(this.#range ** 2).fill(0).map((el,idx)=>el + idx);
        
        const get_random_idx = () => candidate.splice(parseInt(Math.random() * candidate.length),1);

        const copyItemList = [...this.itemList];
        const get_random_item = () =>{
            const ridx = parseInt(Math.random() * copyItemList.length);
            return copyItemList.splice(ridx,1)[0];
        };
        while(copyItemList.length < (this.#range ** 2 / 2)){
            const rIdx = parseInt(Math.random() * this.itemList.length)
            copyItemList.push(this.itemList[rIdx]);
        }

        for(let i=0; i<this.#range ** 2 / 2; i++){
            const r1 = get_random_idx();
            const r2 = get_random_idx();
            const [x1,y1] = this.get_pos(r1);
            const [x2,y2] = this.get_pos(r2);
            const randomItem = get_random_item();
            this.boardData[x1][y1] = randomItem;
            this.boardData[x2][y2] = randomItem;
        }

        console.table(this.boardData);
    }//set_board_data
    
    /* ------- DOM ------- */

    display_attempt(){
        document.getElementById('match-pair-attempt').textContent = this.#attepmt;
    }//display_attempt

    draw_board(){
        const $frag = document.createDocumentFragment();
        for(let i=0; i<this.#range**2; i++){
            const $cell = this.make_cell();
            $frag.appendChild($cell);
        }
        this.$board.appendChild($frag);
        this.$board.style.gridTemplateColumns = `repeat(${this.#range},1fr)`;
        this.$board.style.gridTemplateRows = `repeat(${this.#range},1fr)`;
    }//draw_board

    make_cell(){
        const $cell = document.createElement("DIV");
        $cell.classList.add('card');

        const $front = this.make_card_face({isFront : true});
        const $back = this.make_card_face({isFront : false});

        $cell.appendChild($front);
        $cell.appendChild($back);

        return $cell;
    }//make_cell

    make_card_face({isFront = true} = {}){
        const $face = document.createElement('DIV');
        $face.classList.add('card-face');
        $face.classList.add(`card-face-${isFront ? "front" : "back"}`);
        return $face;
    }//make_card_face

    flip_card($card){
        $card.classList.add('flipped');
    }//flip_card

    unflip_cards(){
        return new Promise(res => {
            const $$card = this.$board.children;
            const prevIdx = this.get_idx(this.#prev[0],this.#prev[1]);
            const currIdx = this.get_idx(this.#curr[0],this.#curr[1]);
            const $cardPrev = $$card[prevIdx];
            const $cardCurr = $$card[currIdx];
            setTimeout(()=>{
                $cardPrev.classList.remove('flipped');
                $cardCurr.classList.remove('flipped');
                $cardPrev.addEventListener('transitionend',()=>{
                    this.set_back_face_card($cardPrev);
                    this.set_back_face_card($cardCurr);
                    res();
                },{once:true})
            },500);
        });
    }//unflip_cards

    set_back_face_card($card,data = null){
        const $back = $card.querySelector('.card-face-back');
        $back.textContent = data ?? "";
    }//set_back_face_card
    
    add_popup(message){
        const $popup = document.createElement('DIV');
        $popup.id = 'popup';
        $popup.textContent = message;
        this.$board.appendChild($popup);
    }//add_popup
    
    remove_popup(){
        const $popup = document.getElementById('popup');
        if($popup) this.$board.removeChild($popup);
    }//remove_popup

    /* ------- EVENT ------- */
    add_click_board(){
        this.$board.addEventListener('click',this.on_click_board,{once:true});
    }//add_click_board

    on_click_board = async(e) =>{
        if(!e.target.classList.contains('card')) {
            this.add_click_board();
            return;
        }
        if(e.target.classList.contains('flipped')) {
            this.add_click_board();
            return;
        }
        const $$card = this.$board.children
        const $card = e.target;

        this.flip_card($card);
        
        const idx = Array.prototype.indexOf.call($$card, $card);
        const [rIdx,cIdx] = this.get_pos(idx);

        this.set_back_face_card($card,this.boardData[rIdx][cIdx]);

        if(!this.#prev){
            this.#prev = [rIdx,cIdx];
            this.add_click_board();
            return;
        }        
        
        this.#curr = [rIdx,cIdx];
        const isPair = this.is_pair();

        if(!isPair){
            this.#attepmt++;
            this.display_attempt();
            await this.unflip_cards();
        }

        this.#prev = null;
        this.#curr = null;

        if(this.is_all_pair()){
            $card.addEventListener('transitionend',()=>{
                this.win();
            },{once:true});
            return;
        }

        this.add_click_board();
    }//on_click_board

    /* ------- Play ------- */
    is_pair(){
        const [x1,y1] = this.#prev;
        const [x2,y2] = this.#curr;
        return this.boardData[x1][y1] == this.boardData[x2][y2];
    }//is_pair

    is_all_pair(){
        return this.$board.querySelectorAll('.flipped').length == this.#range ** 2;
    }//is_all_pair

    win(){
        this.add_popup('You Win🥩');
    }//win
}//MatchPair

new MatchPair();