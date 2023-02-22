class BasicCaculator{
    #data = {
        prev : '',
        curr : '',
    }
    #currFunc = undefined;
    #pressedResult = false;
    
    constructor(){
        this.$output = document.getElementById('caculator-result');
        this.init();
    }//constructor

    init(){
        this.reset();
        document.getElementById('caculator-btns').addEventListener('click',this.on_click_btns);
    }//init

    /**
     * 초기화
     */
    reset(){
        this.#data.curr = "";
        this.#data.prev = "";
        this.#currFunc = undefined;
        this.#pressedResult = false;
        this.$output.textContent = "0";
    }//reset

    /**
     * 결과 표시
     */
    display_output(){
        this.$output.textContent = this.#currFunc ? this.#data.curr : this.#data.prev;
    }//display_output

    /**
     * 결과 표시(2)
     *  = 버튼을 눌렀을때는 무조건 this.#data.curr만 나옵니다.
     */
    display_output_prev(){
        this.$output.textContent = this.#data.prev;
    }//display_output_prev

    /**
     * 버튼 클릭시
     * @param {*} e 
     * @returns 
     */
    on_click_btns = e =>{
        if(!e.target.classList.contains('btn')) return;
        const val = e.target.dataset.value;
        if(e.target.dataset.type == "num") this.on_click_num(val);
        if(e.target.dataset.type == "func") this.on_click_func(val);
        if(e.target.dataset.type == "res") this.on_click_res(val);
    }//on_click_btns

    /* ---------- */

    /**
     * 일반 숫자 버튼
     * @param {} val 
     * @returns 
     */
    on_click_num(val){
        const prev_or_curr = this.#currFunc ? "curr" : "prev";
        console.log(prev_or_curr);
        if(this.#data[prev_or_curr].includes('.') && val == "dot") return;
        this.#data[prev_or_curr] += val == "dot" ? "." : val;
        this.display_output();
    }//on_click_num

    /**
     * 사칙연산
     * @param {*} val 
     * @returns 
     */
    on_click_func(val){
        if(!this.#data.prev){
            if(val == "minus") this.#data.prev += "-";
            return;
        }
        if(this.#pressedResult){
            this.#pressedResult = false;
            this.#data.curr = '';
        }
        if(this.#currFunc && this.#data.curr){
            this.caculate();
            this.#currFunc = undefined;
            this.display_output();
            this.#data.curr = '';
        }
        this.#currFunc = val;
    }//on_click_func

    /**
     * =, C 클릭시
     * @param {*} val 
     * @returns 
     */
    on_click_res(val){
        switch(val){
            case "equal" : {
                if(!this.#data.prev || !this.#data.curr || !this.#currFunc) return;
                this.#pressedResult = true;
                this.caculate();
                this.display_output_prev();
            }break;
            case "reset" : {
                this.reset();
            }break;
        }
    }//on_click_res

    /* ------- */
    /**
     * 계산
     */
    caculate(){
        const curr = Number(this.#data.curr);
        const prev = Number(this.#data.prev);
        switch(this.#currFunc){
            case "plus" : {
                this.#data.prev = String(prev + curr);
            }break;
            case "minus" : {
                this.#data.prev = String(prev - curr);
            }break;
            case "multiply" : {
                this.#data.prev = String(prev * curr);
            }break;
            case "divide" : {
                this.#data.prev = String(prev / curr);
            }break;
        }//switch
    }//caculate
}//BasicCaculator

new BasicCaculator();