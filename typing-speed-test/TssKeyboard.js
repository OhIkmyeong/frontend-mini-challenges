export class TssKeyboard{
    constructor(TSS){
        this.TSS = TSS;
        this.$keyboard = document.getElementById('tst-keyboard');
        this.keys = {
            num : new Array(10).fill(1).map((el,idx)=>{
                return el + idx >= 10 ? 10 - (el + idx) : el + idx;
            }),
            char : "qwertyuiopasdfghjklzxcvbnm".split('')
        }
    }//constructor

    /* --- DOM --- */
    draw_keyboard(){
        const $frag = document.createDocumentFragment();
        const $nums = this.add_key_num();
        const $chars = this.add_key_char();

        $frag.appendChild($nums);
        $frag.appendChild($chars);
        this.$keyboard.appendChild($frag);
    }//draw_keyboard

    add_key_num(){
        const $row = this.make_row();
        this.keys.num.forEach(key => this.make_btns_add_to_row(key,$row));
        return $row;
    }//add_key_num

    add_key_char(){
        let numSplit = 10;
        const $frag = document.createDocumentFragment();
        let $row = this.make_row();

        this.keys.char.forEach((key,idx)=>{
            this.make_btns_add_to_row(key,$row);
            if(idx + 1 >= numSplit){
                numSplit += numSplit;
                --numSplit;
                $frag.appendChild($row);
                $row = this.make_row();
            }
        });
        $frag.appendChild($row);

        return $frag;
    }//add_key_char

    make_row(){
        const $row = document.createElement('ARTICLE');
        $row.classList.add("tst-keyboard-row");
        return $row;
    }//make_row

    make_btns_add_to_row(key,$row){
        const $btn = document.createElement('BUTTON');
        $btn.textContent = key;
        $btn.dataset.key = key;
        $row.appendChild($btn);
    }//make_btns_add_to_row

    pressed_right_key(key){
        const $key = this.get_key(key);
        if(!$key) return;
        $key.classList.add('right');
        $key.addEventListener('transitionend',()=>{
            $key.classList.remove('right');
        },{once:true})
    }//pressed_right_key
    
    pressed_wrong_key(key){
        const $key = this.get_key(key);
        if(!$key) return;
        $key.classList.add('wrong');
        $key.addEventListener('transitionend',()=>{
            $key.classList.remove('wrong');
        },{once:true})
    }//pressed_right_key

    get_key(key){
        const $key = this.$keyboard.querySelector(`[data-key="${key}"]`);
        return $key;
    }//get_key

    /* --- EVENT --- */
    add_evt(){
        this.$keyboard.addEventListener('click',this.on_click_key);
        window.addEventListener('keydown',e =>{
            const key = e.key;
            this.compare_key(key);
        });
    }//add_evt

    on_click_key = e =>{
        if(e.target.tagName != "BUTTON") return;
        const key = e.target.dataset.key;
        this.compare_key(key);
    }//on_click_key

    /* -------- game -------- */
    compare_key(key){
        if(!this.TSS.TIMER.time) return;
        if(!this.TSS.STARTED) this.TSS.game_start();
        const firstLetter = this.TSS.get_first_letter();
        if(key !== firstLetter){
            this.pressed_wrong_key(key);
            return;
        }
        this.pressed_right_key(key);
        this.TSS.update_score();
        this.TSS.update_sentence();

        if(this.TSS.get_first_letter() == " ") this.TSS.end();
    }//compare_key
}//TssKeyboard