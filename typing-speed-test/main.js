import { sentences } from "./sentences.js";
import { Timer } from "./timer.js";
import { TssKeyboard } from "./TssKeyboard.js";

class TypingSpeedTest{
    #score = 0;
    constructor(){
        this.$display = document.getElementById('tst-display');
        this.$result = document.getElementById('tst-result');
        this.$reset = document.getElementById('tst-reset');

        this.STARTED = false;
        this.DATA = [...sentences];
        this.nextLetter = null;

        this.KEYBOARD = new TssKeyboard(this);
        this.TIMER = new Timer(this);

        this.init();
    }//constructor

    init(){
        this.reset();

        /* dom */
        this.KEYBOARD.draw_keyboard();
        
        /* event */
        this.$reset.addEventListener('click', this.reset);
        this.KEYBOARD.add_evt();
    }//init
    
    reset = () => {
        this.#score = 0;
        this.STARTED = false;
        this.DATA = [...sentences];
        this.TIMER.reset_timer();
        this.nextLetter = null;
        this.hide_result();
        this.$display.textContent = '';
        this.add_sentence();
    }//reset

    /* ---------- DOM ---------- */

    show_result(){
        this.$result.classList.add('on');
        this.$result.innerHTML = `You have typed <strong>${this.#score}</strong> letters in <strong>${this.TIMER.timeOriginal} seconds</strong>`;
    }//show_result

    hide_result(){
        this.$result.classList.remove('on');
    }//hide_result

    add_sentence(){
        const rIdx = parseInt(Math.random() * this.DATA.length);
        const sentence = this.DATA.splice(rIdx,1)[0];
        this.$display.textContent += sentence;
    }//add_sentence

    update_sentence(){
        if(this.$display.textContent.length < 50){
            this.$display.textContent += " ";
            if(this.DATA.length) this.add_sentence();
        }
        const nextCharIdx = this.$display.textContent.charAt(1).trim() ? 1 : 2;
        this.$display.textContent = this.$display.textContent.slice(nextCharIdx); 
    }//update_sentence
    
    /* ---------- game ---------- */
    get_first_letter(){
        const $firstChar = this.$display.textContent.charAt(0); 
        return $firstChar;
    }//get_first_letter

    update_score(){
        this.#score++;
    }
    
    game_start(){
        this.STARTED = true;
        this.TIMER.is_timer_started(true);
        setTimeout(()=>{
            this.TIMER.start_timer();
        },1000);
    }//game_start_timer

    end(){
        this.TIMER.stop_timer();
        this.TIMER.time = 0;
        this.TIMER.hide_timer();
        this.show_result();
    }//end
}//TypingSpeedTest



/* ----------------------- */
new TypingSpeedTest();