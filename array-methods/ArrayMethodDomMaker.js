export class ArrayMethodDomMaker{
    constructor(){
        this.$ipt = document.getElementById('ipt');
        this.$amWrap = document.getElementById('am-wrap');
        this.$btnAdd = document.querySelector('[data-btn="add"]');
        this.$btnEval = document.querySelector('[data-btn="evaluate"]');
        this.$btnReset = document.querySelector('[data-btn="reset"]');
    }//constructor

    /**
     * 📍 아이템 만들어서 더함
     * @param {String} type map | filter 
     * @param {String} method  
     */
    add_item = (type = 'map',method) =>{
        /* wrap */
        const $am = document.createElement('ARTICLE');
        $am.classList.add('am');

        /* select */
        const $select = document.createElement('SELECT');
        $select.classList.add('am-select');

        ["map","filter"].forEach(val=>{
            const $opt = document.createElement('OPTION');
            $opt.value = val;
            $opt.textContent = val;
            $select.appendChild($opt);
        });
        
        const $selected = $select.querySelector(`[value="${type}"]`);
        if($selected)$selected.selected = true;

        /* method */
        const $method = document.createElement('INPUT');
        $method.classList.add('am-method');
        $method.type = "text";
        $method.value = method ?? ""; 

        /* result */
        const $result = document.createElement('OUTPUT');
        $result.classList.add('am-result');

        /* 최종 */
        $am.appendChild($select);
        $am.appendChild($method);
        $am.appendChild($result);
        this.$amWrap.appendChild($am);
    }//add_item
}//class-ArrayMethodDomMaker