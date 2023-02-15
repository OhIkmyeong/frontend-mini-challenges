class TelephoneFormatter{
    constructor(){
        this.$ipt = document.getElementById('ipt-tel');
        this.init();
    }//constructor

    init(){
        //change는 focus out 부터 발생함
        //그래서 input 이벤트로 해줘야함
        this.$ipt.addEventListener('input',e =>{
            const str = this.get_number_only(e.target.value);
            if(!str) return;
            
            if(str.length < 4){
                this.$ipt.value = str;
            }else if(str.length > 3 && str.length <= 7){
                this.$ipt.value = this.str_formatter_fst(str) + str.substring(3);
            }else{
                this.$ipt.value = this.str_formatter_fst(str) + str.substring(3,7) + '-' + str.substring(7,11);
            }
        });
    }//init
    
    /**
     * input을 2개써야하나 했는데 integer만 가져오는 방법이 있었음
     * @param {String}str
     * @url https://github.com/sadanandpai/frontend-mini-challenges/blob/main/src/mc/telephone-formatter/index.js
     * @url https://regexr.com/5mhou
     * @url https://velog.io/@slaslaya/String.prototype.match%EC%99%80-String.prototype.matchAll-%EB%B9%84%EA%B5%90-%EC%BA%A1%EC%B2%98-%EA%B7%B8%EB%A3%B9Capture-Groups%EC%9D%B4%EB%9E%80
     */
    get_number_only(str){
        return str?.match(/\d+/g)?.join('');
    }//get_number_only

    /** 
     * 앞에 3자리를 +(000)- 으로 반환해줌 
     * @param {String}str
     * */
    str_formatter_fst(str){
        return `+(${str.substring(0,3)})-`;
    }//str_formatter_fst
}//TelephoneFormatter

new TelephoneFormatter();