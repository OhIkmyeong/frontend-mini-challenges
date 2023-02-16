import { Grid } from "./grid.js";
import { Pallete } from "./plt.js";

class PixelArt{
    constructor(){
        this.GRD = new Grid(this);
        this.PLT = new Pallete(this);
    }//constructor

    draw_grid(col,row,cellSize){this.GRD.draw_grid(col,row,cellSize);}

    init(){
        this.GRD.add_event_grid();
        this.GRD.set_color_pick_listener(this.PLT.get_color_pick);
    }//init
}//PixelArt

const PA = new PixelArt();
PA.init();
PA.draw_grid(25,30,"20px");