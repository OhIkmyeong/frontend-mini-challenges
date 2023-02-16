class PasswordStrength{
    constructor(){
        this.$meter = document.getElementById('pw-meter');
        this.hasNumber = /\d/;
        this.hasLowerCase = /[a-z]/;
        this.hasUpperCase = /[A-Z]/;
        this.hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        this.init();
    }//constructor

    init(){
        document.getElementById('form-pw').addEventListener('submit',e=>{
            e.preventDefault();
        });

        document.getElementById('ipt-pw').addEventListener('input',e =>{
            const val = e.target.value;
            this.on_input(val);
        });
    }//init

    on_input = val =>{
        let strength = Math.min(6,Math.floor(val.length / 3));
        strength += val.length < 4 ? 0 : this.test_format(val);

        //width
        this.$meter.style.width = `${strength * 10}%`;

        //color
        if(strength > 8){
            this.$meter.style.background = 'green';
        }else if(strength > 5){
            this.$meter.style.background = 'orange'; 
        }else{
            this.$meter.style.background = 'red';
        }
    }//on_input

    test_format(val){
        let result = this.hasNumber.test(val) 
        + this.hasLowerCase.test(val)
        + this.hasUpperCase.test(val)
        + this.hasSpecial.test(val);
        return result < 4 ? result : result + 2;
    }//test_format
}//PasswordStrength

new PasswordStrength();