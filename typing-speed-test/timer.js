export class Timer{
    #timeOriginal = 60;
    #time = 0;
    constructor(TSS){
        this.TSS = TSS;
        this.$timer = document.getElementById('tst-time');
        this.timeOut = null;
    }//constructor

    reset_timer(){
        this.#time = this.#timeOriginal;
        this.is_timer_started(false);
        this.stop_timer();
        this.show_timer();
        this.display_timer();
    }//reset_timer

    /* ---------- DOM ---------- */
    
    display_timer(){
        this.$timer.textContent = this.#time; 
    }//display_timer

    is_timer_started(bool){
        this.$timer.classList.toggle('started',bool);
    }

    hide_timer(){
        this.$timer.classList.add('off');
    }//hide_timer
    
    show_timer(){
        this.$timer.classList.remove('off');
    }//show_timer

    /* ---------- setTimeout ---------- */

    stop_timer(){
        clearTimeout(this.timeOut);
        this.timeOut = null;
    }//stop_timer

    start_timer = () =>{
        this.#time--;
        if(this.#time < 0){
            this.TSS.end();
            return;
        }
        this.display_timer();

        this.timeOut = setTimeout(this.start_timer, 1000);
    }//start_timer

    /* ---------- getter, setter ---------- */
    get time(){ return this.#time;}
    set time(num){ this.#time = num;}

    get timeOriginal(){return this.#timeOriginal;}

}//Timer