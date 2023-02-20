class ChipsInput{
    constructor(){
        this.$result = document.getElementById('cipt-result');
        this.chips = [];
        this.colors = ["rgb(106, 28, 28)","rgb(113, 80, 19)","rgb(111, 111, 19)","rgb(40, 91, 84)","rgb(37, 71, 108)","rgb(75, 64, 123)","#3b3d4c", "#000", "#304030"];
        this.init();
    }//constructor

    init(){
        document.getElementById('cipt-form').addEventListener('submit',this.on_submit);
    }//init

    on_submit = e =>{
        e.preventDefault();
        const $ipt = e.target.cipt;
        const val = $ipt.value;

        const obj = {text:val, time:new Date().getTime()};
        this.chips.push(obj);
        this.add_chip(obj);
        
        $ipt.value = '';
        $ipt.focus();
    }//on_submit

    add_chip(obj){
        const {text,time} = obj;
        const $item = document.createElement('DIV');
        const $text = document.createElement('P');
        const $btn = document.createElement('BUTTON');        

        $item.classList.add('cipt-item');
        $text.classList.add('cipt-item-text');
        $btn.classList.add('cipt-item-del');

        $text.textContent = text;
        $btn.textContent = '❌';

        $item.dataset.time = time;
        $btn.title = "Delete this chip";

        this.random_color($item);
        
        //최종
        $item.appendChild($text);
        $item.appendChild($btn);
        this.$result.appendChild($item);

        //이벤트 추가
        $btn.addEventListener('click',this.on_click_delete_btn, {once:true});
    }//add_chip

    on_click_delete_btn = (e) =>{
        const $btn = e.target;
        const $text = $btn.previousElementSibling;
        const $item = $btn.parentElement;

        const idx = this.chips.findIndex(obj=>obj.text == $text.textContent);
        this.chips.splice(idx,1);

        $item.classList.add('delete');
        $item.addEventListener('animationend',()=>{
            setTimeout(()=>{
                this.$result.removeChild($item);
            },100);
        },{once:true});
    }//on_click_delete_btn

    /* -------- */
    random_color($item){
        const rIdx = parseInt(Math.random() * this.colors.length);
        $item.style.backgroundColor = this.colors[rIdx];
    }//random_color
}//ChipsInput

new ChipsInput();