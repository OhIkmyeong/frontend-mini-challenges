class StarRating{
    constructor(){
        this.$wrap = document.getElementById('wrap-star-rating');
        this.$$star = document.querySelectorAll('.star');
        this.$$iptStar = document.querySelectorAll('[name="ipt-star-rating"]');
        this.$emoji = document.getElementById('star-emoji');
        this.init();
    }//constructor

    init(){
        this.$wrap.addEventListener('mouseleave',()=>{
            const idx = Array.from(this.$$iptStar).findIndex($sib => $sib.checked);
            if(idx < 0){
                this.$$star.forEach($sib=>{
                    $sib.classList.remove('rating');
                    $sib.classList.remove('rated');
                });
                return;
            }
            const $star = this.$$star[idx];
            const $$prev = this.get_all_prev_sib($star); 
            const $$next = this.get_all_next_sib($star);

            $$prev.forEach($prev => {
                $prev.classList.remove('rating');
                $prev.classList.add('rated');
            });
            $$next.forEach($prev => {
                $prev.classList.remove('rating');
            });
            
        });

        this.$$star.forEach($star=>{
            $star.addEventListener('mouseenter',()=>{
                const $$prev = this.get_all_prev_sib($star); 
                const $$next = this.get_all_next_sib($star);
                
                $$prev.forEach($prev => {
                    $prev.classList.remove('rated');
                    $prev.classList.add('rating');
                });

                $$next.forEach($prev => {
                    $prev.classList.remove('rating');
                    $prev.classList.remove('rated');
                });
            });
        });

        this.$$iptStar.forEach($ipt => {
            $ipt.addEventListener('change',()=>{
                const idx = parseInt($ipt.value) - 1;
                const $star = this.$$star[idx];

                const $$prev = this.get_all_prev_sib($star); 
                const $$next = this.get_all_next_sib($star);

                $$prev.forEach($prev => {
                    $prev.classList.add('rated');
                });

                $$next.forEach($prev => {
                    $prev.classList.remove('rating');
                    $prev.classList.remove('rated');
                });
                
                let emoji;

                switch($ipt.value){
                    case "1" : emoji = "🤢";break;
                    case "2" : emoji = "😟";break;
                    case "3" : emoji = "🙂";break;
                    case "4" : emoji = "😃";break;
                    case "5" : emoji = "😍";break;
                }
                this.$emoji.textContent = emoji;
            });
        });
    }//init

    get_all_prev_sib($star){
        const result = [];

        for(let i=0; i<this.$$star.length; i++){
            result.push(this.$$star[i]);
            if(this.$$star[i] == $star) break;
        }

        return result;
    }//get_all_prev_sib

    get_all_next_sib($star){
        if(!$star) return this.$$star;
        const result = [];

        for(let i=this.$$star.length - 1; i>=0; i--){
            if(this.$$star[i] == $star) break;
            result.push(this.$$star[i]);
        }

        return result;
    }//get_all_next_sib
}//StarRating


new StarRating();