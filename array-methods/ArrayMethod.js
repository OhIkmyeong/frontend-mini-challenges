import { ArrayMethodDomMaker } from "./ArrayMethodDomMaker.js";

export class ArrayMethod extends ArrayMethodDomMaker{
    constructor(){
        super();
        this.ipt = [];
    }//constructor

    /* -------------------------- 🥩[Builder] -------------------------- */
    init(){
        this.$btnAdd.addEventListener('click', this.add_item);
        this.$btnEval.addEventListener('click', this.evaluate);
        this.$btnReset.addEventListener('click', this.reset);
    }//init
    
    /* -------------------------- 🥩[Function] -------------------------- */
    evaluate = () =>{
        this.ipt = this.$ipt.value.split(',');
        const $$am = this.$amWrap.querySelectorAll('.am');
        for(let $am of $$am){
            const type = $am.querySelector('SELECT').value;
            const method = $am.querySelector('INPUT').value.trim();
            if(!method){
                continue;
            }
            //const func = Function(`return function func(value, index, array){ return ${this.input.value} }`);
            // this.ipt = this.ipt[type](func());
            const func = Function(`value`,'index','array',`return ${method}`);
            this.ipt = this.ipt[type](func);
            this.display_result($am);
        }//for
    }//evaluate

    display_result($am){
        const $result = $am.querySelector('.am-result');
        $result.textContent = this.ipt.join(', ');
    }//display_result

    reset = () =>{
        this.ipt = this.$ipt.value.split(',');
        this.$amWrap.innerHTML = "";
    }//reset
}//class-ArrayMethod