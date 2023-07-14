class DragDropPuzzle{
    constructor(info){
        this.col  = info?.col || 3;
        this.row = info?.row || 3;
        this.clss = 'puzzle-piece'
        this.colors = [];
    }//constructor

    init(){
        this.set_random_color();
        this.make_board();
        this.$wrap.addEventListener('dragover',this.on_drag_over);
    }//init

    make_board(){
        const $main = document.getElementsByTagName('MAIN')?.[0] || document.body;
        this.$wrap = document.createElement('SECTION');
        this.$wrap.id = "wrap-puzzle";
        this.$wrap.style.gridTemplateColumns = `repeat(${this.col}, 1fr)`;
        this.$wrap.style.gridTemplateRows = `repeat(${this.row}, 1fr)`;

        const colors = [...this.colors];

        for(let i=0; i<this.col * this.row; i++){
            const $piece = document.createElement('DIV');
            $piece.textContent = i + 1;
            $piece.classList.add(this.clss);
            const {idx:colorIdx,color} = colors.splice(Math.floor(Math.random() * colors.length),1)[0];
            $piece.style.background = `${color}`;
            $piece.style.setProperty('--bg',color);
            $piece.dataset.colorIdx = colorIdx;
            if(i == colorIdx){this.on_answer($piece)}
            this.add_drag_event($piece);
            $piece.draggable = true;
            this.$wrap.appendChild($piece);
        }//for

        $main.appendChild(this.$wrap);
    }//make_board

    set_random_color(){
        const count = this.col * this.row;
        const h = Math.round(Math.random() * 300);
        const s = Math.round(Math.random() * 100);
        const l = Math.round(Math.random() * 50);

        const perH = 250 / count;
        const perL = 50 / count;

        for(let i=0; i<count; i++){
            const hsl = `hsl(${i * perH}deg ${100}% ${73}%)`;
            const obj = {
                idx : i,
                color : hsl
            };
            this.colors.push(obj);
        }

        console.log(this.colors)
    }//set_random_color

    /**
     * @url https://developer.mozilla.org/ko/docs/Web/API/HTMLElement/drag_event
     * drag, dragstart, dragend, dragover, dragenter, dragleave, drop
     */
    add_drag_event($elem){
        if(!$elem) return;

        $elem.addEventListener('dragstart',()=>{
            this.$dragging = $elem;
            this.$draggingAfter = $elem.nextElementSibling;
        });
        
        $elem.addEventListener('dragend',(e)=>{
            if(!this.$dragOver || !this.$dragging || this.$dragging == this.$dragOver){
                this.reset_drag();
                return;
            }

            /* 옮기는거 위치 */
            const $dragOverAfter = this.$dragOver.nextElementSibling;
            if($dragOverAfter){
                this.$wrap.insertBefore(this.$dragging, $dragOverAfter);
            }else{
                this.$wrap.appendChild(this.$dragging);
            }

            /* 바꿔질거 위치 */
            if(this.$draggingAfter){
                this.$wrap.insertBefore(this.$dragOver, this.$draggingAfter);
            }else{
                this.$wrap.appendChild(this.$dragOver);
            }

            /* 옮기는거 인덱스 확인 */
            const $$tile = this.$wrap.getElementsByClassName(this.clss);
            this.is_answer($$tile,this.$dragging);
            this.is_answer($$tile, this.$dragOver);
            const answer = this.$wrap.getElementsByClassName('answer').length;
            this.reset_drag();
            if(answer >= this.col * this.row){alert('win');}
        });
    }//add_drag_event

    is_answer($$sib,$elem){
        const idx = Array.prototype.indexOf.call($$sib,$elem);
        const colorIdx = Number($elem.dataset.colorIdx);
        if(idx !== colorIdx) return;
        this.on_answer($elem);
    }//is_answer

    on_answer($elem){
        $elem.classList.add('answer');
        $elem.animate([
            {
                boxShadow : "inset 0px 0px 10px 5px rgba(255,255,255,.1),0 0 20px 5px var(--bg)"
            }
        ],{
            duration : 500,
            fill : "forwards"
        });
    }//on_answer

    reset_drag(){
        this.$dragging = null;
        this.$draggingAfter = null;
        this.$dragOver = null;
    }//reset_drag

    on_drag_over = e =>{
        if(!this.$dragging) return;
        if(e.target === this.$wrap) return;
        this.$dragOver = e.target;
    }//on_drag_over
}//class-DragDropPuzzle

new DragDropPuzzle({
    col : 5,
    row : 5
}).init();