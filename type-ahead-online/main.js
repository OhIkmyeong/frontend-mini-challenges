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

            const value = this.$ipt.value;
            console.log(value);
            const res = await this.make_api_request({ value: value, length: this.#suggestLength });
            console.log(res);
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
            console.log(data);
            return { text: value, result: data.items }
        } catch (e) {
            return { text: value, result: [] }
        }//try,catch
    }//make_api_request
}//class-TypeAheadOnline

new TypeAheadOnline().init();