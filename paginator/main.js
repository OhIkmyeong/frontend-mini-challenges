class Paginator{
    #cnt = null;
    #sib = null;
    #bnd = null;
    #curr = null;

    constructor(){
        this.$form = document.getElementById('form-pgn');
        this.$btnPrev = document.getElementById('pgn-prev');
        this.$btnNext = document.getElementById('pgn-next');
        this.$pager = document.getElementById('pgn-pager');

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
        this.$form.addEventListener('change',this.on_change_form);
        this.$pager.addEventListener('click',this.on_click_page);
        
    }//init

    set_count(){
        this.#cnt = this.$form.querySelector('#pgn-cnt').value;
    }//set_count
    
    set_sibling(){
        this.#sib = this.$form.querySelector('#pgn-sib').value;
    }//set_sibling
    
    set_boundary(){
        this.#bnd = this.$form.querySelector('#pgn-bnd').value;
    }//set_boundary

    set_curr(curr = 1){
        this.#curr = curr;
    }//set_curr
    
    /* ------- [DOM] ------- */

    reset_pager(){
        this.$pager.innerHTML = '';
    }//reset_pager

    display_curr(){

    }//display_curr

    draw_pager(){
        const start = 1;
        const last = this.#cnt;
        const curr = this.#curr;


    }//draw_pager

    /* ------- [Event] ------- */
    on_change_form = e =>{
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
            this.reset_pager();
            this.draw_pager();
        }//if

        /* "..." 클릭시 */
    }//on_click_page

    on_click_prev_next(){}//on_click_prev_next
}//Paginator

new Paginator();