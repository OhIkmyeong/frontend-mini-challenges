import { make_api_request } from "./ApiRequestSample.js";

class TypeAheadOnline {
    #suggestLength = 5;

    constructor() {
        this.$ipt = document.getElementById('ipt');
        this.$result = document.getElementById('result');
        this.abortController = null;
    }//constructor

    init() {
        this.$ipt.addEventListener('keyup', async (e) => {
            if (this.abortController) {
                this.abortController.abort();
                this.abortController = null;
            }

            const value = this.$ipt.value.trim();
            if(!value) return;
            this.reset_result(true);
            const res = await this.make_api_request({ value: value, length: this.#suggestLength });
            console.log(res);
            this.show_result(res);
        });
    }//init

    async make_api_request(info) {
        const { value, length } = info;
        this.abortController = new AbortController();
        try {
            const response = await fetch(`https://api.github.com/search/users?per_page=${length}&q=${value}`, {
                signal: this.abortController.signal,
            });
            this.abortController = null;
            const data = await response.json();
            return { text: value, result: data.items }
        } catch (e) {
            return { text: value, result: [] }
        }//try,catch
    }//make_api_request

    reset_result(loading=false){
        this.$result.innerHTML = loading ? "Loading..." : "";
    }//reset_result
    
    show_result(res){
        if(!res){
            this.$result.innerHTML = "Cannot Find Result";
            return;
        }
        this.reset_result();
        const {result} = res;
        result?.forEach(r =>{
            const value = r.login;
            const $li = document.createElement('LI');
            $li.textContent = value;
            $li.addEventListener('click',()=>{
                this.$ipt.value = value;
                this.reset_result();
            });
            this.$result.appendChild($li);
        });
    }//show_result
}//class-TypeAheadOnline

new TypeAheadOnline().init();