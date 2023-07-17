class LiftSimulator{
    #speed = 500;
    
    constructor(){
        this.$form = document.getElementById('frm');
        this.$wrap = document.getElementById('wrap');
        this.$$lift = [];
        this.watingList = [];
    }//constructor

    init(){
        this.$form.addEventListener('submit', this.on_submit_form)
        this.$form.addEventListener('reset', this.on_reset);
    }//init

    on_submit_form = (e) =>{
        e.preventDefault();
        this.toggle_form(true);
        this.reset_result();
        this.draw_floors(Number(e.target.floorValue.value));
        this.draw_lifts(Number(e.target.liftValue.value));
    }//on_submit_form

    on_reset = () =>{
        this.toggle_form(false);
        this.reset_result();
        this.$$lift = [];
        this.watingList = [];
    }//on_reset

    reset_result(){
        this.$wrap.innerHTML = "";
    }//reset_result

    toggle_form(hide=false){
        const $$elem = this.$form.children;
        for(const $elem of $$elem){
            if($elem.type == "submit"){
                $elem.classList.toggle('off', hide);
            }else if($elem.type =="reset"){
                $elem.classList.toggle('off', !hide);
            }else{
                $elem.style.display = hide ? "none" : "inherit";
            }
        }//for
    }//toggle_form

    on_click_btn = async (e, $floor, floorNum) =>{
        const $btn = e.currentTarget;
        let $lift = this.find_lift(floorNum);
        
        if(!$lift) {
            this.watingList.push({$floor,floorNum});
            $btn.disabled = false;
            return;
        }
        await this.lift_simulate($lift,$floor,floorNum);
        $btn.disabled = false;

        while(this.watingList.length){
            const {$floor:$floorCurr, floorNum:floorNumCurr} = this.watingList.shift();;
            const $liftCurr = this.find_lift(floorNumCurr);
            if(!$liftCurr){
                console.log('아직 없음');
            }else{
                await this.lift_simulate($liftCurr,$floorCurr,floorNumCurr);
            }
        }//while
    }//on_click_btn

    async lift_simulate($lift,$floor, floorNum){
        $lift.classList.add('moving');
        $lift.dataset.curr = floorNum;
        
        await this.move_lift({$lift, $floor});
        await this.open_door($lift);
        await this.close_door($lift);

        $lift.classList.remove('moving');
    }//lift_simulate

    find_lift(floorNum){
        const $lift = this.$$lift.find($cand => {
            if(!$cand.classList.contains('moving') && $cand.dataset.curr != floorNum) return $cand;
        });
        return $lift;
    }//find_lift

    move_lift(info){
        const {$lift,$floor} = info;
        const currFloorNum = $lift.dataset?.curr;
        const prevFloorNum = $lift.dataset.prev || 1;
        const speed = this.#speed * Math.abs(prevFloorNum - currFloorNum);
        const {top:wrapTop, height:wrapHeight} = this.$wrap.getBoundingClientRect();
        const {top} = $floor.getBoundingClientRect();

        return new Promise((res)=>{
            const moveToTop = (wrapHeight - (top - wrapTop)) * -1 + 135 + 20;

            const moveTo = $lift.animate([{
                transform : `translateY(${moveToTop}px)`
            }],{
                duration : speed,
                fill : "both",
                easing : "linear"
            });

            moveTo.addEventListener('finish',()=>{
                $lift.dataset.prev = currFloorNum;
                res();
            });

        });
    }//move_lift

    open_door($lift){
        return new Promise((res)=>{
            $lift.classList.add('open');    
            const $door = $lift.querySelector('.lift-door'); 
            $door.addEventListener('transitionend',()=>{
                setTimeout(()=>{
                    res();
                },2000);
            });
        });
    }//open_door
    close_door($lift){
        return new Promise((res)=>{
            $lift.classList.remove('open');    
            const $door = $lift.querySelector('.lift-door'); 
            $door.addEventListener('transitionend',()=>{res();});
        });
    }//close_door

    /* ------------------- */

    add_on_click_btn($btn,$floor,floorNum){
        $btn.addEventListener('click',async(e) =>{
            $btn.disabled = true;
            await this.on_click_btn(e, $floor, floorNum);
        });
    }//add_on_click_btn
    
    draw_floors(floorValue){
        console.log(floorValue);
        if(floorValue < 2 || floorValue > 99) return;
        const $frag = document.createDocumentFragment();
        for(let i=0; i<floorValue; i++){
            const $floor = document.createElement('SECTION');
            $floor.classList.add('floor');

            const $btns = document.createElement('DIV');
            const $info = document.createElement('DIV');
            $btns.classList.add('floor-btn');
            $info.classList.add('floor-info');

            const [$btnUp, $btnDown] = ['up','down'].map(str =>{
                const $btn = document.createElement('BUTTON');
                $btn.textContent = str;
                $btn.classList.add(`btn-${str}`);
                this.add_on_click_btn($btn,$floor,i + 1);
                return $btn;
            });
            
            if(i==0){
                $btns.appendChild($btnUp);
            }else if(i == floorValue - 1){
                $btns.appendChild($btnDown);
            }else{
                $btns.appendChild($btnUp);
                $btns.appendChild($btnDown);
            }

            $info.textContent = i + 1;
            
            /* dom 추가 */
            $floor.appendChild($btns);
            $floor.appendChild($info);
            $frag.appendChild($floor);
        }//for
        this.$wrap.appendChild($frag);
    }//draw_floors

    draw_lifts(liftValue){
        if(liftValue < 1 || liftValue > 4) return;
        this.$liftWrap = document.createElement('DIV');
        this.$liftWrap.id = 'lift-wrap';
        this.$wrap.appendChild(this.$liftWrap);

        const $frag = document.createDocumentFragment();

        for(let i=0;i<liftValue;i++){
            const $lift = document.createElement('DIV');
            $lift.dataset.idx = i;
            $lift.classList.add('lift');
            ["left","right"].forEach(dir =>{
                const $door = document.createElement('DIV');
                $door.classList.add(`lift-door`);
                $door.classList.add(`lift-door-${dir}`);
                $lift.appendChild($door);
            });
            
            this.$$lift.push($lift);
            this.$liftWrap.appendChild($lift);
        }//for

        this.$liftWrap.appendChild($frag);
    }//draw_lifts
    
}//class-LiftSimulator

new LiftSimulator().init();