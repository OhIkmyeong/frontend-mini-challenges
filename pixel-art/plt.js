export class Pallete{
    constructor(PA){
        this.PA = PA;
        this.$plt = document.getElementById('plt-wrap');
        this.COLORS = ["red","orange","yellow","green","blue","#fafafa","white","black"];
        this.colorPick = null;
        this.init();
    }//constructor

    init(){
        this.draw_plt();
        this.$plt.addEventListener('change', this.on_change_color);
    }//init

    draw_plt(){
        const $frag = document.createDocumentFragment();
        this.COLORS.forEach(clr =>{
            const $lbl = document.createElement('LABEL');
            const $ipt = document.createElement('INPUT');
            const $clr = document.createElement('SPAN');

            $ipt.type = "radio";
            $ipt.name = 'plt-clr-ipt';
            $ipt.value = clr;
            
            $lbl.classList.add('plt-clr-lbl');
            $ipt.classList.add('plt-clr-ipt')
            $clr.classList.add('plt-clr');

            $clr.style.backgroundColor = clr;
            
            $lbl.appendChild($ipt);
            $lbl.appendChild($clr);
            $frag.appendChild($lbl);
        });
        this.$plt.appendChild($frag);
    }//draw_plt

    on_change_color = (e) =>{
        this.colorPick = e.target.value;
        console.log('칼라변경!',this.colorPick);
    }//on_change_color

    get_color_pick = () => {
        if(!this.colorPick) return;
        console.log('get_color_pick:',this.colorPick);
        return this.colorPick;
    }//get_color_pick
}//Pallete