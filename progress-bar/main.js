class ProgressBar{
    #progress = 0;
    constructor(){
        this.$bar = document.getElementById('progress-bar');
        this.$num = document.getElementById('progress-num');
        this.$btnStart = document.querySelector('[data-btn="start"]')
        this.$btnStop = document.querySelector('[data-btn="stop"]')
        this.$btnReset = document.querySelector('[data-btn="reset"]')

        this.timer = null;
    }//constructor

    /**
     * 📍 시작
     * - 초기화
     * - 버튼들에 이벤트 추가
     */
    init(){
        this.reset();

        this.$btnStart.addEventListener('click',this.on_click_start);
        this.$btnStop.addEventListener('click',this.on_click_stop);
        this.$btnReset.addEventListener('click',this.on_click_reset);
    }//init

    /**
     * 📍 reset
     * - 바의 넓이를 0%로
     * - Stop 버튼의 disabled를 해제
     * - Stop과 Reset 버튼을 disabled 시킴
     */
    reset(){
        this.#progress = 0;
        this.update_num();
        this.style_bar(this.#progress);
        this.$bar.classList.remove('done');
        this.$btnStart.disabled = false;
        this.$btnStop.disabled = true;
        this.$btnReset.disabled = true;
    }//reset

    /* ----------------------------[Event]---------------------------- */
    /**
     * 📍
     * 시작 버튼 클릭시
     */
    on_click_start = () =>{
        this.$btnStart.disabled = true;
        this.$btnStop.disabled = false;
        this.$btnReset.disabled = false;

        this.timer = this.start_progress();
    }//on_click_start

    /**
     * 📍
     * 정지 버튼 클릭시
     */
    on_click_stop = () =>{
        this.$btnStart.disabled = false;
        this.$btnStop.disabled = true;
        this.$btnReset.disabled = false;
        this.stop_progress();
    }//on_click_stop

    /**
     * 📍
     * 리셋 버튼 클릭시
     */
    on_click_reset = () =>{
        this.stop_progress();
        this.reset();
    }//on_click_reset

    /* ----------------------------[Function]---------------------------- */

    start_progress = () =>{
        const random = parseInt(Math.random() * 50 + 1)
        this.#progress += random;
        if(this.#progress >= 1000) this.#progress = 1000;
        this.style_bar(this.#progress / 10)
        this.update_num();

        if(this.#progress >= 1000){
            this.end_progress();
            return;
        }

        const randomTime = parseInt(Math.random() * 1000 + 10)
        this.timer = setTimeout(this.start_progress, randomTime);
    }//start_progress

    stop_progress(){
        clearTimeout(this.timer);
    }//stop_progress

    end_progress(){
        this.stop_progress();
        setTimeout(()=>{
            this.$btnStart.disabled = true;
            this.$btnStop.disabled = true;
            this.$bar.classList.add('done');
        },300);
    }//end_progress

    update_num(){
        this.$num.textContent = this.#progress / 10;
    }//update_num
    
    /* ----------------------------[Tool]---------------------------- */
    style_bar(progress){
        this.$bar.style.width = `${progress}%`;
    }//style_bar
}//class-ProgressBar



/* ------------------ */
new ProgressBar().init();