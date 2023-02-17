class ToDoList{
    constructor(){
        this.$form = document.getElementById('form-todo');
        this.$todo = document.getElementById('todo');
        this.$reset = document.getElementById('todo-reset');

        this.init();
    }//constructor

    init(){
        this.$form.addEventListener('submit',this.on_submit);
        this.$todo.addEventListener('click',this.on_click);
        this.$reset.addEventListener('click',this.on_reset);
    }//init

    on_submit = e => {
        e.preventDefault();
        const $ipt = this.$form["todo-ipt"]; 
        const val = $ipt.value;
        $ipt.value = '';
    
        const $item = this.make_item(val);
        this.$todo.appendChild($item);

        $ipt.focus();
    }//on_submit

    on_click = e => {
        if(e.target.classList.contains('todo-item-modify'))this.modify_item(e.target);    
        if(e.target.classList.contains('todo-item-delete'))this.delete_item(e.target);    
    }//on_click

    on_reset = () => {
        const $$delete = document.querySelectorAll(".todo-item-delete");
        $$delete.forEach(($delete,idx) => {
            setTimeout(()=>{
                this.delete_item($delete)
            },150 * ($$delete.length - idx));
        });
    }//on_reset

    /* ----------- */

    make_item(val){
        const $item = document.createElement('LI');
        const $inWrap = document.createElement('DIV')
        const $text = document.createElement('INPUT');
        const $modify = document.createElement('BUTTON');
        const $delete = document.createElement('BUTTON');

        //class추가
        $item.classList.add('todo-item');
        $inWrap.classList.add('todo-item-inwrap');
        $text.classList.add('todo-item-text');
        $modify.classList.add('todo-item-modify');
        $delete.classList.add('todo-item-delete');

        //기타 속성 추가
        $text.type = "text";
        $text.value = val;
        $text.readOnly = true;

        $modify.title = "수정"
        $modify.textContent = "✏️";
        $modify.dataset.modify = "off";

        $delete.title = "삭제"
        $delete.textContent = "🗑️";

        //DOM 추가
        $inWrap.appendChild($text);
        $inWrap.appendChild($modify);
        $inWrap.appendChild($delete);
        $item.appendChild($inWrap);

        return $item;
    }//make_item

    modify_item($modify){
        const $text = $modify.previousElementSibling;
        const bool = $modify.dataset.modify == "off" ? false : true;
        $text.readOnly = bool;
        $modify.textContent = bool ? "✏️" : "💾";
        $modify.dataset.modify = bool ? "off" : "on";
        
        if(!bool){
            $text.focus();
            $text.dataset.prevVal = $text.value;
            $text.addEventListener('keyup',this.on_keyup_enter);
        }else{
            this.save_item($modify);
        }
    }//modify_item

    save_item($modify){
        const $text = $modify.previousElementSibling;
        $text.readOnly = true;
        $text.blur();
        $modify.textContent = "✏️";
        $modify.dataset.modify = "off";

        const prevVal = $text.dataset.prevVal;
        if(!$text.value) $text.value = prevVal;
        $text.removeAttribute('data-prev-val');
        $text.removeEventListener('keyup',this.on_keyup_enter);
    }//save_item

    on_keyup_enter = e =>{
        if(e.key == "Enter"){
            const $modify = e.target.nextElementSibling;
            this.save_item($modify);
        }
    }//on_keyup_enter

    delete_item($delete){
        const $item = $delete.parentElement.parentElement;
        $item.classList.add('remove');
        $item.addEventListener('animationend',()=>{
            setTimeout(()=>{
                this.$todo.removeChild($item);
            },100);
        });
    }//delete_item
}//TodoList

new ToDoList();