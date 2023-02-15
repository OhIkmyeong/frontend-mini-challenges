class Counter{
    #result = 0;
    #per = 1;
    
    constructor(){
        this.$result = document.getElementById('counter-result');
        this.$form = document.getElementById('counter-form');
        this.$per = document.getElementsByClassName('ipt-per')[0];
        this.init();
    }//constructor

    init(){
        this.set_per();
        this.display_result();
        this.$form.addEventListener('submit',e => e.preventDefault());
        this.$form.addEventListener('change',this.on_change);
        this.$form.addEventListener('click',this.on_click);
    }//init

    set_per(){
        this.#per = this.$per.value;
    }//set_per

    display_result(){
        this.$result.textContent = this.#result;
    }//display_result

    on_change = e =>{
        if(!(e.target.classList.contains('ipt-per'))) return;
        this.set_per();
    }//on_change

    on_click = e =>{
        switch(e.target.dataset.btn){
            case "min" : {
                this.#result -= Number(this.#per);
            }break;
            case "pls" : {
                this.#result += Number(this.#per);
            }break;
            case "rst" : {
                this.$per.value = 1;
                this.set_per();
                this.#result = 0;
            }break;
        }//switch

        this.display_result();
    }//on_click
}//Counter

new Counter();