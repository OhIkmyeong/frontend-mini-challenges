class GuessTheNumber{
    #answer;
    constructor(){
        this.$guess = document.getElementById('ipt-guess');
        this.$submit = document.getElementById('btn-smt');
        this.$hint = document.getElementById('gs-res-hint');
        this.$list = document.getElementById('gs-res-list'); 
        this.$reset = document.getElementById('btn-reset');
        this.list = [];
        this.init();
    }//constructor

    init(){
        this.reset();
        document.getElementById('form-guess').addEventListener('submit',this.on_submit);
        this.$reset.addEventListener('click',this.reset);
    }//init

    reset = () =>{
        this.set_answer();
        this.toggle_result(false);

        this.list = [];

        setTimeout(()=>{
            this.$guess.value = '';
            this.$hint.textContent = '';
            this.$list.textContent = '';
            this.$submit.disabled = false;
            this.$reset.disabled = true;
        },500);
    }//reset

    toggle_result(bool){
        document.querySelector('.gs-res').classList.toggle('off',!bool);
    }//toggle_result

    set_answer(){
        this.#answer = Math.round(Math.random() * 100);
    }//set_answer

    on_submit = e =>{
        e.preventDefault();
        const val = Number(this.$guess.value);
        if(!val && val !== 0) return;
        this.$guess.value = '';
        this.toggle_result(true);
        
        /* 정답인 경우 */
        if(val == this.#answer){
            this.$hint.innerHTML = `💝You Got it! <strong>${this.#answer}</strong>`;
            this.$submit.disabled = true;
            this.$reset.disabled = false;
            return;
        }

        /* 오답인 경우 */
        /* 이미 포함한 오답인경우 */
        if(this.list.includes(val)){
            this.$hint.innerHTML = `You've aleady submitted <strong class="wrong">${val}</strong>`;
        }else{
            this.list.push(val);

            this.$hint.innerHTML = `<strong class="wrong">${val}</strong> is ${val > this.#answer ? "Higher" : "Lower"} than Answer`;

            const $wrong = document.createElement('SPAN');
            $wrong.textContent = val;
            this.$list.appendChild($wrong);
        }
    }//on_submit
}//GuessTheNumber


new GuessTheNumber();