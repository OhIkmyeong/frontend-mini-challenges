class Header{
    /** 상단에 공통적으로 들어가는 Header 부분을 생성합니다. */
    constructor(){
        this.url = {
            img : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            home : "https://ohikmyeong.github.io/frontend-mini-challenges",
            github : "https://github.com/ohikmyeong/frontend-mini-challenges"
        }

        this.init();
    }//constructor

    /** DOM 생성 시작 */
    init(){
        const $header = document.createElement('HEADER');
        const $home = document.createElement('A');
        const $title = document.createElement('H1');
        const $git = document.createElement('A');

        $header.id = "hdr"
        
        $home.classList.add('hdr-link-list');
        $home.href = this.url.home;
        $home.title = 'BACK TO LIST';
        $home.textContent = "LIST";

        $title.classList.add("hdr-title");
        $title.textContent = document.head.getElementsByTagName('title')[0].textContent;

        const $gitImg = new Image();
        $gitImg.src = this.url.img;
        $gitImg.alt = "깃허브 아이콘"
        
        $git.classList.add("hdr-link-git");
        $git.title = "깃허브";
        $git.href = this.url.github;
        $git.setAttribute('target','_blank');
        
        //DOM 추가
        $git.appendChild($gitImg);
        $header.appendChild($home);
        $header.appendChild($title);
        $header.appendChild($git);

        const $first = document.body.children[0];
        if($first){
            document.body.insertBefore($header,$first);
        }else{
            document.body.appendChild($header);
        }
    }//init
}//class-Header

new Header();