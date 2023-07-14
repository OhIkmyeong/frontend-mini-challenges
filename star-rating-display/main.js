class StarRatingDisplay {
    constructor(countStar) {
        this.$wrapStar = document.getElementById('wrap-star');
        this.$ipt = document.getElementById('ipt-star');
        this.$output = document.getElementById('ipt-star-output');
        this.countStar = countStar;
        this.$$starFill = [];
    }//constructor

    init() {
        this.make_stars();
        this.set_input();
        this.display_output();
        this.display_star();

        this.$ipt.addEventListener('input', (e) => {
            this.display_output();
            this.display_star();
        });
    }//init

    make_stars() {
        const $frag = document.createDocumentFragment();
        for (let i = 0; i < this.countStar; i++) {
            const $star = document.createElement('SPAN');
            const $starFill = document.createElement('SPAN');

            $star.classList.add('star');
            $starFill.classList.add('star-fill');

            $starFill.textContent = '★';

            this.$$starFill.push($starFill);

            $star.appendChild($starFill);
            $frag.appendChild($star);
        }//for
        this.$wrapStar.appendChild($frag);
    }//make_stars

    set_input() {
        const { width } = this.$wrapStar.getBoundingClientRect();
        this.$ipt.style.width = `${width + 2}px`;
        this.$ipt.setAttribute('max', this.countStar);
    }//set_input

    display_output() {
        this.$output.textContent = this.$ipt.value;
    }//display_output

    display_star(){
        const val = Number(this.$ipt.value);
        const valInt = parseInt(this.$ipt.value);
        
        for(let i=0; i<this.countStar; i++){
            const $starFill = this.$$starFill[i];
            if(i < valInt){
                $starFill.style.width = "100%";
            }else if(i == valInt && val !== valInt){
                const per = (val * 100) - (valInt * 100);
                $starFill.style.width = `${per}%`;
            }else{
                $starFill.style.width = "0%";
            }
        }//for
    }//display_star

}//class-StarRatingDisplay


/* ------------------- */
new StarRatingDisplay(5).init();