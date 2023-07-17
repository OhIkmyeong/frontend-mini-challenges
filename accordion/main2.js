class Accordian{
    constructor(){
        this.$$details = [];

        this.$wrap = document.getElementById('accordian');
        this.cls = "accordian-item";
    }//constructor

    async init(){
        const data = await fetch('./accordian.json').then(res=>res.json()).then(json=>json.faq);
        console.log(data);
        this.draw(data);
        this.$$details.forEach($details =>{
            $details.addEventListener('toggle',()=>{
                if(!$details.open) return;
                const $content = $details.querySelector('ARTICLE');
                $content.animate([
                    {opacity:0},
                    {opacity:0},
                    {opacity:1},
                ],{
                    duration : 1000,
                    fill : "both",
                    easing : "linear"
                });//animate

                setTimeout(()=>{
                    this.$$details.forEach($sib =>{
                        if($sib !== $details) $sib.open = false;
                    });
                },250);

            });//toggle
        });//forEach
    }//init

    draw(data){
        const $frag = document.createDocumentFragment();

        data.forEach(obj=>{
            const {question,answer} = obj;
            const $details = document.createElement('DETAILS');
            const $summary = document.createElement('SUMMARY');
            const $content = document.createElement('ARTICLE');
            $details.classList.add(this.cls);
            $summary.textContent = question;
            $content.textContent = answer;
            $details.appendChild($summary);
            $details.appendChild($content);
            this.$$details.push($details);
            $frag.appendChild($details);
        });
        
        this.$wrap.appendChild($frag);
    }//draw

}//class-Accordian

await new Accordian().init();