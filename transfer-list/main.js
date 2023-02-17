class TransferList{
    constructor(){
        this.$wrap = document.getElementById('wrap-tf-list');
        this.$left = document.getElementById('tf-list-left');
        this.$right = document.getElementById('tf-list-right');
        
        this.$btnLeftAll = document.getElementById('tf-left-all');
        this.$btnRightAll = document.getElementById('tf-right-all');
        this.$btnLeft = document.getElementById('tf-left');
        this.$btnRight = document.getElementById('tf-right');

        this.init();
    }//constructor

    init(){
        this.set_state();

        this.$wrap.addEventListener('click',(e)=>{
            if(e.target.tagName == "INPUT") this.set_state();
            if(e.target.tagName == "BUTTON") {
                this.on_click_btn(e.target);
                this.set_state();
            }
        });
    }//init

    on_click_btn = $btn => {
        switch($btn.id){
            case "tf-left-all" : {
                const $$ipt = this.$wrap.querySelectorAll('input');
                this.transfer($$ipt,"left");
            }break;

            case "tf-right-all" : {
                const $$ipt = this.$wrap.querySelectorAll('input');
                this.transfer($$ipt,"right");
            }break;

            case "tf-left" : {
                const $$ipt = this.$right.querySelectorAll('input:checked');
                this.transfer($$ipt,"left");
            }break;

            case "tf-right" : {
                const $$ipt = this.$left.querySelectorAll('input:checked');
                this.transfer($$ipt,"right");
            }break;
        }//switch
    }//on_click_btn

    set_state(){
        this.$btnLeftAll.disabled = !(this.$right.childElementCount) || this.$wrap.querySelector('input[type="checkbox"]:checked');
        this.$btnRightAll.disabled = !(this.$left.childElementCount) || this.$wrap.querySelector('input[type="checkbox"]:checked');
        this.$btnLeft.disabled = !(this.$right.querySelector('input[type="checkbox"]:checked'));
        this.$btnRight.disabled = !(this.$left.querySelector('input[type="checkbox"]:checked'));
    }//set_state

    /* --------- */

    /**
     * 
     * @param {DOM} $$ipt 
     * @param {String} dir left | right 
     */
    transfer($$ipt,dir="left"){
        const $list = document.getElementById(`tf-list-${dir}`);
        const $frag = document.createDocumentFragment();
        $$ipt.forEach($ipt => {
            const $li = $ipt.parentElement.parentElement;
            $ipt.checked = false;
            $frag.appendChild($li);
        });
        $list.appendChild($frag);
    }//transfer_to_right
}//TransferList

new TransferList();