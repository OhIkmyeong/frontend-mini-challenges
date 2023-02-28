class CarouselBuilder{
    set_slider($slider){
        this.$slider = $slider;
        return this;
    }

    has_pagination(bool=true){
        this.hasPagination = bool;
        return this;
    }

    has_arrow(bool=true){
        this.hasArrow = bool;
        return this;
    }

    is_auto(bool=false){
        this.isAutp = bool;
        return this;
    }

    is_endless(bool=false){
        this.isEndless = bool;
        return this;
    }

    init(){
        return new Carousel(this);
    }
}//class-CarouselBuilder

class Carousel{
    #length = 0;
    #currIdx = 0;
    #widItem;
    
    constructor(Builder){
        this.hasPagination = Builder.hasPagination ?? true;
        this.hasArrow = Builder.hasArrow ?? true;
        this.isAuto = Builder.isAuto ?? false;
        this.isEndless = Builder.isEndless ?? false;

        this.$slider = Builder.$slider;
        this.$wrap = null;
        this.$$item = null;
        this.$prev = null;
        this.$next = null;
        this.$pagination = null;

        this.init();
    }//constructor

    init(){
        if(!this.$slider) return console.error('carousel slider가 될 수 있는 DOM을 지정하세요.');

        this.set_length();
        if(!this.#length) return console.error('carousel slider 안에 item이 없습니다.')

        /* 기본 slider 정비 */
        this.add_class_slider();
        this.$wrap = this.make_wrap();

        /* width 가져오기 */
        this.set_wid_item();
        window.addEventListener('resize', this.set_wid_item);

        /* endless면 앞이랑 뒤에 가장 첫번째,마지막 아이템 추가해줘야함 */
        if(this.isEndless){
            this.add_items_for_endless();
            this.#currIdx++;
            this.move_slider();
        }
        
        /* 원래 위치에 삽입 준비 */
        const $next = this.$slider.nextElementSibling;
        const $parent = this.$slider.parentElement;

        /* wrap에 DOM 추가 */
        this.$wrap.appendChild(this.$slider);
        
        /* pager 추가 및 이벤트 추가 */
        if(this.hasPagination){
            this.$pagination = this.make_pagination();
            this.$pagination.addEventListener('click',this.on_click_pager);
            this.$wrap.appendChild(this.$pagination);
        }

        /* arrow 추가 및 이벤트 추가 */
        if(this.hasArrow){
            [this.$prev, this.$next] = this.make_arrow_btns();
            this.$prev.addEventListener('click',this.on_click_prev);
            this.$next.addEventListener('click',this.on_click_next);
            this.$wrap.appendChild(this.$prev);
            this.$wrap.appendChild(this.$next);
        }

        /* 원래 위치에 삽입 및 문서에 추가 */
        if($next){
            $parent.insertBefore(this.$wrap,$next);
        }else{
            $parent.appendChild(this.$wrap);    
        }

        /* 자동재생이면 자동재생 추가 */
        if(this.isAuto){}
    }//init

    set_length(){
        this.#length = this.$slider.childElementCount;
    }//set_length

    /* ---------- [DOM] ---------- */
    make_wrap(){
        const $wrap = document.createElement('SECTION');
        $wrap.classList.add('wrap-carousel-slider');
        return $wrap;
    }//make_wrap
    
    add_class_slider(){
        this.$slider.classList.add('carousel-slider');
        this.$$item = this.$slider.children;
        Array.prototype.forEach.call(this.$$item, $item => $item.classList.add('carousel-slider-item'));
    }//add_class_slider

    make_pagination(){
        const $pagination = document.createElement('FIELDSET');
        $pagination.classList.add('carousel-pager');
        $pagination.style.setProperty('--length',this.#length);
        
        /* legend */
        const $legend = document.createElement('LEGEND');
        $legend.textContent = 'pagination';
        $pagination.appendChild($legend);

        /* input 추가 */
        const iptName = `carousel-pager-${this.$slider.id}-${new Date().getMilliseconds()}${parseInt(Math.random()*10)}`; 
        for(let i=0; i<this.#length; i++){
            const $lbl = document.createElement('LABEL');
            const $ipt = document.createElement('INPUT');
            const $ic = document.createElement('SPAN');
            $lbl.classList.add("carousel-pager-lbl");
            $lbl.title = `${i+1}번째 슬라이드`
            $ipt.type = "radio";
            $ipt.name = iptName;
            $ipt.value = i + (this.isEndless && 1);
            if(i == 0){
                $ipt.checked = true;
                this.#currIdx = i + (this.isEndless && 1);
            }
            $lbl.appendChild($ipt);
            $lbl.appendChild($ic);
            $pagination.appendChild($lbl);
        }//for

        return $pagination;
    }//make_pagination

    make_arrow_btns(){
        const $prev = document.createElement('BUTTON');
        const $next = document.createElement('BUTTON');
        $prev.classList.add('carousel-arrow');
        $next.classList.add('carousel-arrow');
        $prev.classList.add('carousel-arrow-prev');
        $next.classList.add('carousel-arrow-next');
        $prev.textContent = '<'
        $next.textContent = '>'
        return [$prev,$next];
    }//make_arrow_btns

    add_items_for_endless(){
        const $first = this.$slider.children[0];
        const $last = this.$slider.children[this.#length - 1];
        const $cloneFirst = $first.cloneNode(true);
        const $cloneLast = $last.cloneNode(true);
        this.$slider.appendChild($cloneFirst);
        this.$slider.insertBefore($cloneLast,$first);
    }//add_items_for_endless
    
    /* ---------- [EVENT] ---------- */
    on_click_pager = (e) =>{
        if(e.target.tagName != "INPUT") return;
        const idx = Number(e.target.value);
        this.#currIdx = idx;
        this.move_slider();
    }//on_click_pager

    on_click_prev = async() =>{
        this.#currIdx--;

        if(!this.isEndless){
            /* 일반 */
            if(this.#currIdx < 0) this.#currIdx = this.#length - 1;
            this.move_slider();
        }else{
            /* Endless일때 */
            this.move_slider();
            if(this.#currIdx <= 0){
                await this.transition_off_slider(this.#length);
                this.transition_on_slider();
            }
        }//if-else

        /* pager 이동 */
        this.check_pager(this.#currIdx);
    }//on_click_prev

    on_click_next = async() =>{
        this.#currIdx++;
        
        if(!this.isEndless){
            /* 일반 */
            if(this.#currIdx >= this.#length) this.#currIdx = 0;
            this.move_slider();
            this.check_pager(this.#currIdx);

        }else{
            /* Endless일때 */
            if(this.#currIdx > this.#length){
                this.check_pager(this.#length);
                this.move_slider();
                await this.transition_off_slider(1);
                this.transition_on_slider();
                this.check_pager(this.#currIdx);
            }else{
                this.move_slider();
                this.check_pager(this.#currIdx);
            }
        }//if-else
    }//on_click_next
    
    /* ---------- [FUNCTION] ---------- */
    set_wid_item = ()=>{
        const winWid = window.innerWidth * 0.9;
        if(winWid > 1200){
            this.#widItem = 1200;
        }else if(winWid < 400){
            this.#widItem = 400;
        }else{
            this.#widItem = winWid;
        }
        this.$wrap.style.setProperty('--wid-item',`${this.#widItem}px`);
    }//set_wid_item

    move_slider(){
        console.log('move_slider',this.#currIdx);
        const left = this.#widItem * this.#currIdx;
        this.$slider.style.transform = `translateX(-${left}px)`;
    }//move_slider

    check_pager(val){
        if(!this.$pagination) return;
        console.log('pager-val',val);
        const $ipt = this.$pagination.querySelector(`[value="${val}"]`);
        $ipt.checked = true;
    }//check_pager

    transition_off_slider(idx){
        return new Promise((res)=>{
            this.$slider.addEventListener('transitionend',()=>{
                this.$slider.classList.add('off-transition');
                this.#currIdx = idx;
                this.move_slider();
                setTimeout(()=>{
                    res('트랜지션 끝!');
                },100);
            },{once:true});
        });
    }//transition_off_slider

    transition_on_slider(){
        this.$slider.classList.remove('off-transition');
    }//transition_on_slider
}//class-Carousel

const $slider = document.getElementById('mySlider');
const $slider2 = document.getElementById('mySlider2');
const $slider3 = document.getElementById('mySlider3');
const $slider4 = document.getElementById('mySlider4');

new CarouselBuilder()
.set_slider($slider4)
.is_auto(true)
.is_endless(true)
.init();

new CarouselBuilder()
.set_slider($slider)
.is_auto(true)
.init();

new CarouselBuilder()
.set_slider($slider2)
.has_arrow(false)
.init();

new CarouselBuilder()
.set_slider($slider3)
.has_pagination(false)
.is_endless(true)
.init();