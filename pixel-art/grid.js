export class Grid{
    constructor(PA){
        this.PA = PA;
        this.$grid = document.getElementById('grid-wrap');
        this.ABLE = false;
    }//constructor

    draw_grid(col,row,cellSize){
        const $frag = document.createDocumentFragment();
        for(let i=0; i<col*row; i++){
            const $cell = document.createElement('DIV');
            $cell.classList.add('grid-cell');
            $frag.appendChild($cell);
        }
        this.$grid.appendChild($frag);
        this.$grid.style.gridTemplateColumns = `repeat(${col},${cellSize})`
        this.$grid.style.gridTemplateRows = `repeat(${row},${cellSize})`
    }//draw_grid

    add_event_grid(){
        this.$grid.addEventListener('mousedown',this.on_mouse_down, {once:true});
        window.addEventListener('mouseup',this.cancel,{once:true});
        window.addEventListener('mouseleave',this.cancel,{once:true});
    }//add_event_grid

    on_mouse_down = e =>{
        const colorPick = this.get_color_pick && this.get_color_pick();
        this.ABLE = true;
        this.filling_cell(e,colorPick);
        window.addEventListener('mousemove', e=>this.filling_cell(e,colorPick));
    }//on_mouse_down

    filling_cell = (e,colorPick) =>{
        if(!this.ABLE) return;
        if(!colorPick) return;
        const isCell = e.target.classList.contains('grid-cell'); 
        if(!isCell) return;

        e.target.style.backgroundColor = colorPick == "white" ? "transparent" : colorPick;
        e.target.style.borderColor = colorPick == "white" ? "black" : colorPick;
    }//filling_cell


    cancel = () =>{
        this.ABLE = false;
        window.removeEventListener('mousemove',this.filling_cell);
        this.add_event_grid();
    }//cancel

    set_color_pick_listener(evt){
        this.get_color_pick = evt;
    }
}//Grid