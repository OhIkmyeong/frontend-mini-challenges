class Calendar{
    #today = 'yyyy-mm-dd';
    #curr = 'yyyy-mm-dd';

    constructor(){
        this.$btnPrev = document.getElementById('prev-mm-calendar');
        this.$btnNext = document.getElementById('next-mm-calendar');
        this.$selMonth = document.getElementById('sel-mm-calendar');
        this.$selYear = document.getElementById('sel-yy-calendar');
        this.$tbody = document.getElementById('calendar').getElementsByTagName('TBODY')[0];
        this.$btnToday = document.getElementById('today-calendar');
        this.init();
    }//constructor

    init(){
        this.get_today();
        this.draw_sel_month();
        this.draw_sel_year();
        this.reset();

        this.$selMonth.addEventListener('change',this.on_change_month);
        this.$selYear.addEventListener('change',this.on_change_year);
        this.$btnPrev.addEventListener('click',this.on_click_prev_next);
        this.$btnNext.addEventListener('click',this.on_click_prev_next);
        this.$btnToday.addEventListener('click',this.reset);
    }//init

    reset = () =>{
        this.#curr = this.#today;
        this.select_curr_month();
        this.select_curr_year();
        this.draw_calendar(this.#today);
    }//reset

    /* ---- DOM ---- */
    draw_sel_month(){
        const month = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const $frag = document.createDocumentFragment();
        month.forEach((mm,idx) =>{
            const $option = document.createElement('OPTION');
            $option.textContent = mm;
            $option.value = idx;
            $frag.appendChild($option);
        });

        this.$selMonth.appendChild($frag);
    }//draw_sel_month

    draw_sel_year(){
        const thisYear = Number(this.#today.split('-')[0]);
        const startYear = thisYear - 100;
        const endYear = thisYear + 10;
        const $frag = document.createDocumentFragment();

        for(let yy = startYear; yy <= endYear; yy++){
            const $option = document.createElement('OPTION');
            $option.value = yy;
            $option.textContent = yy;
            $frag.appendChild($option);
        }//for

        this.$selYear.appendChild($frag);
    }//draw_sel_year

    /**
     * 본격적인 달력 그리기
     * @param {String} dateString yyyy-mm-dd 
     * 여기서는 table로 해서 tr insertRow 쓰지만
     * 그냥 CSS grid로 7개로 나눠버리는 정책으로 가면 그런것도 안 해도 되긴 함.
     */
    draw_calendar(dateString){
        this.$tbody.innerHTML = '';

        const [yy,mm,dd] = dateString.split('-').map(s => Number(s));
        const start = new Date(yy,mm - 1, 1);
        const last = new Date(yy,mm,0);

        let cnt = start.getDay();
        let $tr = this.$tbody.insertRow();

        /* 날짜 첫 요일까지 빈칸 삽입 */
        for(let k=0; k<cnt; k++) $tr.insertCell();

        /* 날짜 채우기 시작 */
        for(let i=1; i<=last.getDate(); i++){
            cnt++;
            const $td = $tr.insertCell();

            const $date = document.createElement('DIV');
            $date.classList.add('date-calendar');
            $date.textContent = i;
            if(`${yy}-${mm}-${i}` == this.#today) $date.classList.add("today");

            $td.appendChild($date);

            if(cnt % 7 == 0){
                $tr = this.$tbody.insertRow();
            }
        }//for

        /* 현재 연도와 달이 아니라면 Today 버튼 */
        const [todayYY,todayMM,_] = this.#today.split('-'); 
        const isToday = (todayYY == yy && todayMM == mm) ? true : false;
        this.toggle_disable_btn_today(isToday);
    }//draw_calendar

    /* ------- FUNC ------- */
    toggle_disable_btn_today(bool){
        this.$btnToday.disabled = bool
    }//toggle_disable_btn_today

    on_change_month = e => {
        const val = Number(e.currentTarget.selectedOptions[0].value);
        const [yy,_,dd] = this.#curr.split('-');
        this.#curr = `${yy}-${val + 1}-${dd}`;
        this.draw_calendar(this.#curr);
    }//on_change_month

    on_change_year = e => {
        const val = Number(e.currentTarget.selectedOptions[0].value);
        const [_,mm,dd] = this.#curr.split('-');
        this.#curr = `${val}-${mm}-${dd}`;
        this.draw_calendar(this.#curr);
    }//on_change_year

    on_click_prev_next = (e) => {
        const prevNext = e.currentTarget.id.split('-')[0] == "prev" ? -1 : 1;
        let [yy,mm,_] = this.#curr.split('-').map(el => Number(el));
        mm += prevNext;
        if(mm <= 0){
            mm = 12;
            yy--;
        }
        if(mm > 12){
            mm = 1;
            yy++;
        }
        this.#curr = `${yy}-${mm}-1`;
        this.draw_calendar(this.#curr);
        this.select_curr_month();
        this.select_curr_year();
    }//on_click_prev_next

    /* ------- DATE --------- */
    return_date_string(date){
        const DATE = new Date(date);
        const yyyy = DATE.getFullYear();
        const mm = DATE.getMonth() + 1;
        const dd = DATE.getDate();
        return `${yyyy}-${mm}-${dd}`;
    }//return_date_string
    
    get_today(){
        this.#today = this.return_date_string(new Date());
        console.log(this.#today);
    }//get_today

    select_curr_month(){
        const mm = String(Number(this.#curr.split('-')[1]) - 1);
        const $option = this.$selMonth.querySelector(`[value="${mm}"]`);
        $option.selected = true;
    }//select_today_month

    select_curr_year(){
        const yy = this.#curr.split('-')[0];
        const $option = this.$selYear.querySelector(`[value="${yy}"]`);
        $option.selected = true;
    }//select_today_year
}//class-calendar

new Calendar();