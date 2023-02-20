class PasswordGenerator{
    constructor(){
        this.$form = document.getElementById("wrap-pw-gnr");
        this.$result = document.getElementById('pw-gnr');
        this.$btnCopy = document.getElementById('pw-gnr-copy');
        this. specialChars = ['!','@','#','$','%','^','&','*','(',')',',','.','/','>','<','?','~',';',':','[',']','{','}'];
        this.functionMap = {
            lower :()=>String.fromCodePoint(97 + Math.floor(Math.random() * 26)),
            upper :()=>String.fromCodePoint(65 + Math.floor(Math.random() * 26)),
            numeric :()=>String.fromCodePoint(48 + Math.floor(Math.random() * 9)),
            symbols :()=> this.specialChars[Math.floor(Math.random() * this.specialChars.length)]
        };
        
        this.init();
    }//constructor

    init(){
        this.$form.addEventListener("change",this.check_at_least_one);
        this.$btnCopy.addEventListener('click',this.on_copy);
        this.$form.addEventListener("submit",this.on_submit);
    }//init

    /**
     * 
     * @param {*} _
     * @url https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText 
     */
    on_copy = _ => {
        window.navigator.clipboard.writeText(this.$result.value);
    }//on_copy

    get_checked_type = () =>{
        return Array.from(document.querySelectorAll('[name="pw-gnr-type"]'))
        .filter($check=>$check.checked)
        .map($check=>$check.value);
    }//get_checked_type

    check_at_least_one = e =>{
        const type = this.get_checked_type();
        if(!(type?.length)) e.target.checked = true;
    }//check_at_least_one

    /* ----------- */
    on_submit = e =>{
        e.preventDefault();
        this.$result.value = 'test';

        const len = Number(document.getElementById('pwGnrLength').value);
        const type = this.get_checked_type();

        const typeCount = Array(type.length).fill(1);
        while(typeCount.reduce((acc,curr)=>acc+curr,0) < len){
            typeCount[parseInt(Math.random() * type.length)] += 1;
        }
        const candidate = [];

        type.forEach((key,idx)=>{
            for(let i=0; i<typeCount[idx]; i++){
                candidate.push(this.functionMap[key]());
            }
        });

        let password = '';

        while(candidate.length){
            const rIdx = parseInt(Math.random() * candidate.length);
            password += candidate.splice(rIdx,1);
        }

        this.$result.value = password;
    }//on_submit
}//PasswordGenerator

new PasswordGenerator();