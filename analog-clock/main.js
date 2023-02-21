class AnalogClock{
    constructor(){
        this.$hour = document.getElementById("clock-hands-hour");
        this.$min = document.getElementById("clock-hands-min");
        this.$sec = document.getElementById("clock-hands-sec");
        this.hour = null;
        this.min = null;
        this.sec = null;
        this.init();
    }//constructor

    init(){
        this.draw_nums();
        setInterval(this.display_time,1000);
        // this.display_time(); //setInterval일땐 안 씀
    }//init

    draw_nums(){
        const $nums = document.getElementById("clock-nums");
        const $frag = document.createDocumentFragment();

        for(let i=0; i<12; i++){
            const $num = document.createElement('DIV');
            const $span = document.createElement('SPAN');
            const num = i + 1;
            $num.style.setProperty('--num',num);
            $span.textContent = num;
            $num.appendChild($span);
            $frag.appendChild($num);
        }
        
        $nums.appendChild($frag);
    }//draw_nums

    display_time = () =>{
        const time = new Date();
        this.hands_sec(time);
        this.hands_min(time);
        this.hands_hour(time);

        // setTimeout(this.display_time, 1000); //setInterval일땐 안 써야 되는거 알지?
    }//display_time

    hands_hour(time){
        this.hour = time.getHours();
        const degPer = 360 / 12;
        const deg = degPer * (this.hour > 12 ? this.hour - 12 : this.hour);
        const plus = time.getMinutes() / 2;
        this.$hour.style.transform = `rotate(${deg + plus}deg)`;
    }//hands_hour

    hands_min(time){
        this.min = time.getMinutes();
        const degPer = 360 / 60;
        const deg = degPer * this.min;
        const plus = time.getSeconds() / 10;
        this.$min.style.transform = `rotate(${deg + plus}deg)`;
    }//hands_min

    hands_sec(time){
        this.sec = time.getSeconds();
        const degPer = 360 / 60;
        const deg = degPer * this.sec;
        this.$sec.style.transform = `rotate(${deg}deg)`;
    }//hands_sec
}//AnalogClock

new AnalogClock();