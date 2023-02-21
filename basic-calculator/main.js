class BasicCaculator{
    #curr = '';
    #prev = '';
    #result = '';
    
    constructor(){
        this.$output = document.getElementById('caculator-result');
        this.currFunc = null;
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
        this.currFunc = null;
        this.#curr = "";
        this.#prev = "";
        this.#result = 0;
        this.display_output_result();
    }//reset

    /**
     * 결과 표시
     */
    display_output_result(){
        this.$output.textContent = this.#result;
    }//display_output_result

    /**
     * 현재 입력 표시
     */
    display_output_curr(){
        this.$output.textContent = this.#curr;
    }//display_output_curr

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
        if(this.#curr.includes('.') && val == "dot") return;
        this.#curr += val == "dot" ? "." : val;
        this.display_output_curr();
    }//on_click_num

    /**
     * 사칙연산
     * @param {*} val 
     * @returns 
     */
    on_click_func(val){
        
    }//on_click_func

    /**
     * =, C 클릭시
     * @param {*} val 
     * @returns 
     */
    on_click_res(val){
        switch(val){
            case "equal" : {
                
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
        const curr = Number(this.#curr);
        const prev = Number(this.#prev);
        switch(this.currFunc){
            case "plus" : {
                this.#result = String(prev + curr);
            }break;
            case "minus" : {
                this.#result = String(prev - curr);
            }break;
            case "multiply" : {
                this.#result = String(prev * curr);
            }break;
            case "divide" : {
                this.#result = String(prev / curr);
            }break;
        }//switch

        this.display_output_result();
    }//caculate
}//BasicCaculator

new BasicCaculator();