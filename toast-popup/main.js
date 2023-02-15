class ToastPopup{
    constructor(){
        this.init();
    }//constructor

    init(){
        document.getElementById('form-tp').addEventListener('submit', this.on_submit);
    }//init

    /**
     * on submit form 
     */
    on_submit = e =>{
        e.preventDefault();

        const posX = e.target["tp-pos-x"].selectedOptions[0].value;
        const posY = e.target["tp-pos-y"].selectedOptions[0].value;
        const type = e.target["tp-type"].selectedOptions[0].value;
        const message = e.target["tp-message"].value.trim();
        const duration = e.target["tp-duration"].value;

        /* make dom */
        const $tpCont = this.get_tp_container(posX,posY);
        const $tp = this.make_toast_popup(message,type);

        /* 추가 */
        $tpCont.appendChild($tp);

        /* add delete event */
        this.add_on_click_delete($tp);
        setTimeout(()=>{
            this.delete_tp_timeout($tp);
        },duration);
    }//on_submit

    /**
     * Find or Make $.toast-popup-container
     * @param {String} posX 
     * @param {String} posY 
     * @returns {DOM} $.toast-popup-container
     */
    get_tp_container(posX="left",posY="top"){
        const $exist = document.querySelector(`.toast-popup-container.${posX}.${posY}`);
        if($exist) return $exist;
        const $cont = document.createElement('SECTION');
        $cont.classList.add("toast-popup-container");
        $cont.classList.add(posX);
        $cont.classList.add(posY);
        document.body.getElementsByTagName('MAIN')[0].appendChild($cont);
        return $cont;
    }//get_tp_container

    /**
     * make toast popup message
     * @param {String} message
     * @param {String} type
     * @returns {DOM} $.toast-popup
     */
    make_toast_popup(message,type){
        const $tp = document.createElement('DIV');
        const $msg = document.createElement('P');
        const $del = document.createElement('BUTTON');

        $tp.classList.add('toast-popup');
        $tp.classList.add(type);

        $msg.classList.add('message');
        $msg.textContent = message;

        $del.classList.add('btn-tp-del');
        $del.textContent = '✕';

        $tp.appendChild($msg);
        $tp.appendChild($del);

        return $tp;
    }//make_toast_popup

    /**
     * Delete Toast Popup from Container
     * @param {DOM} $tp 
     */
    add_on_click_delete($tp){
        const $del = $tp.querySelector('.btn-tp-del');

        $del.addEventListener('click',()=>{
            this.delete_tp_timeout($tp,300);
        });
    }//add_on_click_delete

    /**
     * delete timeout
     * @param {DOM}$tp
     */

    delete_tp_timeout($tp){
        $tp.classList.add('off');

        $tp.addEventListener('animationend',()=>{
            setTimeout(()=>{
                const $cont = $tp.parentElement;
                $cont.removeChild($tp);
            },300);
        });
    }//delete_tp_timeout
}//ToastPopup


new ToastPopup();