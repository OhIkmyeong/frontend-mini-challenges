class Accordian{
    constructor(){
        this.$$details = [];

        this.$wrap = document.getElementById('accordian');
        this.cls = "accordian-item";
    }//constructor

    async init(){
        const data = await fetch('./accordian.json').then(res=>res.json()).then(json=>json.faq);
        this.draw(data);
    }//init

    draw(data){
        const $frag = document.createDocumentFragment();

        data.forEach(obj=>{
            const {question,answer} = obj;
            const $details = document.createElement('SECTION');
            const $question = document.createElement('DIV');
            const $answer = document.createElement('DIV');

            $details.classList.add(this.cls);
            $question.classList.add('question');
            $answer.classList.add('answer');
            
            $question.textContent = question;
            $answer.textContent = answer;
            
            $details.appendChild($question);
            $details.appendChild($answer);
            
            this.$$details.push($details);

            $question.addEventListener('click',()=>{
                $details.classList.toggle('on');
                const bool = $details.classList.contains('on');
                if(!bool) return;
                this.on_click_question($details);
            });

            $frag.appendChild($details);
        });
        
        this.$wrap.appendChild($frag);
    }//draw

    on_click_question($details){
        this.$$details.forEach($sib=>{
            if($sib !== $details){$sib.classList.remove('on');}
        });        
    }//on_click_question
}//class-Accordian

await new Accordian().init();