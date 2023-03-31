class Paginator{
    #cnt = null;
    #sib = null;
    #bnd = null;
    #curr = null;
    #plusBound = 0;

    constructor(){
        this.$form = document.getElementById('form-pgn');
        this.$pgn = document.getElementById('pgn');
        this.$pager = document.getElementById('pgn-pager');
        this.$btnPrev = document.getElementById('pgn-prev');
        this.$btnNext = document.getElementById('pgn-next');
        this.init();
    }//constructor

    init(){
        this.set_count();
        this.set_sibling();
        this.set_boundary();
        this.set_curr();

        this.reset_pager();
        this.draw_pager();

        /* event 추가 */
        this.$form.addEventListener('input',this.on_change_form);
        this.$pgn.addEventListener('click',this.on_click_page);
        
    }//init

    set_count(){
        const $cnt = this.$form.querySelector('#pgn-cnt'); 
        const val = parseInt($cnt.value)
        this.#cnt = val;
        this.get_txt($cnt).textContent = val;
    }//set_count
    
    set_sibling(){
        const $sib = this.$form.querySelector('#pgn-sib');
        const val = parseInt($sib.value);
        this.#sib = val;
        this.get_txt($sib).textContent = val;
    }//set_sibling
    
    set_boundary(){
        const $bnd = this.$form.querySelector('#pgn-bnd');
        const val = parseInt($bnd.value)
        this.#bnd = val;
        this.get_txt($bnd).textContent = val;
    }//set_boundary

    set_curr(curr = 1){
        this.#curr = parseInt(curr);
    }//set_curr
    
    /* ------- [DOM] ------- */

    reset_pager(){
        this.$pager.innerHTML = '';
    }//reset_pager

    display_curr(){

    }//display_curr

    draw_pager(){
        const numListResult = this.cacul_pager();
        const $frag = document.createDocumentFragment();

        numListResult.reduce((acc,curr)=>{
            /* 숫자가 연속으로 이어질 때 */
            if(curr - acc == 1){
                $frag.appendChild(this.make_btn_num(curr));
                return curr;
            }
            
            /* 숫자가 연속으로 이어지진 않는데 2만 차이날 때 */
            if(curr - acc == 2){
                $frag.appendChild(this.make_btn_num(curr - 1));
                $frag.appendChild(this.make_btn_num(curr));
                return curr;
            }

            /* 숫자가 연속으로 이어지지 않을 때 */
            if(curr < this.#curr){
                $frag.appendChild(this.make_btn_dot(this.#plusBound * -1));
            }else{
                $frag.appendChild(this.make_btn_dot(this.#plusBound));
            }
            $frag.appendChild(this.make_btn_num(curr))
            return curr;

        },0);

        this.$pager.appendChild($frag);
    }//draw_pager

    make_btn_num(num){
        const $btn = document.createElement('BUTTON');
        $btn.classList.add('pgn-number');
        $btn.textContent = num;
        $btn.dataset.num = num;
        if(num == this.#curr) $btn.classList.add('on');
        return $btn;
    }

    make_btn_dot(plusBound){
        const $btn = document.createElement('BUTTON');
        $btn.classList.add('pgn-dot');
        $btn.dataset.bound = plusBound;
        $btn.textContent = "...";
        return $btn;
    }

    cacul_pager(){
        console.log('--------------');
        this.#plusBound = 0;
        if(this.#curr >= this.#cnt) this.#curr = this.#cnt;
        const start = 1;
        const end = this.#cnt;
        const curr = this.#curr;
        const numList = new Set();
        const boundStart = [];
        const boundEnd = [];
        const siblings = [];

        /* 📍 이전, 다음 버튼 활성화 관련 */
        curr <= start ? this.disable_btn_prev() : this.enable_btn_prev(); 
        curr >= end ? this.disable_btn_next() : this.enable_btn_next();

        /* 📍 현재 삽입 */
        numList.add(curr);

        /* 📍Boundary 기준으로 - 시작점 */
        for(let i=start; i<=start + this.#bnd - 1; i++){
            if(i > end) break;
            numList.add(i);
            boundStart.push(i);
        }
        /* 📍Boundary 기준으로 - 끝점 */
        for(let i=end; i>=end - this.#bnd + 1; i--){
            if(i < start) break;
            numList.add(i);
            boundEnd.unshift(i);
        }

        /* 📍 Siblings */
        for(let i = Math.max(start,curr - this.#sib); i<=curr + this.#sib; i++){
            if(i > end) break;
            numList.add(i);
            siblings.push(i);
        }

        /* 📍 boundaryLength */
        const boundaryLength = Math.min((this.#sib * 2) + 2 + this.#bnd, end);
        this.#plusBound = boundaryLength;
        if(curr < boundaryLength){
            const boundStartLast = boundStart.at(-1); 
            for(let i=boundStartLast + 1; i<=boundaryLength; i++){
                if(i > end) break;
                boundStart.push(i);
                numList.add(i);
            }
        }else if(curr > end - boundaryLength){
            const boundEndFirst = boundEnd[0];
            for(let i = boundEndFirst - 1; i > end -  boundaryLength; i --){
                if(i < start) break;
                boundEnd.unshift(i);
                numList.add(i);
            }
        }//else-if
        
        /* 최종 */
        const numListResult = Array.from(numList).sort((a,b)=>a-b);

        console.log("boundaryLength",boundaryLength)
        console.log('boundStart',boundStart);
        console.log('boundEnd',boundEnd);
        console.log('siblings',siblings);
        console.log('result',numListResult);

        return numListResult;
    }//cacul_pager

    get_txt($ipt){
        return $ipt.nextElementSibling;
    }

    /* ------- [Event] ------- */
    on_change_form = e =>{
        if(e.target.tagName != "INPUT") return;

        switch(e.target.id){
            case "pgn-cnt" : {
                this.set_count();
            }break;
            case "pgn-sib" : {
                this.set_sibling();
            }break;
            case "pgn-bnd" : {
                this.set_boundary();
            }break;
        }//switch

        this.reset_pager();
        this.draw_pager();
    }//on_change_form

    on_click_page = e =>{
        /* 숫자 클릭시 */
        if(e.target.classList.contains('pgn-number')){
            this.set_curr(e.target.dataset.num);
        }//if

        /* "..." 클릭시 */
        if(e.target.classList.contains('pgn-dot')){
            const val = parseInt(e.target.dataset.bound);
            this.set_curr(this.#curr + val);
        }//if

        /* "<" 클릭시 */
        if(e.target == this.$btnPrev){
            console.clear();
            this.set_curr(this.#curr - 1);
        }
        
        /* ">" 클릭시 */
        if(e.target == this.$btnNext){
            console.clear();
            this.set_curr((this.#curr ?? 1) + 1);
        }

        /* 공통 */
        this.reset_pager();
        this.draw_pager();
    }//on_click_page

    on_click_prev_next(dir){}//on_click_prev_next

    on_click_prev(){
        this.on_click_prev_next("prev");
    }

    on_click_next(){
        this.on_click_prev_next("next");
    }
    
    disable_btn_prev(){
        this.$btnPrev.disabled = true;
    }
    enable_btn_prev(){
        this.$btnPrev.disabled = false;
    }
    disable_btn_next(){
        this.$btnNext.disabled = true;
    }
    enable_btn_next(){
        this.$btnNext.disabled = false;
    }
}//Paginator

new Paginator();