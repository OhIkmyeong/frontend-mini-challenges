class LightDarkMode{
    constructor(){
        this.init();
    }

    init(){
        const $theme = document.getElementById('toggle-theme');
        const $scheme = document.getElementById('toggle-scheme');

        $theme.addEventListener('change', e => {
            const isDark = e.target.checked;
            document.body.classList.toggle('dark',isDark);
            $scheme.checked = isDark;
        });
    }//init
}//LightDarkMode

new LightDarkMode();