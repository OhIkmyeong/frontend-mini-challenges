class ColorSpotter{
    #score = 0;
    #scoreMax = 0;
    #size = 0;
    #life = 0;

    constructor(){
        this.$score = document.getElementById('score');
        this.$scoreMax = document.getElementById('score-max');
        this.$life = document.getElementById('life');
        this.$form = document.getElementById('form-cp');
        this.$board = document.getElementById('board-cp');

        this.CONSTANTS = Object.freeze({
            scoreMax : 100,
            lifeDefault : 3,
            initialSize : 2
        });

        this.time = null;

        this.STARTED = false;

        this.init();
    }//constructor

    init(){
        const {lifeDefault, initialSize} = this.CONSTANTS;
        /* initial value */
        this.#size = initialSize;
        document.getElementById('sizeStart').value = initialSize;
        document.getElementById('sizeStartOutput').value = initialSize;

        this.#life = lifeDefault;

        /* reset */
        this.reset();

        /* size를 조정하면 게임이 리셋됩니다. */
        this.$form.addEventListener('change',()=>{this.reset();});
    }//init
    
    /** reset All */
    reset(){
        this.STARTED = false;

        this.#score = 0;
        this.update_score();
        this.update_max_score();

        this.#life = this.CONSTANTS.lifeDefault;
        this.update_life();

        this.toggle_able_size();
        this.#size = document.getElementById('sizeStart').value;

        this.$board.classList.remove('wrong');
        this.draw_board();

        this.time = new Date().getTime();

        /* add Event */
        this.add_evt_click_board();
    }//reset

    /**
     * input size의 조정 여부를 결정합니다
     */
    toggle_able_size(){
        document.getElementById('sizeStart').disabled = this.STARTED;
    }//toggle_able_size

    /**
     * 현재 점수를 업데이트 합니다.
     * @param {Number} num 
     */
    update_score(num=0){
        this.#score += num;
        if(this.#score < 0) this.#score = 0;
        this.$score.textContent = this.#score;
        if(this.#score > this.#scoreMax) this.update_max_score();
    }//update_score

    /**
     * 현재 점수가 최고 점수 보다 높으면, 최고 점수를 갱신
     */
    update_max_score(){
        if(this.#scoreMax > this.#score) return;
        this.#scoreMax = this.#score;
        this.$scoreMax.textContent = this.#scoreMax;
    }//update_max_score

    /**
     * life의 현 상황을 반영합니다.
     */
    update_life(){
        const heart = '🧡';
        this.$life.textContent = '';
        for(let i=0; i<this.#life; i++){
            this.$life.textContent += heart;    
        }
    }//update_life

    /**
     * draw board
     */
    draw_board(){
        this.$board.innerHTML = '';
        const $frag = document.createDocumentFragment();

        const cellCount = this.#size**2;
        const randomIdx = parseInt(Math.random() * cellCount);

        //random color
        const rgb = this.random_color();
        this.$board.style.setProperty('--r',rgb[0]);
        this.$board.style.setProperty('--g',rgb[1]);
        this.$board.style.setProperty('--b',rgb[2]);

        
        //make DOM
        for(let i=0; i<cellCount; i++){
            const $cell = document.createElement('DIV');
            $cell.classList.add('cell');
            if(i == randomIdx){
                $cell.classList.add('cell-odd');
                this.odd_color($cell,rgb);
            }
            $frag.appendChild($cell);
        }//for

        //grid style
        const repeatStyle = `repeat(${this.#size},1fr)`;
        this.$board.style.gridTemplateColumns = repeatStyle;
        this.$board.style.gridTemplateRows = repeatStyle;

        //DOM 추가
        this.$board.appendChild($frag);
    }//draw_board

    /**
     * @returns {Array}[r,g,b]
     */
    random_color(){
        const rgb = [];
        rgb.push(Math.round(Math.random() * 255));
        rgb.push(Math.round(Math.random() * 255));
        rgb.push(Math.round(Math.random() * 255));
        return rgb;
    }//random_color

    /**
     * coloring background oddly
     * @param {DOM} $cell 
     * @param {Array} rgb 
     */
    odd_color($cell,rgb){
        const [r,g,b] = rgb.map(clr => this.random_odd_color(clr));
        $cell.style.background = `rgb(${r},${g},${b})`
    }//odd_color

    /**
     * 
     * @param {Number} hex 
     * @returns {Number} hexOdd
     */
    random_odd_color(hex){
        const max = 30;
        const min = 10;
        const per = (Math.random() * (max-min)) + min;
        let odd = hex;

        if(odd - per < 0){
            odd += per;
        }else if(odd + per > 255){
            odd -= per
        }else{
            Math.round(Math.random()) > 0 ? odd += per : odd -= per;
        }
        return odd
    }//random_odd_color

    /** board에 클릭 이벤트를 더한다 */
    add_evt_click_board(){
        this.$board.addEventListener('click',this.on_click_board,{once:true});
    }//add_evt_click_board

    /** on click board */
    on_click_board = e =>{
        /* GAME START로 변경 */
        if(!this.STARTED){
            this.STARTED = true;
            this.toggle_able_size();
        }

        if(!(e.target.classList.contains('cell'))) return;

        if(e.target.classList.contains('cell-odd')){
            /* 옳게 클릭했을시 */
            this.update_score(Number(this.#size));
            this.#size++;

            /* [승리]일정 점수 초과 */
            if(this.#score >= 200){
                this.win();
                return;
            }
        }else{
            /* 틀렸을시 */
            this.#life -= 1;
            this.update_life();
            this.wrong_answer();

            if(this.#life <= 0){
                /* [패배]목숨이 다하면 */
                this.gameover();
                return
            }
        }
        
        /* 승리 점수 미달시 다음 판 진행 */
        this.draw_board();
        this.add_evt_click_board();
    }//on_click_board

    /**
     * 
     * @param {String} message 
     */
    make_popup(message){
        const $popup = document.createElement('DIV');
        const $btnReset = document.createElement('BUTTON');
        const time = (new Date().getTime() - this.time) / 1000;
        $popup.id = "popup-result";
        $popup.innerHTML = `
            <h2>${message}</h2>
            <p>Final Score : <strong>${this.#score}</strong></p>
            <p>Size : ${this.#size - 1} x ${this.#size - 1}</p>
            <p>Time : ${time.toFixed(1)}sec</p>`;
        $btnReset.id = 'btn-reset';
        $btnReset.textContent = 'PLAY AGAIN';
        
        //DOM 추가
        $popup.appendChild($btnReset);
        this.$board.appendChild($popup);

        //이벤트 추가
        $btnReset.addEventListener('click',()=>{
            this.$board.removeChild($popup);
            setTimeout(()=>{
                this.reset();
            }, 1000);
        },{once:true})
    }//make_popup
    
    /**
     * WIN
     */
    win(){
        this.make_popup("✨You WIN!✨");
    }//win

    /**
     * GAME OVER
     */
    gameover(){
        this.wrong_answer();

        this.$board.addEventListener('animationend',()=>{
            setTimeout(()=>{
                this.make_popup("😭YOU LOST...");
            },1000);
        },{once:true});
    }//gameover

    /**
     * Wrong Answer
     */
    wrong_answer(){
        this.$board.classList.add('wrong');
        const $answer = this.$board.querySelector('.cell-odd');
        $answer.style.zIndex = '10';
        $answer.style.border = '5px solid #fff';
        $answer.style.boxShadow = '0 0 2rem rgba(0,0,0,.5)';

        this.$board.addEventListener('animationend',()=>{
            this.$board.classList.remove('wrong');
        },{once:true});
    }//wrong_answer
}//ColorSpotter


const GAME = new ColorSpotter();