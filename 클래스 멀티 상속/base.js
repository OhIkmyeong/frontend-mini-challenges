export class Base{

    constructor(){
        this.name = "name-Base";
    }
    test(){console.log(this.name, 'Base',this);}

    base_func(){
        console.log('--------------- Base : init ------------------');
    }

    init(){
        this.base_func();
        this.test_1();
        this.test_2();
        this.test_3();
    }
}//class-Base