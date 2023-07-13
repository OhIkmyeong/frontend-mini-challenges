class StringTransformers{
    constructor(){
        this.cases = [
            {type:"lower", dom : null,},
            {type:"upper", dom : null,},
            {type:"camel", dom : null,},
            {type:"pascal", dom : null,},
            {type:"snake", dom : null,},
            {type:"kebab", dom : null,},
            {type:"trim", dom : null,},
        ];
        this.$ipt = document.getElementById('frm-ipt');
        this.$wrap = document.getElementById('wrap-result');
    }//constructor

    init(){
        this.make_result_area();
        this.fill_result_text();
        this.$ipt.addEventListener('input',()=>{
            this.fill_result_text();
        });
    }//init

    make_result_area(){
        const $frag = document.createDocumentFragment();
        this.cases.forEach(obj=>{
            const $case = document.createElement('ARTICLE');
            const $type = document.createElement('H3');
            const $text = document.createElement('DIV');

            $case.classList.add('tf-case');
            $type.classList.add('tf-case-type');
            $text.classList.add('tf-case-text');

            $type.textContent = `${obj.type} case`;
            obj.dom = $text;
            
            $case.appendChild($type);
            $case.appendChild($text);
            $frag.appendChild($case);
        });
        this.$wrap.appendChild($frag);
    }//make_result_area

    fill_result_text(){
        const val = String(this.$ipt.value);
        if(!val) return;

        this.cases.forEach(obj=>{
            const {dom,type} = obj;
            switch(type){
                case "lower" : {
                    dom.textContent = val.toLowerCase();
                }break;
                case "upper" : {
                    dom.textContent = val.toUpperCase();
                }break;
                case "camel" : {
                    dom.textContent = val.toLowerCase()
                    .split(" ")
                    .reduce((acc,curr)=>{
                        return acc + curr[0].toUpperCase() + curr.substring(1);
                    })
                }break;
                case "pascal" : {
                    dom.textContent = val.toLowerCase()
                    .split(" ")
                    .reduce((acc,curr)=>{
                        return acc + curr[0].toUpperCase() + curr.substring(1);
                    },"")
                }break;
                case "snake" : {
                    dom.textContent = val
                    .split(" ")
                    .join("_");
                }break;
                case "kebab" : {
                    dom.textContent = val
                    .split(" ")
                    .join("-");
                }break;
                case "trim" : {
                    dom.textContent = val
                    .split(" ")
                    .join("");
                }break;
            }//switch
        });//forEach
    }//fill_result_text


}//StringTransformers

new StringTransformers().init();