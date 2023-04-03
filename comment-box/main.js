import {CommentBoxDomMaker} from "./CommentBoxDomMaker.js";

class CommentBox extends CommentBoxDomMaker{
    constructor(){
        super();
        this.$list = document.getElementById('comment-list');
        this.$newCommentBtn = document.getElementById("comment-write-submit");
    }//constructor
    
    /* ---------------------- 📌[BUILDER] ---------------------- */
    init(){
        /* 리스트 전체에 클릭이벤트 달기 - 버튼 클릭시 */
        this.$list.addEventListener('click', this.on_click_btns);
        
        /* 새 코멘트 작성 버튼 클릭시 */
        this.$newCommentBtn.addEventListener('click', this.on_click_btn_new_comment);
    }//init
    
    /* ---------------------- 📌[EVENT] ---------------------- */

    /**
     * 📍 버튼 클릭시
     * @param {*} e 
     */
    on_click_btns = e =>{
        switch(e.target.dataset.btn){
            case "reply" :{
                this.on_click_btn_reply(e);
            } break;

            case "edit" :{
                this.on_click_btn_edit(e);
            } break;

            case "delete" :{
                this.on_click_btn_delete(e);
            } break;
        }//switch
    }//on_click_btns

    /** 
     * 📍 
     * 새 코멘트 작성 버튼 클릭시 
     * @param {*} e 
     * */
    on_click_btn_new_comment = e =>{
        const $user = document.getElementById("comment-write-user");
        const $content = document.getElementById("comment-write-content");
        const user = $user.value.trim();
        const content = $content.value.trim();
        if(!user){ 
            alert("사용자 이름을 입력하세요"); 
            return;
        }
        if(!content){ 
            alert("내용을 입력하세요");
            return;
        }

        $user.value = "";
        $content.value = "";

        const $comment = this.make_new_comment(user,content);
        this.$list.appendChild($comment);
    }//on_click_btn_new_comment

    /* ---------------------- 📌[FUNC] ---------------------- */

    /** 
     * 📍 
     * 답변 클릭시 
     * - DOM 추가
     * - user name에 focus 하기
     * - post 버튼에 클릭 이벤트 추가
     * - cancel 버튼에 클릭 이벤트 추가
     * @param {*} e 
     * */
    on_click_btn_reply = e =>{
        /* DOM 추가 */
        const $commentReply = this.make_reply();
        const $subs = e.target.parentElement.parentElement.nextElementSibling;
        $subs.appendChild($commentReply);

        /* user name에 focus 하기 */
        const $mainTextUser = $commentReply.querySelector(`.${this.clssCommentMainTextUser}`);
        const $mainTextContent = $commentReply.querySelector(`.${this.clssCommentMainTextContent}`);
        $mainTextUser.focus();

        /* post 버튼에 클릭 이벤트 추가 */
        const $btnPost = $commentReply.querySelector('[data-btn="post"]');
        $btnPost.addEventListener('click',()=>{
            if(!$mainTextUser.value) return;
            if(!$mainTextContent.textContent) return;
            $btnPost.disabled = true;
            $mainTextUser.readOnly = true;
            $mainTextContent.removeAttribute('contenteditable');
            const $mainBtns = $commentReply.querySelector(`.${this.clssCommentMainBtns}`);
            $mainBtns.innerHTML = '';
            this.add_btns_default($mainBtns);
        });
        
        /* cancel 버튼에 클릭 이벤트 추가 */
        const $btnCncl = $commentReply.querySelector('[data-btn="cancel"]');
        $btnCncl.addEventListener('click',()=>{
            this.remove_comment_after_animation($commentReply);
        },{once:true});
    }//on_click_btn_reply

    /** 
     * 📍 
     * 수정 클릭시 
     * - 답변, 삭제 버튼을 disabled 시킴
     * - 취소 버튼을 만들어서 추가함
     * - 저장 버튼을 만들어서 추가함
     * - 수정 버튼 삭제
     * - 컨텐트의 contentEditable 가능하게
     * - 기존 컨텐트 textarea의 value를 저장하고cancel 버튼 클릭시 이벤트에 추가함.
     * - 저장 버튼에 이벤트 추가
     * @param {*} e 
     * */
    on_click_btn_edit = e =>{
        const $btnEdit = e.target;
        const $btns = $btnEdit.parentElement;

        /* 답변, 삭제 버튼을 disabled 시킴 */
        const btnList = ["reply","delete"];
        btnList.forEach(btnValue =>{
            const $btn = $btns.querySelector(`[data-btn="${btnValue}"]`);
            $btn.disabled = true;
        });
     
        /* 취소 버튼을 만들어서 추가함 */
        const $btnCncl = this.make_btn("cancel");
        $btns.insertBefore($btnCncl, $btnEdit);

        /* 저장 버튼을 만들어서 추가함 */
        const $btnSave = this.make_btn("save");
        $btns.insertBefore($btnSave, $btnEdit);

        /* 수정 버튼 삭제 */
        $btns.removeChild($btnEdit);

        /* 컨텐트의 contentEditable 가능하게 */
        const $content = $btns.previousElementSibling.querySelector(`.${this.clssCommentMainTextContent}`);
        $content.contentEditable = true;
        $content.focus();

        /* 기존 컨텐트 textarea의 value를 저장하고 cancel 버튼 클릭시 이벤트에 추가함. */
        const contentOriginal = $content.textContent;
        const $commentMain = $btns.parentElement;
        $btnCncl.addEventListener('click',()=>{
            this.on_click_btn_edit_cancel($commentMain,contentOriginal);
        },{once:true});
        
        /* 저장 버튼(=수정버튼)에 이벤트 추가 */
        $btnSave.addEventListener('click',()=>{
            this.on_click_btn_edit_save($commentMain);
        },{once:true});
    }//on_click_btn_edit


    /** 
     * 📍 
     * 수정-취소 클릭시 
     * - content의 내용을 원래 내용(contentOriginal)로 되돌림
     * - content를 contentEditable 불가능하게
     * - 버튼 관련 롤백
     *   - 수정 버튼 추가
     *   - 저장 버튼 삭제
     *   - 취소 버튼 삭제
     *   - reply 버튼, delete 버튼 disabled 해제
     * @param {DOM} $commentMain 
     * @param {String} contentOriginal 
     * */
    on_click_btn_edit_cancel = ($commentMain,contentOriginal) =>{
        const $content = $commentMain.querySelector(`.${this.clssCommentMainTextContent}`);
        
        /* content의 내용을 원래 내용(contentOriginal)로 되돌림 */
        $content.textContent = contentOriginal;
        
        /* content를 contentEditable 불가능하게 */
        $content.removeAttribute('contenteditable');

        /* 버튼 관련 롤백 */
        this.roll_back_btns($commentMain);
    }//on_click_btn_edit_cancel

    /** 
     * 📍 
     * 수정-저장 클릭시 
     * - content의 contentEditable 불가능
     * - 버튼 관련 롤백
     *   - 수정 버튼 추가
     *   - 취소 버튼 삭제
     *   - 저장 버튼 삭제
     *   - reply 버튼, delete 버튼 disabled 해제
     * @param {DOM} $commentMain
     * */
    on_click_btn_edit_save = ($commentMain) =>{
        const $content = $commentMain.querySelector(`.${this.clssCommentMainTextContent}`);

        /* content를 contentEditable 불가능하게 */
        $content.removeAttribute('contenteditable');
        
        /* 버튼 관련 롤백 */
        this.roll_back_btns($commentMain);
    }//on_click_btn_edit_save

    /**
     * 📍
     * 수정 버튼 누른 뒤 > 저장/ 취소 버튼을 눌렀을 때 
     * - 수정 버튼 추가
     * - 취소 버튼 삭제
     * - 저장 버튼 삭제
     * - reply 버튼, delete 버튼 disabled 해제
     * @param {*} $commentMain 
     */
    roll_back_btns = ($commentMain) =>{
        const $btns = $commentMain.querySelector(`.${this.clssCommentMainBtns}`);
        const $btnCncl = $commentMain.querySelector('[data-btn="cancel"]');

        /* 수정 버튼 추가 */
        const $btnEdit = this.make_btn('edit');
        $btns.insertBefore($btnEdit,$btnCncl);

        /* 취소 버튼 삭제 */
        $btns.removeChild($btnCncl);

        /* 저장 버튼 삭제 */
        const $btnSave = $commentMain.querySelector('[data-btn="save"]');
        $btns.removeChild($btnSave);

        /* reply 버튼, delete 버튼 disabled 해제 */
        const btnList = ["reply","delete"];
        btnList.forEach(btnValue =>{
            const $btn = $btns.querySelector(`[data-btn="${btnValue}"]`);
            $btn.removeAttribute('disabled');
        });
    }//roll_back_btns


    /** 
     * 📍 
     * 삭제 클릭시 
     * @param {*} e 
     * */
    on_click_btn_delete = e =>{
        const $comment = e.target.parentElement.parentElement.parentElement;
        this.remove_comment_after_animation($comment);
    }//on_click_btn_delete

    /* ---------------------- 📌[TOOLS] ---------------------- */
    /**
     * 📍
     * 애니메이션 효과가 끝나면, 애니메이션 효과 관련 클래스를 제거함
     * @param {DOM} $comment 
     */
    remove_show_animation($comment){
        $comment.addEventListener('animationend',()=>{
            $comment.classList.remove(this.clssCommentShow);
        },{once:true});
    }//remove_show_animation

    /**
     * 📍 애니메이션 효과가 끝나면, DOM을 제거함
     */
    remove_comment_after_animation($comment){
        $comment.classList.add(this.clssCommentHide);
        $comment.addEventListener('animationend',()=>{
            console.log('...');
            $comment.parentElement.removeChild($comment);
        },{once:true});
    }//remove_comment_after_animation

    /**
     * 📍
     * 내용 영역 textarea DOM의 height를 조정한다
     * @param {DOM} $comment || $comment-main 도 OK
     * @deprecated
     */
    resize_height_content($comment){
        const $content = $comment.querySelector(`.${this.clssCommentMainTextContent}`);
        $content.style.height = `auto`;
    }//resize_height_content
}//class-CommentBox

/* 🥩🥩🥩🥩🥩🥩🥩🥩---------------- [실행] ------------ */
new CommentBox().init();