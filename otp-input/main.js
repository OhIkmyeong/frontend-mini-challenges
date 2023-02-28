class OtpInput{
    constructor(){
        this.$form = document.getElementById('form-otp');
        this.$$ipt  = [];
        this.otpLength = 0;
    }//constructor

    make_ipts(num = 1){
        this.$form.innerHTML = '';
        
        this.otpLength = num;

        const $frag = document.createDocumentFragment();
        
        for(let i=0; i<this.otpLength; i++){
            const $ipt = document.createElement('INPUT');
            $ipt.classList.add('otp-ipt');
            $ipt.type="text";
            $ipt.setAttribute('inputmode','numeric');
            $ipt.setAttribute('maxlength','1');
            $ipt.setAttribute('placeholder','0');
            $frag.appendChild($ipt);
            this.$$ipt.push($ipt);
        }//for

        this.$form.appendChild($frag);
    }//make_ipts

    init(){
        this.$form.addEventListener('paste', this.on_paste);
        this.$form.addEventListener('input', this.on_input);
        this.$form.addEventListener('keydown', this.on_keydown);
        this.$form.addEventListener('keyup', this.on_keyup);
    }//init

    /* ---------- Event ---------- */
    /**
     * 붙여넣기 이벤트
     * mdn Event List, paste Event
     * @url https://developer.mozilla.org/en-US/docs/Web/Events
     * @url https://developer.mozilla.org/en-US/docs/Web/API/Document/paste_event
     */
    on_paste = (e) =>{
        const clipboardData = e.clipboardData  || window.clipboardData;
        const pastedData = clipboardData.getData('text');

        if(typeof pastedData != "string") return;
        if(pastedData.length !== this.otpLength) return;
        if(!this.is_digit(pastedData)) return;
        this.$$ipt.forEach(($ipt,idx)=>{
            $ipt.value = pastedData.charAt(idx);
        });
    }//on_paste

    /**
     * input
     * @param {*} e 
     */
    on_input = e =>{
        const $ipt = e.target;
        const val = $ipt.value.trim();
        if(!this.is_digit(val) || !val){
            this.ipt_value_null($ipt);
            return;
        }

        const $nextIpt = $ipt.nextElementSibling;
        const $firstIpt = this.$$ipt[0];
        
        if($nextIpt){
            $nextIpt.focus();
        }else if(!$firstIpt.value.trim()){
            $firstIpt.focus();
        }else{
            $ipt.blur();
        }
    }//on_input

    /**
     * keydown
     * @param {*} e 
     */
    on_keydown = e =>{
        const $ipt = e.target;
        const val = $ipt.value;
        if(!this.is_digit(val)){
            this.ipt_value_null($ipt);
            // return;
        }
        const {key} = e;

        switch(key){
            case "ArrowLeft" : {
                e.preventDefault();
                e.stopPropagation();
                const $prev = $ipt.previousElementSibling; 
                if($prev){
                    $prev.focus();
                    $prev.select();
                }
            }break;

            case "ArrowRight" : {
                e.preventDefault();
                e.stopPropagation();
                const $next = $ipt.nextElementSibling;
                if($next){
                    $next.focus();
                    $next.select();
                } 
            }break;
        }//switch
        
    }//on_keydown
    
    /**
     * keyup
     * @param {*} e 
     */
    on_keyup = e =>{
        const $ipt = e.target;
        if(e.key == "Backspace" || e.key == "Delete"){
            this.ipt_value_null($ipt);
            const $prev = $ipt.previousElementSibling;
            if($prev){
                $prev.focus();
                $prev.select();
            }
        }
    }//on_keyup

    /* ---------- Functions ---------- */
    /**
     * is value all Digits?
     * @param {String} val 
     * @returns {Boolean}Boolean
     */
    is_digit(val){
        const reg = /^\d+$/; 
        return reg.test(val);
    }//is_digit

    /**
     * make input's value null;
     * @param {DOM} $ipt 
     */
    ipt_value_null($ipt){
        $ipt.value = '';
    }//ipt_value_null
}//class-OtpInput

const OTP = new OtpInput();

OTP.make_ipts(6);
OTP.init();

