class MultiTyping {
    constructor() {
        this.wordList = ["Worker", "Engineer", "Adult", "Student", "Designer", "Sorcerer"];
        this.$typing = document.querySelector('.multi-type-text-typing .text');
        this.$bar = document.querySelector('.bar');
        this.idx = 0;
    }//constructor

    init() {
        this.change_text();
        this.animate_text();
    }//init

    change_text() {
        this.$typing.textContent = this.wordList[this.idx];
        this.idx++;
        if(this.idx >= this.wordList.length){this.idx = 0;}
    }//change_text

    animate_text(){
        const per100 = "calc(100% - 3px)";
        this.$bar.style.transform = `translateX(${per100})`; 
        const ani = this.$bar.animate([
            {transform : 'translateX(0%)'},
            {transform : `translateX(${per100})`},
            {transform : `translateX(${per100})`},
            {transform : 'translateX(0%)'},
        ],{
            duration : 4000,
            easing : "steps(21,jump-none)",
            fill : "both"
        });

        ani.addEventListener('finish',()=>{
            this.init();
        },{once:true});
    }//animate_text

}//class-MultiTyping

new MultiTyping().init();