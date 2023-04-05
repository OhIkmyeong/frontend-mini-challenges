class JsonCreatorDomMaker {
    constructor() {
        this.$wrap = document.getElementById('jcipt-wrap');

        this.$btnAddKey = document.getElementById('jcipt-add-key');
        this.$btnGet = document.getElementById('jcipt-get');

        this.$result = document.getElementById('result');
    }//constructor

    /* -----------------📌[DATA:GETTER]----------------- */
    get clssItem() { return 'jcipt' }
    get clssItemMain() { return this.clssItem + '-main'; }
    get clssItemSub() { return this.clssItem + '-sub'; }

    get nameIpt() { return 'jcipt-ipt' };
    get clssIptKey() { return this.nameIpt + '-key' };
    get clssIptVal() { return this.nameIpt + '-val' };

    get clssBtn() { return this.clssItem + '-btn' }
    get clssBtnAdd() { return this.clssBtn + '-add' }
    get clssBtnRemove() { return this.clssBtn + '-remove' }

    /* -----------------📌[DOM-LAYOUT]----------------- */
    make_item() {
        const $itemWrap = this.make_item_wrap();
        const $mainWrap = this.make_item_main_wrap();
        const $subWrap = this.make_item_sub_wrap();

        /* DOM 더하기 */
        $itemWrap.appendChild($mainWrap);
        $itemWrap.appendChild($subWrap);

        /* 최종 */
        return $itemWrap
    }//make_item
    /* -----------------📌[DOM-ELEMENT]----------------- */

    make_item_wrap() {
        const $itemWrap = document.createElement('DETAILS');
        $itemWrap.classList.add(this.clssItem);
        $itemWrap.open = false;
        return $itemWrap;
    }//make_item_wrap

    make_item_main_wrap() {
        /* wrap */
        const $mainWrap = document.createElement('SUMMARY');
        $mainWrap.classList.add(this.clssItemMain);

        /* 접고 피는 역할 */
        const $fold = document.createElement('SPAN');
        $fold.classList.add(this.clssItemMain + '-fold');
        $fold.classList.add("off");
        $fold.textContent = "▶"
        $mainWrap.appendChild($fold);

        /* key, value input */
        const iptList = [{
            title: "key", value: this.clssIptKey
        }, {
            title: "value", value: this.clssIptVal
        }];
        iptList.forEach(ipt => {
            const { title, value } = ipt;
            const $ipt = document.createElement('INPUT');
            $ipt.type = "text";
            $ipt.name = this.nameIpt;
            $ipt.classList.add(value);
            $ipt.title = title;
            $ipt.placeholder = title;
            $ipt.dataset.json = title;
            $mainWrap.appendChild($ipt);
        });

        /* button - add,remove */
        const btnList = [{
            title: "add", content: "+", clss: this.clssBtnAdd
        }, {
            title: "remove", content: "x", clss: this.clssBtnRemove
        }];
        btnList.forEach(btn => {
            const { title, content, clss } = btn;
            const $btn = document.createElement('BUTTON');
            $btn.title = title;
            $btn.textContent = content;
            $btn.classList.add(this.clssBtn);
            $btn.classList.add(clss);
            $mainWrap.appendChild($btn);
        });

        /* 최종 */
        return $mainWrap;
    }//make_item_main_wrap

    make_item_sub_wrap() {
        const $subWrap = document.createElement('SECTION');
        $subWrap.classList.add(this.clssItemSub);
        return $subWrap;
    }//make_item_sub_wrap

}//class-JsonCreatorDomMaker

/* ---------------------------------------------------------------- */
/* ---------------------------------------------------------------- */
/* ---------------------------------------------------------------- */

class JsonCreator extends JsonCreatorDomMaker {
    constructor() {
        super();
    }//constructor

    init() {
        this.add_item();

        this.$btnAddKey.addEventListener('click', () => {
            const $item = this.add_item();
        })
        this.$btnGet.addEventListener('click', this.on_click_get_json);
    }//init

    /* ----------------------📌[Event]---------------------- */

    /**
     * 📌
     * get json 버튼에 이벤트 추가
    */
    on_click_get_json = () => {
        const result = {};
        const $$d0 = this.$wrap.querySelectorAll('[data-depth="0"]');

        $$d0.forEach($d0=>{
            const d0 = this.get_json($d0);
            const [key,val] = Object.entries(d0)[0];
            result[key] = val;
        });

        /* 최종 */
        this.$result.textContent = JSON.stringify(result);
    }//on_click_get_json

    /**
     * 
     * @param {DOM} $container 
     */
    get_json($container){
        const result = {};
        const $key = $container.querySelector('[data-json="key"]')
        const $val = $container.querySelector('[data-json="value"]')
        const key = $key.value;
        const val = $val.value;

        if($key && key){
            if(!$val.classList.contains('off')){
                result[key] = val;
            }else{
                let $$subItem = $container.querySelectorAll(`.${this.clssItem}[data-depth="${Number($container.dataset.depth) + 1}"]`);
                let obj = {};
                $$subItem.forEach($subItem=>{
                    obj = {...obj, ...this.get_json($subItem)}
                });
                if(Object.keys(obj).length === 0){
                    result[key] = null;
                }else{
                    result[key] = obj;
                }
            }//if-else-value off?
        }//if

        return result;
    }//get_json

    /**
     * 📌 아이템 내의 추가 버튼 클릭시
     * - 폴드 버튼 보이기
     * - details 열기
     * - 자식 아이템 추가하기
     * - 본인 value input 가리기
     */
    on_click_add = e => {
        const $btnAdd = e.target;
        const $mainWrap = $btnAdd.parentElement;
        const $jcipt = $mainWrap.parentElement;
        const $subWrap = $jcipt.querySelector(`.${this.clssItemSub}`);
        const $fold = $mainWrap.querySelector(`.${this.clssItemMain}-fold`);
        const $iptVal = $mainWrap.querySelector(`.${this.clssIptVal}`);

        $fold.classList.remove('off');
        $jcipt.open = true;
        $iptVal.classList.add('off');
        this.add_item($subWrap);
    }//on_click_add

    /**
     * 📌 제거 버튼 클릭시
     * - 본인 제거하기
     * - 만일 자신이 부모의 유일한 자손인 경우
     *   - 부모 details 접기
     *   - 부모의 fold 버튼 가리기
     *   - 부모의 value input 보이기
     * @param {Event} e 
     */
    on_click_remove = e => {
        const $btnRemove = e.target;
        const $jcipt = $btnRemove.parentElement.parentElement;
        const $parent = $jcipt.parentElement;

        $parent.removeChild($jcipt);

        if ($parent.children.length) return;
        if ($parent.id == `${this.clssItem}-wrap`) return;

        const $parentJcipt = $parent.parentElement;
        const $fold = $parentJcipt.querySelector(`.${this.clssItemMain}-fold`);
        const $iptVal = $parentJcipt.querySelector(`.${this.clssIptVal}`);
        $parentJcipt.open = false;
        $fold.classList.add('off');
        $iptVal.classList.remove('off');
    }//on_click_remove

    /* ----------------------📌[Func]---------------------- */
    /**
     * 만든 아이템일 추가함
     * @param {DOM} $subWrap 
     */
    add_item($subWrap) {
        const $item = this.make_item();

        /* 이벤트 */
        const $btnAdd = $item.querySelector(`.${this.clssBtnAdd}`);
        const $btnRemove = $item.querySelector(`.${this.clssBtnRemove}`);

        /* 추가 버튼 클릭 */
        $btnAdd.addEventListener('click', this.on_click_add);
        /* 제거 버튼 클릭 */
        $btnRemove.addEventListener('click', this.on_click_remove, { once: true });

        if (!$subWrap) {
            $item.dataset.depth = 0;
            this.$wrap.appendChild($item);
            return $item;
        }
        const depth = parseInt($subWrap.parentElement.dataset.depth);
        $item.dataset.depth = depth + 1;
        $subWrap.appendChild($item);
        return $item;
    }//add_item
}//class-JsonCreator

/* ---------------------------------------------------------------- */
new JsonCreator().init();