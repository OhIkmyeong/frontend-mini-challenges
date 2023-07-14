import { suggestionsList } from "./data.js";

{
    /** 그냥 데이터 리스트 만들어서 하면 개간단 */
    const $dtl = document.getElementById('dtl');
    const $frag = document.createDocumentFragment();
    suggestionsList.forEach(val =>{
        const $opt = document.createElement('OPTION');
        $opt.value = val;
        $frag.appendChild($opt);
    });
    $dtl.appendChild($frag);

}

class TypeAhead{
    constructor(){
        this.$ipt = document.getElementById('ipt-cs');
        this.$result= document.getElementById('result');
        this.data = [...suggestionsList];
    }//constructor

    init(){
        this.$ipt.addEventListener('input', this.on_input)
        this.$ipt.addEventListener('keydown', this.on_keydown)
    }//init

    on_keydown = e =>{
        const {code} = e;
        if(code === "Enter"){this.reset_result(); return;}
        if(code.indexOf("Arrow") < 0) return;
        const $$li = this.$result.querySelectorAll('LI');
        const liLen = $$li.length;
        const $on = this.$result.querySelector('.on');
        let $elem = null;

        $on?.classList?.remove('on');
        
        switch(code){
            case "ArrowDown" : {
                $elem = $on ? $on.nextElementSibling : $$li[0];
                if(!$elem){$elem = $$li[0];}
            }break;
            case "ArrowUp" : {
                $elem = $on ? $on.previousElementSibling : $$li[liLen-1];
                if(!$elem){$elem = $$li[liLen-1];}
            }break;
        }//switch

        $elem.classList.add('on');
        const val = $elem.textContent;
        this.$ipt.value = val;

        $elem.scrollIntoView({behavior:"smooth", block : "center"})
    }//on_keydown

    reset_result(){
        this.$result.innerHTML = "";
    }

    on_input = (e) =>{
        const val = e.currentTarget.value.toLowerCase();
        this.reset_result();

        if(!val) return;

        const result = [];
        this.data.forEach(el =>{
            if(el.toLowerCase().indexOf(val) > -1){result.push(el);}
        });

        result.forEach(data =>{
            const $li = document.createElement('LI');
            $li.textContent = data;
            $li.tabIndex = 0;
            this.$result.appendChild($li);

            $li.addEventListener('click', ()=>{
                this.reset_result();
                this.$ipt.value = data;
            });
        });
    }//on_input
}//class-TypeAhead

new TypeAhead().init();