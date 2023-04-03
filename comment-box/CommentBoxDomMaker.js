export class CommentBoxDomMaker{
    constructor(){
    }//constructor

    /* ---------------------- 📌[DATA : ID] ---------------------- */
    get clssComment(){ return "comment" }
    get clssCommentShow(){ return "on"}
    get clssCommentHide(){ return "off"}

    get clssCommentMain(){ return this.clssComment + "-main" }
    get clssCommentMainText(){ return this.clssCommentMain + '-text' }
    get clssCommentMainTextUser(){ return this.clssCommentMainText + '-user' }
    get clssCommentMainTextContent(){ return this.clssCommentMainText + '-content' }

    get clssCommentMainBtns(){ return this.clssCommentMain + '-btns' }

    get clssCommentSubs(){ return this.clssComment + '-subs' }
    
    /* ---------------------- 📌[DOM MAKER : (write)답변 만들기] ---------------------- */
    /**
     * 📍
     * 새 코멘트를 만들어 반환함.
     * @param {String} user 
     * @param {String} content 
     * @returns {DOM} .comment
     */
    make_new_comment(user,content){
        /* comment-wrap */
        const $comment = this.make_comment_wrap();

        /* comment-main */
        const $main  = this.make_comment_main();

        /* comment-main-text */
        const $mainText = this.make_comment_main_text();
        const $mainTextUser = $mainText.querySelector(`.${this.clssCommentMainTextUser}`);
        const $mainTextContent = $mainText.querySelector(`.${this.clssCommentMainTextContent}`);
        $mainTextUser.value = user;
        $mainTextUser.readOnly = true;
        $mainTextContent.textContent = content;

        /* comment-main-btns */
        const $mainBtns = this.make_btn_wrap();
        this.add_btns_default($mainBtns);
        
        /* comment-subs */
        const $subs = this.make_subs();
        
        /* 최종 */
        $main.appendChild($mainText);
        $main.appendChild($mainBtns);
        $comment.appendChild($main);
        $comment.appendChild($subs);
        return $comment;
    }//make_new_comment

    /* ---------------------- 📌[DOM MAKER : (read)코멘트 만들기] ---------------------- */
    /**
     * 📍 답변 코멘트를 만들어 반환한다.
     */
    make_reply(){
        /* comment-wrap */
        const $commentReply = this.make_comment_wrap();

        /* comment-main */
        const $main  = this.make_comment_main();

        /* comment-main-text */
        const $mainText = this.make_comment_main_text();
        const $mainTextContent = $mainText.querySelector(`.${this.clssCommentMainTextContent}`);
        $mainTextContent.contentEditable = true;
        
        /* comment-main-btns */
        const $mainBtns = this.make_btn_wrap();
        this.add_btns_reply($mainBtns);

        /* comment-subs */
        const $subs = this.make_subs();

        /* 최종 */
        $main.appendChild($mainText);
        $main.appendChild($mainBtns);
        $commentReply.appendChild($main);
        $commentReply.appendChild($subs);
        return $commentReply;
    }//make_reply
    /* ---------------------- 📌[Element] ---------------------- */
    /**
     * 📍 .comment 만들어 반환(전체 wrap)
     * @returns {DOM}
     */
    make_comment_wrap(){
        const $comment = document.createElement('ARTICLE');
        $comment.classList.add(this.clssComment);
        $comment.classList.add(this.clssCommentShow);
        this.remove_show_animation($comment);
        return $comment;
    }//make_comment_wrap

    /**
     * 📍 메인 코멘트 영역 만들어 반환
     * @returns {DOM}
     */
    make_comment_main(){
        const $main  = document.createElement('SECTION');
        $main.classList.add(this.clssCommentMain);
        return $main;
    }//make_comment_main

    /**
     * 📍 메인 코멘트의 텍스트 영역 만들어 반환
     * @returns {DOM}
     */
    make_comment_main_text(){
        const $mainText = document.createElement('DIV');
        $mainText.classList.add(this.clssCommentMainText);

        const $mainTextUser = document.createElement('INPUT');
        $mainTextUser.classList.add(this.clssCommentMainTextUser);
        $mainTextUser.placeholder = "User Name";
        
        const $mainTextContent = document.createElement('DIV');
        $mainTextContent.classList.add(this.clssCommentMainTextContent);

        $mainText.appendChild($mainTextUser);
        $mainText.appendChild($mainTextContent);

        return $mainText;
    }//make_comment_main_text
    
    /**
     * 📍 버튼 들어가는 영역 만들어 반환
     * @returns {DOM}
     */
    make_btn_wrap(){
        const $mainBtns = document.createElement('DIV');
        $mainBtns.classList.add(this.clssCommentMainBtns);
        return $mainBtns;
    }//make_btn_wrap
    /**
     * 📍 버튼을 만들어 반환함
     * @param {String} btnValue 
     * @returns {DOM}
     */
    make_btn(btnValue){
        const $btn = document.createElement('BUTTON');
        $btn.classList.add(this.clssCommentMainBtns + '-btn');
        $btn.dataset.btn = btnValue;
        $btn.title = btnValue;
        $btn.textContent = btnValue;
        return $btn;
    }//make_btn

    /**
     * 📍 기본 버튼들을 만들어 추가
     * (답변,수정,삭제)
     * @param {DOM} $mainBtns t
     */
    add_btns_default($mainBtns){
        const btnList = ["reply", "edit", "delete"];
        btnList.forEach(btnValue =>{
            const $btn = this.make_btn(btnValue);
            $mainBtns.appendChild($btn);
        });
    }//add_btns_default

    /**
     * 📍 답변시 쓰이는 버튼들을 만들어 추가
     * @param {DOM} $mainBtns 
     */
    add_btns_reply($mainBtns){
        const btnList = ["post", "cancel"];
        btnList.forEach(btnValue =>{
            const $btn = this.make_btn(btnValue);
            $mainBtns.appendChild($btn);
        });
    }//add_btns_reply

    /**
     * 📍 서브 영역 만들어 반환
     * @returns {DOM}
     */
    make_subs(){
        const $subs  = document.createElement('SECTION');
        $subs.classList.add(this.clssCommentSubs);
        return $subs;
    }//make_subs
}//class-CommentBoxDomMaker