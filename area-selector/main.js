class AreaSelector{
    #cols = 0;
    #rows = 0;

    constructor(){
        this.$area = document.getElementById('area-hold');
        this.grabbing = "grabbing";
        this.cellClassName = "area-hold-cell";
        this.cellSize = 50;
        this.cells = [];
        this.$cellStart = null;
        this.$cellEnd = null;

        this.init();
    }//constructor

    init(){
        this.set_col_row();
        this.make_cells();
        this.add_mouse_down();
    }//init

    /* -------- DOM -------- */
    set_col_row(){
        this.#cols = parseInt(window.innerWidth / this.cellSize) - 3;
        this.#rows = parseInt(window.innerHeight / this.cellSize) - 5;
        if(this.#cols < 0) this.#cols = 2;
        if(this.#rows < 0) this.#rows = 3;
    }//set_col_row

    make_cells(){
        const $frag = document.createDocumentFragment();
        
        for(let r=0; r<this.#rows; r++){
            const row = [];
            for(let c=0; c<this.#cols; c++){
                const $cell = document.createElement('DIV');
                $cell.classList.add(this.cellClassName);
                $cell.dataset.r = r;
                $cell.dataset.c = c;
                $frag.appendChild($cell);
                row.push($cell);
            }//for-c
            this.cells.push(row);
        }//for-r

        this.$area.appendChild($frag);

        this.$area.style.gridTemplateColumns = `repeat(${this.#cols},${this.cellSize}px)`;
        this.$area.style.gridTemplateRows = `repeat(${this.#rows},${this.cellSize}px)`;
    }//make_cells
    
    /* -------- Event -------- */
    add_mouse_down(){
        this.$area.addEventListener('mousedown', this.on_down, {once:true});
    }//add_mouse_down

    on_down = e =>{
        if(!e.target.classList.contains(this.cellClassName)){
            this.cancel();
            return;
        }
        this.$cellStart = e.target;
        this.$cellStart.classList.add(this.grabbing);
        this.$area.classList.add(this.grabbing);

        window.addEventListener("mousemove", this.on_move);
        window.addEventListener("mouseup", this.cancel, {once:true});
    }//on_down

    on_move = e => {
        if(!e.target.classList.contains(this.cellClassName)){
            this.cancel();
            return;
        }
        this.$cellEnd = e.target;

        this.paint_cells();
    }//on_move
    
    cancel = e => {
        this.$area.classList.remove(this.grabbing);

        setTimeout(()=>{
            this.cells.forEach(row =>{
                row.forEach($cell => $cell.classList.remove(this.grabbing))
            });
        },500);

        window.removeEventListener("mousemove",this.on_move);
        this.add_mouse_down();
    }//cancel

    /* -------- Function -------- */
    get_rc($cell){
        const r = Number($cell.dataset.r);
        const c = Number($cell.dataset.c);
        return [r,c];
    }//get_rc

    fill_array(start,end){
        return new Array(Math.abs(end - start) + 1)
        .fill(start <= end ? start : end)
        .map((el,idx)=>el+idx)
    }//fill_array
    
    paint_cells(){
        const [startR,startC] = this.get_rc(this.$cellStart);
        const [endR,endC] = this.get_rc(this.$cellEnd);

        const rowCount = this.fill_array(startR,endR);
        const colCount = this.fill_array(startC,endC);

        //나는 이렇게 하긴 했는데 해답에선 const minR = Math.min(startR,endR)
        //const maxR = Math.max(startR,endR) 해서 하니까 더 편하기도 하겟당.ㅎㅎ

        this.cells.forEach((row,rIdx) =>{
            row.forEach(($cell,cIdx) =>{
                const bool = rowCount.includes(rIdx) && colCount.includes(cIdx);                
                $cell.classList.toggle(this.grabbing,bool);
            })//forEach-col
        });//forEach-row
    }//paint_cells
}//class-AreaSelector

new AreaSelector();