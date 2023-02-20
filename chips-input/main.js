class ChipsInput{
    constructor(){
        this.$result = document.getElementById('cipt-result');
        this.$ipt = document.getElementById('cipt');
        this.chips = [];
        this.colors = ["rgb(106, 28, 28)","rgb(113, 80, 19)","rgb(111, 111, 19)","rgb(40, 91, 84)","rgb(37, 71, 108)","rgb(75, 64, 123)","#3b3d4c", "#000", "#304030"];
        this.recentTag = 'cipt-item-recent';
        this.init();
    }//constructor

    init(){
        document.getElementById('cipt-form').addEventListener('submit',this.on_submit);
        this.$ipt.addEventListener('keyup', this.on_keyup);
        document.getElementById('cipt-remove-all').addEventListener('click',this.remove_item_all);
    }//init

    on_submit = e =>{
        e.preventDefault();
    }//on_submit

    on_keyup = e =>{
        const val = e.target.value;
        const $item = this.get_recent_item();

        if(!val){
            this.remove_item($item);
            return;
        }

        if(e.key == "Enter"){
            this.$ipt.value = '';
            this.$ipt.focus();
            $item.classList.remove(this.recentTag);
            $item.classList.add('added');
        }

        const $text = $item.querySelector('.cipt-item-text');
        $text.textContent = val;
    }//on_keyup

    get_recent_item(){
        let $item = this.$result.querySelector('.'+this.recentTag);
        if(!$item){
            $item = this.make_chip();
            $item.classList.add(this.recentTag);
            this.$result.appendChild($item);
        }
        return $item;
    }//get_recent_item

    make_chip(){
        const $item = document.createElement('DIV');
        const $text = document.createElement('P');
        const $btn = document.createElement('BUTTON');        

        $item.classList.add('cipt-item');
        $text.classList.add('cipt-item-text');
        $btn.classList.add('cipt-item-del');

        $btn.textContent = '❌';

        $btn.title = "Delete this chip";

        this.random_color($item);
        
        //최종
        $item.appendChild($text);
        $item.appendChild($btn);

        //이벤트 추가
        $btn.addEventListener('click',this.on_click_delete_btn, {once:true});

        //반환
        return $item;
    }//make_chip

    on_click_delete_btn = (e) =>{
        const $btn = e.target;
        const $text = $btn.previousElementSibling;
        const $item = $btn.parentElement;

        const idx = this.chips.findIndex(obj=>obj.text == $text.textContent);
        this.chips.splice(idx,1);

        this.remove_item($item);
    }//on_click_delete_btn

    remove_item($item){
        $item.classList.add('delete');
        $item.addEventListener('animationend',()=>{
            setTimeout(()=>{
                this.$result.removeChild($item);
            },100);
        },{once:true});
    }//remove_item

    remove_item_all = _ =>{
        this.$ipt.value = '';
        const $$item = this.$result.querySelectorAll('.cipt-item');
        $$item.forEach(($item,idx)=>{
            setTimeout(()=>{
                this.remove_item($item);
            },100*($$item.length - idx));
        });
    }//remove_item_all

    /* -------- */
    random_color($item){
        const rIdx = parseInt(Math.random() * this.colors.length);
        $item.style.backgroundColor = this.colors[rIdx];
    }//random_color
}//ChipsInput

new ChipsInput();