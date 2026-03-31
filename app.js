/**
 * Shelley Event - App Logic
 */
import { supabase } from './supabase.js';

const state = {
    user: null, // 로그인한 사용자 정보 저장
    currentView: 'home',
    flow: null, // 'A' or 'B'
    currentStep: 0,
    selectedPhotos: [],
    locale: 'ko', // 현재 언어 설정 추가
    data: {
        intent: '',
        story: '',
        resonance: '',
        poemMusic: null,
        poemText: '',
        subtitleEffect: '',
        musicStyle: '',
        musicTrack: '',
        privacy: null
    },
    creationState: 'initial'
};

const i18n = {
    ko: {
        login: '로그인', logout: '로그아웃',
        nav_home: '홈', nav_flow: '보기/메모', nav_studio: '꾸미기', nav_store: '스토어',
        mode_a_title: '보기-내 작품 모두', mode_b_title: '메모-연결 서비스', studio_title: '꾸미기', filter_text: '글', filter_music: '음악', filter_all: '사진', filter_desc: '생성 날짜 순으로 정렬됩니다.',
        banner_title: '추천 연결 서비스', banner_desc: '사진과 함께 활용하기 좋은 앱을 소개합니다.', app_edit: '사진 꾸미기', app_frame: '디지털 액자', app_print: '사진 인쇄', app_music: '음악 만들기', app_link_desc: '추천 앱 이동',
        modal_title: '회원가입 / 로그인', modal_email_desc: '이메일 인증을 통해 간편하게 가입 및 로그인하세요.', modal_email_btn: '이메일로 계속하기',
        home_greetings: '안녕하세요, 작가님.',
        home_subtitle: '오늘의 순간을 특별한 기록으로 남겨보세요.',
        home_start: '작업 시작하기',
        flow_a_title: '작품 만들기',
        flow_a_desc: '방금 찍은 소중한 순간들을 바로 공유하고 이야기를 담아보세요.',
        flow_b_title: '작품 감상하기',
        flow_b_desc: '보관함 속 잊고 있던 추억을 꺼내어 새로운 의미를 부여합니다.',
        home_news: '최근 소식',
        news_title: 'Shelley 리트리트 이벤트', news_desc: '지금 바로 참여 신청을 확인하세요.',
        step_photo: '사진 선택', step_creation: '시/음악 제작', step_share: '발표/공유',
        step_photo_desc: '사진을 업로드하거나 직접 촬영하세요.',
        upload_folder: '내 폴더에서 선택', take_photo: '직접 사진 찍기',
        btn_prev: '이전', btn_next: '다음', btn_finish: '완료',
        creation_title: '나만의 시와 음악 만들기', creation_desc: '사진의 감성을 시와 음악으로 승화시킵니다.',
        btn_start_creation: '작품 생성 시작하기', creation_tool_q: '무엇을 먼저 만드시겠어요?',
        btn_poetry: "'시' 쓰기", btn_music: '음악 만들기',
        share_title: '발표 준비', share_desc: '작업하신 멋진 작품을 다른 사람들과 함께 감상하시겠어요?',
        btn_public: '공개 (공유)', btn_private: '비공개 (혼자 보기)', alert_privacy: '공개 여부를 먼저 선택해주세요.', alert_login_required: '저장하려면 로그인이 필요합니다. 상단 로그인 버튼을 이용해주세요.',
        modal_email_placeholder: '이메일 주소를 입력하세요', modal_or: '또는',
        modal_google: 'Google 계정으로 연결', modal_facebook: 'Facebook 계정으로 연결', modal_kakao: 'Kakao 계정으로 연결',
        poem_placeholder: '당신의 감성을 시로 표현해보세요...', poem_adv_edit: '고급 편집 (글자체/크기/색상)',
        font_sel: '글꼴 선택', font_serif: '명조체', font_sans: '고딕체', font_nanum: '나눔펜', font_jua: '주아', font_gowun: '고운돋움', font_song: '송명', font_gaegu: '개구쟁이',
        size_sel: '글자 크기', size_up: '점점 크게', size_down: '점점 작게',
        effect_sel: '자막 효과 선택', effect_fade: '페이드', effect_type: '타자방식', effect_slide: '슬라이드', effect_zoom: '줌인',
        btn_write_later: '시 나중에 쓰기'
    },
    en: {
        login: 'Login', logout: 'Logout',
        nav_home: 'Home', nav_flow: 'View/Memo', nav_studio: 'Decorate', nav_store: 'Store',
        mode_a_title: 'View - All My Works', mode_b_title: 'Memo - Connection Service', studio_title: 'Decorate', filter_text: 'Text', filter_music: 'Music', filter_all: 'Photo', filter_desc: 'Sorted by creation date.',
        banner_title: 'Recommended Connection Services', banner_desc: 'Introducing great apps to use with your photos.', app_edit: 'Photo Decoration', app_frame: 'Digital Frame', app_print: 'Photo Print', app_music: 'Music Creation', app_link_desc: 'Go to recommended app',
        modal_title: 'Sign Up / Login', modal_email_desc: 'Easily sign up and login via email verification.', modal_email_btn: 'Continue with Email',
        home_greetings: 'Hello, Creator.',
        home_subtitle: 'Make today\'s moments a special record.',
        home_start: 'Start Working',
        flow_a_title: 'Create Artwork',
        flow_a_desc: 'Share the precious moments you just captured and tell a story.',
        flow_b_title: 'Appreciate Gallery',
        flow_b_desc: 'Bring out forgotten memories from the archive and give them new meaning.',
        home_news: 'Recent News',
        news_title: 'Shelley Retreat Event', news_desc: 'Check your participation application right now.',
        step_photo: 'Select Photo', step_creation: 'Poetry/Music', step_share: 'Share',
        step_photo_desc: 'Upload a photo or take one directly.',
        upload_folder: 'Select from Folder', take_photo: 'Take a Photo',
        btn_prev: 'Previous', btn_next: 'Next', btn_finish: 'Finish',
        creation_title: 'Create Your Poetry & Music', creation_desc: 'Sublimate the emotion of the photo into poetry and music.',
        btn_start_creation: 'Start Creation', creation_tool_q: 'What would you like to create first?',
        btn_poetry: 'Write Poetry', btn_music: 'Make Music',
        share_title: 'Share Readiness', share_desc: 'Would you like to enjoy your wonderful work with others?',
        btn_public: 'Public (Share)', btn_private: 'Private (Only me)', alert_privacy: 'Please select public/private status first.', alert_login_required: 'Login required to save. Please use the login button at the top.',
        modal_email_placeholder: 'Enter your email address', modal_or: 'OR',
        modal_google: 'Continue with Google', modal_facebook: 'Continue with Facebook', modal_kakao: 'Continue with Kakao',
        poem_placeholder: 'Express your feelings with poetry...', poem_adv_edit: 'Advanced Edit (Font/Size/Color)',
        font_sel: 'Select Font', font_serif: 'Serif', font_sans: 'Sans-Serif', font_nanum: 'Nanum Pen', font_jua: 'Jua', font_gowun: 'Gowun', font_song: 'Song Myung', font_gaegu: 'Gaegu',
        size_sel: 'Font Size', size_up: 'Grow Larger', size_down: 'Grow Smaller',
        effect_sel: 'Subtitle Effect', effect_fade: 'Fade', effect_type: 'Typewriter', effect_slide: 'Slide', effect_zoom: 'Zoom In',
        btn_write_later: 'Write Poetry Later'
    },
    zh: {
        login: '登录', logout: '登出',
        nav_home: '首页', nav_flow: '查看/备忘录', nav_studio: '装饰', nav_store: '商店',
        mode_a_title: '查看 - 我所有的作品', mode_b_title: '备忘录 - 连接服务', studio_title: '装饰', filter_text: '文字', filter_music: '音乐', filter_all: '照片', filter_desc: '按创建日期排序。',
        banner_title: '推荐连接服务', banner_desc: '介绍与您的照片一起使用的好应用。', app_edit: '照片装饰', app_frame: '数码相框', app_print: '照片打印', app_music: '音乐制作', app_link_desc: '前往推荐应用',
        modal_title: '注册 / 登录', modal_email_desc: '通过电子邮件验证轻松注册和登录。', modal_email_btn: '使用电子邮件继续',
        home_greetings: '你好，创作者。',
        home_subtitle: '把今天的瞬间变成特别的记录。',
        home_start: '开始工作',
        flow_a_title: '创作艺术',
        flow_a_desc: '分享刚刚捕捉的珍贵瞬间并讲述背后的故事。',
        flow_b_title: '欣赏画廊',
        flow_b_desc: '从档案中唤醒被遗忘的记忆并赋予新意。',
        home_news: '最新消息',
        news_title: 'Shelley 务虚会活动', news_desc: '立即查看您的参与申请。',
        step_photo: '选择照片', step_creation: '诗歌/音乐创作', step_share: '分享',
        step_photo_desc: '上传照片或直接拍照。',
        upload_folder: '从文件夹中选择', take_photo: '直接拍照',
        btn_prev: '上一步', btn_next: '下一步', btn_finish: '完成',
        creation_title: '创作您的诗歌与音乐', creation_desc: '将照片的情感升华为诗歌与音乐。',
        btn_start_creation: '开始创作', creation_tool_q: '您想先创作什么？',
        btn_poetry: '写诗', btn_music: '制作音乐',
        share_title: '准备分享', share_desc: '您想与他人分享您的精彩作品吗？',
        btn_public: '公开 (分享)', btn_private: '私密 (仅自己可见)', alert_privacy: '请先选择公开/私密状态。', alert_login_required: '保存需要登录。请使用顶部的登录按钮。',
        modal_email_placeholder: '请输入您的电子邮箱地址', modal_or: '或者',
        modal_google: '连接 Google 账号', modal_facebook: '连接 Facebook 账号', modal_kakao: '连接 Kakao 账号',
        poem_placeholder: '用诗歌表达你的情感...', poem_adv_edit: '高级编辑 (字体/大小/颜色)',
        font_sel: '选择字体', font_serif: '衬线体', font_sans: '无衬线体', font_nanum: 'Nanum 笔', font_jua: 'Jua', font_gowun: 'Gowun', font_song: 'Song Myung', font_gaegu: 'Gaegu',
        size_sel: '字体大小', size_up: '逐渐放大', size_down: '逐渐缩小',
        effect_sel: '字幕效果选择', effect_fade: '淡入淡出', effect_type: '打字机', effect_slide: '滑动', effect_zoom: '放大',
        btn_write_later: '以后写诗'
    },
    es: {
        login: 'Iniciar sesión', logout: 'Cerrar sesión',
        nav_home: 'Inicio', nav_flow: 'Ver/Memo', nav_studio: 'Decorar', nav_store: 'Tienda',
        mode_a_title: 'Ver - Todas mis obras', mode_b_title: 'Memo - Servicio de conexión', studio_title: 'Decorar', filter_text: 'Texto', filter_music: 'Música', filter_all: 'Foto', filter_desc: 'Ordenado por fecha de creación.',
        banner_title: 'Servicios de conexión recomendados', banner_desc: 'Presentamos excelentes aplicaciones para usar con tus fotos.', app_edit: 'Decoración de fotos', app_frame: 'Marco digital', app_print: 'Impresión de fotos', app_music: 'Creación de música', app_link_desc: 'Ir a la aplicación',
        modal_title: 'Regístrate / Iniciar sesión', modal_email_desc: 'Regístrate e inicia sesión fácilmente mediante verificación por correo.', modal_email_btn: 'Continuar con correo',
        home_greetings: 'Hola, Creador.',
        home_subtitle: 'Haz de los momentos de hoy un registro especial.',
        home_start: 'Comenzar a trabajar',
        flow_a_title: 'Crear arte',
        flow_a_desc: 'Comparte los momentos preciosos que acabas de capturar y cuenta una historia.',
        flow_b_title: 'Apreciar la galería',
        flow_b_desc: 'Saca a la luz recuerdos olvidados del archivo y dales un nuevo significado.',
        home_news: 'Noticias recientes',
        news_title: 'Evento de Retiro Shelley', news_desc: 'Compruebe su solicitud de participación ahora mismo.',
        step_photo: 'Seleccionar foto', step_creation: 'Poesía/Música', step_share: 'Compartir',
        step_photo_desc: 'Sube una foto o tómala directamente.',
        upload_folder: 'Carpeta', take_photo: 'Cámara',
        btn_prev: 'Anterior', btn_next: 'Siguiente', btn_finish: 'Finalizar',
        creation_title: 'Crea tu poesía y música', creation_desc: 'Sublima la emoción de la foto en poesía y música.',
        btn_start_creation: 'Empezar a crear', creation_tool_q: '¿Qué te gustaría crear primero?',
        btn_poetry: 'Escribir Poesía', btn_music: 'Hacer Música',
        share_title: 'Preparación', share_desc: '¿Te gustaría disfrutar de tu maravillosa obra con los demás?',
        btn_public: 'Público (Compartir)', btn_private: 'Privado (Solo yo)', alert_privacy: 'Seleccione primero el estado público/privado.', alert_login_required: 'Es necesario iniciar sesión para guardar. Utilice el botón de inicio de sesión en la parte superior.',
        modal_email_placeholder: 'Introduzca su dirección de correo electrónico', modal_or: 'O',
        modal_google: 'Conectar con Google', modal_facebook: 'Conectar con Facebook', modal_kakao: 'Conectar con Kakao',
        poem_placeholder: 'Expresa tus emociones con poesía...', poem_adv_edit: 'Edición avanzada (Fuente/Tamaño/Color)',
        font_sel: 'Seleccionar fuente', font_serif: 'Serif', font_sans: 'Sans-Serif', font_nanum: 'Nanum Pen', font_jua: 'Jua', font_gowun: 'Gowun', font_song: 'Song Myung', font_gaegu: 'Gaegu',
        size_sel: 'Tamaño de fuente', size_up: 'Agrandar', size_down: 'Encoger',
        effect_sel: 'Efecto de subtítulo', effect_fade: 'Desvanecer', effect_type: 'Máquina escribir', effect_slide: 'Deslizar', effect_zoom: 'Acercar',
        btn_write_later: 'Escribir poesía luego'
    }
};

window.t = function(key) {
    return i18n[state.locale][key] || key;
};

window.updateStaticTexts = function() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[state.locale] && i18n[state.locale][key]) {
            el.textContent = i18n[state.locale][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[state.locale] && i18n[state.locale][key]) {
            el.setAttribute('placeholder', i18n[state.locale][key]);
        }
    });
};

const views = {
    home: () => `
        <div class="hero-card card">
            <h1>${t('home_greetings')}</h1>
            <p>${t('home_subtitle')}</p>
        </div>
        
        <h2 class="section-title">${t('home_start')}</h2>
        <div class="card clickable" onclick="navigateToFlow('A')">
            <div class="card-icon"><i data-lucide="camera-off"></i></div>
            <h3>${t('flow_a_title')}</h3>
            <p>${t('flow_a_desc')}</p>
        </div>

        <div class="card clickable" onclick="navigateToFlow('B')">
            <div class="card-icon"><i data-lucide="image"></i></div>
            <h3>${t('flow_b_title')}</h3>
            <p>${t('flow_b_desc')}</p>
        </div>

        <h2 class="section-title">${t('home_news')}</h2>
        <div class="card">
            <div style="display:flex; gap:12px; align-items:center;">
                <div style="width:60px; height:60px; background:#2d3463; border-radius:12px;"></div>
                <div>
                    <h4>${t('news_title') || 'Shelley 리트리트 이벤트'}</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted);">${t('news_desc') || '지금 바로 참여 신청을 확인하세요.'}</p>
                </div>
            </div>
        </div>
    `,

    'my-works': () => `
        <h2 class="section-title">보기-내 작품 모두</h2>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">내 작품을 감상하고 메모를 남기거나 다른 사람들에게 공개할 수 있습니다.</p>
        
        <div style="display:flex; flex-direction:column; gap:24px;">
            <!-- Work Item 1 -->
            <div class="card" style="padding:0; overflow:hidden; border-radius:12px; margin:0;">
                <!-- Thumbnail Area -->
                <div style="aspect-ratio:16/9; background:#1e1e2d; position:relative; background-image:url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&fit=crop'); background-size:cover; background-position:center;">
                    <!-- Checkbox for Public -->
                    <div style="position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.6); padding:6px 10px; border-radius:8px; display:flex; align-items:center; gap:6px; z-index:10;">
                        <input type="checkbox" id="public_check_1" checked style="width:16px; height:16px; accent-color:var(--primary); cursor:pointer;" onchange="toggleMyWorksPublic(1, this.checked)">
                        <label for="public_check_1" style="font-size:0.8rem; color:white; cursor:pointer;">공개</label>
                    </div>
                </div>
                <!-- Action & Memo Area -->
                <div style="padding:16px; background:var(--secondary);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                        <div>
                            <h4 style="margin-bottom:4px;">봄바람의 속삭임</h4>
                            <p style="font-size:0.75rem; color:var(--text-muted);">잔잔한 피아노, 나눔펜글씨</p>
                        </div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">2024.03.31</div>
                    </div>
                    <textarea class="input-field" style="width:100%; height:70px; padding:10px; font-size:0.85rem; resize:none; border:1px solid var(--glass-border); border-radius:8px; background:rgba(0,0,0,0.2); color:white;" placeholder="이 작품에 대한 메모나 영감을 작성하세요..." onchange="saveMyWorksMemo(1, this.value)">사진을 보며 느꼈던 따뜻한 마음을 기록합니다.</textarea>
                </div>
            </div>

            <!-- Work Item 2 -->
            <div class="card" style="padding:0; overflow:hidden; border-radius:12px; margin:0;">
                <!-- Thumbnail Area -->
                <div style="aspect-ratio:16/9; background:#1e1e2d; position:relative; background-image:url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&fit=crop'); background-size:cover; background-position:center;">
                    <!-- Checkbox for Public -->
                    <div style="position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.6); padding:6px 10px; border-radius:8px; display:flex; align-items:center; gap:6px; z-index:10;">
                        <input type="checkbox" id="public_check_2" style="width:16px; height:16px; accent-color:var(--primary); cursor:pointer;" onchange="toggleMyWorksPublic(2, this.checked)">
                        <label for="public_check_2" style="font-size:0.8rem; color:white; cursor:pointer;">공개</label>
                    </div>
                </div>
                <!-- Action & Memo Area -->
                <div style="padding:16px; background:var(--secondary);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                        <div>
                            <h4 style="margin-bottom:4px;">별빛 아래 산책</h4>
                            <p style="font-size:0.75rem; color:var(--text-muted);">어쿠스틱 기타, 명조체</p>
                        </div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">2024.03.29</div>
                    </div>
                    <textarea class="input-field" style="width:100%; height:70px; padding:10px; font-size:0.85rem; resize:none; border:1px solid var(--glass-border); border-radius:8px; background:rgba(0,0,0,0.2); color:white;" placeholder="이 작품에 대한 메모나 영감을 작성하세요..." onchange="saveMyWorksMemo(2, this.value)"></textarea>
                </div>
            </div>
        </div>
    `,

    'connection-service': () => `
        <h2 class="section-title">${t('mode_b_title')}</h2>
        <div class="card fade-in">
            <h3 style="margin-bottom:12px;">${t('banner_title')}</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:24px;">${t('banner_desc')}</p>

            <div style="display:grid; grid-template-columns: 1fr; gap:16px;">
                <!-- 사진 꾸미기 -->
                <div class="banner-item" style="background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); border-radius:12px; padding:16px;">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                        <div style="width:40px; height:40px; background:var(--primary); border-radius:8px; display:flex; align-items:center; justify-content:center;">
                            <i data-lucide="edit-3"></i>
                        </div>
                        <h4 style="margin:0;">${t('app_edit')}</h4>
                    </div>
                    <a href="https://vsco.co/" target="_blank" class="btn-secondary" style="display:block; text-align:center; padding:10px; text-decoration:none; font-size:0.85rem;">
                        <i data-lucide="external-link" style="width:14px; height:14px; margin-right:4px; vertical-align:middle;"></i>${t('app_link_desc')} (VSCO)
                    </a>
                </div>

                <!-- 디지털 액자 -->
                <div class="banner-item" style="background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); border-radius:12px; padding:16px;">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                        <div style="width:40px; height:40px; background:var(--accent); border-radius:8px; display:flex; align-items:center; justify-content:center; color:#000;">
                            <i data-lucide="monitor"></i>
                        </div>
                        <h4 style="margin:0;">${t('app_frame')}</h4>
                    </div>
                    <a href="https://auraframes.com/" target="_blank" class="btn-secondary" style="display:block; text-align:center; padding:10px; text-decoration:none; font-size:0.85rem;">
                        <i data-lucide="external-link" style="width:14px; height:14px; margin-right:4px; vertical-align:middle;"></i>${t('app_link_desc')} (Aura Frames)
                    </a>
                </div>

                <!-- 사진 인쇄 -->
                <div class="banner-item" style="background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); border-radius:12px; padding:16px;">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                        <div style="width:40px; height:40px; background:#4CAF50; border-radius:8px; display:flex; align-items:center; justify-content:center; color:white;">
                            <i data-lucide="printer"></i>
                        </div>
                        <h4 style="margin:0;">${t('app_print')}</h4>
                    </div>
                    <a href="https://www.publog.co.kr/" target="_blank" class="btn-secondary" style="display:block; text-align:center; padding:10px; text-decoration:none; font-size:0.85rem;">
                        <i data-lucide="external-link" style="width:14px; height:14px; margin-right:4px; vertical-align:middle;"></i>${t('app_link_desc')} (퍼블로그)
                    </a>
                </div>

                <!-- 음악 만들기 -->
                <div class="banner-item" style="background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); border-radius:12px; padding:16px;">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                        <div style="width:40px; height:40px; background:#E91E63; border-radius:8px; display:flex; align-items:center; justify-content:center; color:white;">
                            <i data-lucide="music"></i>
                        </div>
                        <h4 style="margin:0;">${t('app_music')}</h4>
                    </div>
                    <a href="https://suno.com/" target="_blank" class="btn-secondary" style="display:block; text-align:center; padding:10px; text-decoration:none; font-size:0.85rem;">
                        <i data-lucide="external-link" style="width:14px; height:14px; margin-right:4px; vertical-align:middle;"></i>${t('app_link_desc')} (Suno)
                    </a>
                </div>
            </div>
            
            <button class="btn-secondary" style="width:100%; margin-top:24px;" onclick="state.currentView='studio'; render();">${t('btn_prev') || '이전'}</button>
        </div>
    `,

    'public-gallery': () => `
        <h2 class="section-title">작품 감상하기 <i data-lucide="youtube" style="display:inline-block; vertical-align:middle; width:24px; color:var(--primary);"></i></h2>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">여러 사람들이 창작한 멋진 시와 음악 작품을 감상해보세요.</p>
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div class="card" style="padding:16px; border-radius:12px;">
                <div style="display:flex; align-items:center; margin-bottom:12px;">
                    <div style="width:36px; height:36px; border-radius:50%; background:var(--primary); margin-right:12px; display:flex; align-items:center; justify-content:center;"><i data-lucide="user"></i></div>
                    <div>
                        <div style="font-weight:bold;">행복한 작가</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">2시간 전</div>
                    </div>
                </div>
                <div style="aspect-ratio:16/9; background:#000; border-radius:8px; display:flex; align-items:center; justify-content:center; margin-bottom:12px; position:relative;">
                    <i data-lucide="play-circle" style="width:48px; height:48px; color:rgba(255,255,255,0.8);"></i>
                </div>
                <p style="font-size:0.9rem;">별이 빛나는 밤에 쓴 작은 시 한 편입니다.</p>
            </div>
            <div class="card" style="padding:16px; border-radius:12px;">
                <div style="display:flex; align-items:center; margin-bottom:12px;">
                    <div style="width:36px; height:36px; border-radius:50%; background:var(--accent); color:#000; margin-right:12px; display:flex; align-items:center; justify-content:center;"><i data-lucide="user"></i></div>
                    <div>
                        <div style="font-weight:bold;">봄을기다려</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">하루 전</div>
                    </div>
                </div>
                <div style="aspect-ratio:16/9; background:#000; border-radius:8px; display:flex; align-items:center; justify-content:center; margin-bottom:12px; position:relative;">
                    <i data-lucide="play-circle" style="width:48px; height:48px; color:rgba(255,255,255,0.8);"></i>
                </div>
                <p style="font-size:0.9rem;">어쿠스틱 기타와 함께하는 나의 첫 작품</p>
            </div>
        </div>
        <button class="btn-secondary" style="margin-top:24px; width:100%;" onclick="state.currentView='home'; render();">홈으로 돌아가기</button>
    `,

    'recitation': () => `
        <h2 class="section-title">낭송 연습</h2>
        <div class="card" style="text-align:center;">
            <i data-lucide="mic" style="width:48px; height:48px; margin-bottom:16px; color:var(--accent);"></i>
            <h3 style="margin-bottom:8px;">스튜디오 낭송 모드</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:24px;">나만의 작품을 직접 목소리로 녹음해보세요.</p>
            
            <div style="background:rgba(0,0,0,0.2); padding:20px; border-radius:12px; margin-bottom:24px; border:1px solid var(--primary); text-align:left;">
                <p style="font-size:1.1rem; line-height:1.6; min-height:100px;">
                    ${state.data.poemText ? state.data.poemText.replace(/\n/g, '<br>') : '작성된 시가 없습니다.'}
                </p>
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <button class="btn-primary" style="background:var(--secondary); border:1px solid var(--primary); color:white; padding:16px; display:flex; flex-direction:column; align-items:center; gap:8px;" onclick="alert('녹음을 시작합니다...')">
                    <i data-lucide="mic" style="width:24px;"></i> 녹음하기
                </button>
                <button class="btn-primary" style="background:var(--secondary); border:1px solid var(--accent); color:white; padding:16px; display:flex; flex-direction:column; align-items:center; gap:8px;" onclick="alert('반복 듣기를 시작합니다...')">
                    <i data-lucide="repeat" style="width:24px;"></i> 반복듣기
                </button>
            </div>
            <button class="btn-secondary" style="margin-top:24px; width:100%;" onclick="state.currentView='studio'; render();">내 작품 모두 보기</button>
        </div>
    `,

    'flow-wizard': () => {
        const steps = [t('step_photo') || '사진 선택', t('step_creation') || '시/음악 제작', t('step_share') || '발표/공유'];

        return `
            <div class="step-indicator">
                ${steps.map((s, i) => `<div class="step-dot ${i <= state.currentStep ? 'active' : ''}"></div>`).join('')}
            </div>
            <h2 class="section-title">${steps[state.currentStep]}</h2>
            
            <div id="step-content">
                ${renderStepContent()}
            </div>

            <div style="display:flex; gap:12px; margin-top:30px; justify-content:space-between;">
                <button class="btn-secondary" style="flex:1;" onclick="prevStep()">${t('btn_prev') || '이전'}</button>
                <button class="btn-primary" style="flex:1;" onclick="nextStep()">${state.currentStep === steps.length - 1 ? (t('btn_finish') || '완료') : (t('btn_next') || '다음')}</button>
            </div>
        `;
    },

    studio: () => `
    <h2 class="section-title">${t('studio_title')}</h2>
    <div class="card">
        
        <div style="display:flex; gap:10px; margin-bottom:8px; overflow-x:auto; padding-bottom:10px;">
            <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; font-size:0.85rem;">${t('filter_all')}</button>
            <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; font-size:0.85rem;">${t('filter_text')}</button>
            <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; font-size:0.85rem;">${t('filter_music')}</button>
        </div>
        <p style="font-size:0.75rem; color:var(--text-muted); text-align:right; margin-bottom:20px;">✓ ${t('filter_desc')}</p>

        <div class="revenue-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:12px;">
            <div class="card clickable" style="margin:0; text-align:center;" onclick="state.currentView='connection-service'; render();">
                <i data-lucide="edit-3"></i><br>고급 편집
            </div>
            <div class="card clickable" style="margin:0; text-align:center;" onclick="state.currentView='connection-service'; render();">
                <i data-lucide="layout"></i><br>디지털 프레임
            </div>
            <div class="card clickable" style="margin:0; text-align:center;" onclick="state.currentView='connection-service'; render();">
                <i data-lucide="printer"></i><br>인화 서비스
            </div>
            <div class="card clickable" style="margin:0; text-align:center;" onclick="state.currentView='connection-service'; render();">
                <i data-lucide="music-2"></i><br>음원 출시
            </div>
        </div>
        <button class="btn-primary" style="margin-top:20px;" onclick="startGiftSet()">기프트 세트 제작하기</button>
    </div>
`,

    store: () => `
        <h2 class="section-title">스토어</h2>
        <div class="card">
            <p>준비 중인 서비스입니다.</p>
        </div>
    `,

    admin: () => `
    <h2 class="section-title">이벤트 기획 및 관리</h2>
    
    <div class="card">
        <h4>A-1. 행사 준비 관리</h4>
        <div style="margin-top:10px; font-size:0.85rem; border-top:1px solid var(--glass-border); padding-top:10px;">
            <p><strong>👥 인력 (A-1-1):</strong> 운영 총괄, 현장 스태프, 사진가, 시인, 뮤지션, IT 지원팀</p>
            <p style="margin-top:8px;"><strong>🛠 장비 (A-1-2):</strong> 사무용품, PC, 방송/무대 장치, 주차 및 안내 장비</p>
            <p style="margin-top:8px;"><strong>📢 홍보 (A-1-3):</strong> 웹사이트, SNS, 오프라인 현수막 및 전단지</p>
        </div>
    </div>

    <div class="card">
        <h4>A-2. 예약 현황</h4>
        <div style="margin-top:10px; font-size:0.85rem;">
            <p><strong>참가자 정보:</strong> 이름(닉네임), 그룹명/슬로건, 지원 우선순위</p>
            <p style="margin-top:8px;"><strong>교통 안내:</strong> 오시는 길 및 셔틀 버스 정보</p>
        </div>
        <button class="btn-secondary" style="margin-top:12px;">예약 데이터 내보내기 (.csv)</button>
    </div>

    <!-- DB 읽기 기능 예시 영역 -->
    <div class="card" style="margin-top:20px;">
        <h4>📝 참가자 기록 (Supabase DB Read)</h4>
        <button class="btn-secondary" style="margin: 12px 0;" onclick="loadRecords()">기록 불러오기</button>
        <div id="records-container" style="font-size:0.85rem; display:flex; flex-direction:column; gap:8px;"></div>
    </div>
`
};

window.handlePhotoUpload = function(event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        const grid = document.getElementById('photo-preview-grid');
        grid.innerHTML = `
            <div class="gallery-item selected" onclick="selectPhoto(this)">
                <img src="${url}" alt="Uploaded Photo">
            </div>
        `;
    }
};

function renderStepContent() {
    switch (state.currentStep) {
        case 0: // 사진 선택
            return `
                <p style="margin-bottom:12px; color:var(--text-muted);">${t('step_photo_desc')}</p>
                <div style="display:flex; gap:12px; margin-bottom: 20px;">
                    <button class="btn-secondary" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; padding:20px;" onclick="document.getElementById('file-upload').click()">
                        <i data-lucide="folder" style="width:32px; height:32px;"></i>
                        <span>${t('upload_folder')}</span>
                    </button>
                    <button class="btn-primary" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; padding:20px;" onclick="document.getElementById('camera-upload').click()">
                        <i data-lucide="camera" style="width:32px; height:32px;"></i>
                        <span>${t('take_photo')}</span>
                    </button>
                </div>
                <!-- 실제 동작하도록 파일 인풋 추가 -->
                <input type="file" id="file-upload" accept="image/*" style="display:none;" onchange="handlePhotoUpload(event)">
                <input type="file" id="camera-upload" accept="image/*" capture="environment" style="display:none;" onchange="handlePhotoUpload(event)">
                
                <div class="gallery-grid" id="photo-preview-grid">
                    <!-- 기본 샘플 제공 (또는 업로드된 사진 표시용) -->
                    <div class="gallery-item sele            } else if (state.creationState === 'poetry') {
                const effectClass = state.data.subtitleEffect ? `effect-${state.data.subtitleEffect}` : '';
                return `
                    <div style="display:flex; align-items:center; margin-bottom:12px;">
                        <button class="icon-btn" onclick="goToCreation('tools')" style="background:none; border:none; color:var(--text-muted);"><i data-lucide="arrow-left"></i></button>
                        <h4 style="margin-left:8px;">${t('btn_poetry')}</h4>
                    </div>
                    <textarea id="poem-input" class="card ${effectClass}" style="width:100%; height:120px; border:1px solid var(--primary); ${state.data.poemFont? `font-family:'${state.data.poemFont}', sans-serif;` : ''} ${state.data.poemSize? `font-size:${state.data.poemSize};` : ''} color:${state.data.poemColor||'#ffffff'}; background:rgba(0,0,0,0.2); transition: transform 0.3s ease, font-size 0.3s ease;" placeholder="${t('poem_placeholder')}" oninput="updatePoem(this.value)">${state.data.poemText || ''}</textarea>
                    
                    <h5 style="margin-top:20px; margin-bottom:10px;">${t('poem_adv_edit')}</h5>
                    <div style="display:flex; gap:10px; margin-bottom:20px;">
                        <select onchange="state.data.poemFont=this.value; render();" style="flex:1; padding:8px; border-radius:8px; background:var(--secondary); color:var(--text-main); border:1px solid var(--glass-border);">
                            <option value="">${t('font_sel')}</option>
                            <option value="serif" ${state.data.poemFont==='serif'?'selected':''}>${t('font_serif')}</option>
                            <option value="sans-serif" ${state.data.poemFont==='sans-serif'?'selected':''}>${t('font_sans')}</option>
                            <option value="Nanum Pen Script" ${state.data.poemFont==='Nanum Pen Script'?'selected':''}>${t('font_nanum')}</option>
                            <option value="Jua" ${state.data.poemFont==='Jua'?'selected':''}>${t('font_jua')}</option>
                            <option value="Gowun Dodum" ${state.data.poemFont==='Gowun Dodum'?'selected':''}>${t('font_gowun')}</option>
                            <option value="Song Myung" ${state.data.poemFont==='Song Myung'?'selected':''}>${t('font_song')}</option>
                            <option value="Gaegu" ${state.data.poemFont==='Gaegu'?'selected':''}>${t('font_gaegu')}</option>
                        </select>
                        <select onchange="state.data.poemSize=this.value; render();" style="flex:1; padding:8px; border-radius:8px; background:var(--secondary); color:var(--text-main); border:1px solid var(--glass-border);">
                            <option value="">${t('size_sel')}</option>
                            <option value="1.5rem" ${state.data.poemSize==='1.5rem'?'selected':''}>${t('size_up')}</option>
                            <option value="0.75rem" ${state.data.poemSize==='0.75rem'?'selected':''}>${t('size_down')}</option>
                        </select>
                        <input type="color" onchange="state.data.poemColor=this.value; render();" value="${state.data.poemColor||'#ffffff'}" style="width:40px; height:36px; padding:0; border:none; border-radius:8px; background:transparent;">
                    </div>

                    <h5 style="margin-top:20px; margin-bottom:10px;">${t('effect_sel')}</h5>
                    <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:10px; margin-bottom:20px;">
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'fade' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('fade')">${t('effect_fade')}</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'typewriter' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('typewriter')">${t('effect_type')}</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'slide' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('slide')">${t('effect_slide')}</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'zoom' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('zoom')">${t('effect_zoom')}</button>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:20px;">
                        <button class="btn-secondary" style="padding:12px;" onclick="finishPoetry('tools')">${t('btn_prev')}</button>
                        <button class="btn-secondary" style="padding:12px;" onclick="finishPoetry('later')">${t('btn_write_later')}</button>
                        <button class="btn-primary" style="grid-column: span 2; padding:12px;" onclick="finishPoetry('music')">${t('btn_music')}</button>
                    </div>
                `;'?'selected':''}>\${t('font_song')}</option>
                            <option value="Gaegu" \${state.data.poemFont==='Gaegu'?'selected':''}>\${t('font_gaegu')}</option>
                        </select>
                        <select onchange="state.data.poemSize=this.value; render();" style="flex:1; padding:8px; border-radius:8px; background:var(--secondary); color:var(--text-main); border:1px solid var(--glass-border);">
                            <option value="">\${t('size_sel')}</option>
                            <option value="1.5rem" \${state.data.poemSize==='1.5rem'?'selected':''}>\${t('size_up')}</option>
                            <option value="0.75rem" \${state.data.poemSize==='0.75rem'?'selected':''}>\${t('size_down')}</option>
                        </select>
                        <input type="color" onchange="state.data.poemColor=this.value; render();" value="\${state.data.poemColor||'#ffffff'}" style="width:40px; height:36px; padding:0; border:none; border-radius:8px; background:transparent;">
                    </div>

                    <h5 style="margin-top:20px; margin-bottom:10px;">\${t('effect_sel')}</h5>
                    <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:10px; margin-bottom:20px;">
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; \${state.data.subtitleEffect === 'fade' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('fade')">\${t('effect_fade')}</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; \${state.data.subtitleEffect === 'typewriter' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('typewriter')">\${t('effect_type')}</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; \${state.data.subtitleEffect === 'slide' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('slide')">\${t('effect_slide')}</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; \${state.data.subtitleEffect === 'zoom' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('zoom')">\${t('effect_zoom')}</button>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:20px;">
                        <button class="btn-secondary" style="padding:12px;" onclick="finishPoetry('tools')">\${t('btn_prev')}</button>
                        <button class="btn-secondary" style="padding:12px;" onclick="finishPoetry('later')">\${t('btn_write_later')}</button>
                        <button class="btn-primary" style="grid-column: span 2; padding:12px;" onclick="finishPoetry('music')">\${t('btn_music')}</button>
                    </div>
                \`;
            } else if (state.creationState === 'music') {
                const musicTracksData = {
                    piano: [ '새벽의 이슬', '별빛 아래 산책', '조용한 위로', '비 오는 날의 창가', '잊혀진 기억' ],
                    acoustic: [ '봄바람의 속삭임', '모닥불가의 추억', '너와 걷는 길', '노을 지는 언덕', '따뜻한 오후' ],
                    synth: [ '우주의 끝에서', '자각몽', '도시의 네온사인', '시공간의 경계', '사이버펑크 비트' ],
                    orchestra: [ '영웅의 귀환', '새로운 여정의 시작', '전투의 서막', '별빛의 서사시', '마지막 희망' ]
                };

                const tracksMarkup = state.data.musicStyle && musicTracksData[state.data.musicStyle] ? `
                    <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--glass-border);" class="fade-in">
                        <h5 style="margin-bottom:12px;">음악 트랙 선택</h5>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            ${musicTracksData[state.data.musicStyle].map(track => `
                                <button class="btn-secondary" style="text-align:left; padding:12px 16px; ${state.data.musicTrack === track ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicTrack('${track}')">
                                    <i data-lucide="music" style="width:16px; height:16px; margin-right:8px; vertical-align:middle;"></i>${track}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : '';

                return `
                    <div style="display:flex; align-items:center; margin-bottom:12px;">
                        <button class="icon-btn" onclick="goToCreation('tools')" style="background:none; border:none; color:var(--text-muted);"><i data-lucide="arrow-left"></i></button>
                        <h4 style="margin-left:8px;">음악 만들기</h4>
                    </div>
                    <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:16px;">사진과 시에 어울리는 음악 스타일을 선택하세요.</p>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                        <button class="btn-secondary" style="padding:16px; ${state.data.musicStyle === 'piano' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('piano')">잔잔한 피아노</button>
                        <button class="btn-secondary" style="padding:16px; ${state.data.musicStyle === 'acoustic' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('acoustic')">어쿠스틱 기타</button>
                        <button class="btn-secondary" style="padding:16px; ${state.data.musicStyle === 'synth' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('synth')">몽환적인 신스</button>
                        <button class="btn-secondary" style="padding:16px; ${state.data.musicStyle === 'orchestra' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('orchestra')">웅장한 오케스트라</button>
                    </div>

                    ${tracksMarkup}

                    <div style="display:flex; gap:12px; margin-top:24px;">
                        <button class="btn-secondary" style="flex:1;" onclick="goToCreation('tools')">이전</button>
                        <button class="btn-primary" style="flex:2;" onclick="finishMusic()">음악 선택 완료</button>
                    </div>
                `;
            } else if (state.creationState === 'done') {
                return `
                    <div class="card" style="text-align:center;">
                        <div style="display:flex; justify-content:center; margin-bottom:16px;">
                            <i data-lucide="check-circle" style="width:48px; height:48px; color:var(--primary);"></i>
                        </div>
                        <h4>작품 생성이 완료되었습니다!</h4>
                        <p style="font-size:0.9rem; color:var(--text-muted); margin-top:8px;">당신만의 시와 음악이 준비되었습니다.</p>
                        
                        <div style="display:flex; flex-direction:column; gap:12px; margin-top:24px;">
                            <button class="btn-secondary" style="display:flex; align-items:center; justify-content:center; gap:8px; padding:12px;" onclick="previewWork()">
                                <i data-lucide="play" style="width:18px; height:18px;"></i> 미리보기
                            </button>
                            <div style="display:flex; gap:12px;">
                                <button class="btn-secondary" style="flex:1; display:flex; align-items:center; justify-content:center; gap:8px;" onclick="saveWork()">
                                    <i data-lucide="save" style="width:18px; height:18px;"></i> 저장
                                </button>
                                <button class="btn-primary" style="flex:1; display:flex; align-items:center; justify-content:center; gap:8px;" onclick="shareWork()">
                                    <i data-lucide="share-2" style="width:18px; height:18px;"></i> 공유
                                </button>
                            </div>
                            
                            <div class="divider" style="margin:20px 0;"><span>다음 단계</span></div>
                            <button class="btn-primary" style="background-color:var(--accent); color:black; font-weight:bold; width:100%; display:flex; align-items:center; justify-content:center; gap:8px; padding:12px;" onclick="goToGiftSet()">
                                <i data-lucide="gift" style="width:18px; height:18px;"></i>
                                기프트 세트 제작하기
                            </button>
                        </div>
                    </div>
                `;
            }
        case 2: // 발표 준비/공유
            let subActions = '';
            if (state.data.privacy === 'public') {
                subActions = `
                    <div class="fade-in" style="margin-top:24px; display:flex; gap:12px; justify-content:center;">
                        <button class="btn-primary" style="flex:1; padding:12px; font-size:0.9rem;" onclick="goToPublicGallery()">
                            <i data-lucide="youtube" style="width:18px; margin-right:6px; vertical-align:middle;"></i>작품 감상하기
                        </button>
                        <button class="btn-primary" style="flex:1; padding:12px; background:var(--accent); color:#000; font-size:0.9rem;" onclick="exportToSNS()">
                            <i data-lucide="share-2" style="width:18px; margin-right:6px; vertical-align:middle;"></i>내보내기
                        </button>
                    </div>
                `;
            } else if (state.data.privacy === 'private') {
                subActions = `
                    <div class="fade-in" style="margin-top:24px; display:flex; gap:12px; justify-content:center;">
                        <button class="btn-primary" style="flex:1; padding:12px; font-size:0.9rem;" onclick="saveAndGoToStudio()">
                            <i data-lucide="save" style="width:18px; margin-right:6px; vertical-align:middle;"></i>저장하기
                        </button>
                        <button class="btn-primary" style="flex:1; padding:12px; background:var(--accent); color:#000; font-size:0.9rem;" onclick="startRecitation()">
                            <i data-lucide="mic" style="width:18px; margin-right:6px; vertical-align:middle;"></i>낭송연습
                        </button>
                    </div>
                `;
            }

            return `
                <div class="card" style="text-align:center;">
                    <i data-lucide="presentation" style="width:40px; height:40px; margin-bottom:12px; color:var(--primary);"></i>
                    <h4 style="margin-bottom:8px;">${t('share_title') || '발표 준비'}</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:24px;">${t('share_desc') || '작업하신 멋진 작품을 다른 사람들과 함께 감상하시겠어요?'}</p>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                        <button class="btn-secondary" style="padding:16px; display:flex; flex-direction:column; align-items:center; gap:12px; ${state.data.privacy === 'public' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="setPrivacy('public')">
                            <i data-lucide="globe" style="width:24px; height:24px;"></i>
                            <span style="font-weight:bold;">${t('btn_public') || '공개 (공유)'}</span>
                        </button>
                        <button class="btn-secondary" style="padding:16px; display:flex; flex-direction:column; align-items:center; gap:12px; ${state.data.privacy === 'private' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="setPrivacy('private')">
                            <i data-lucide="lock" style="width:24px; height:24px;"></i>
                            <span style="font-weight:bold;">${t('btn_private') || '비공개 (혼자 보기)'}</span>
                        </button>
                    </div>
                    
                    ${subActions}
                </div>
            `;
        default:
            return `<p>비어있는 단계입니다.</p>`;
    }
}

// Global functions for state management
window.render = function () {
    const main = document.getElementById('main-content');
    const viewFn = views[state.currentView];
    if (viewFn) {
        main.innerHTML = viewFn();
        lucide.createIcons();
    }
    if (window.updateStaticTexts) {
        window.updateStaticTexts();
    }
};

window.navigateToFlow = function (flowType) {
    if (flowType === 'B') {
        state.currentView = 'public-gallery';
        render();
        return;
    }
    state.flow = flowType;
    state.currentStep = 0;
    state.currentView = 'flow-wizard';
    state.creationState = 'initial'; // 초기화
    render();
};

window.nextStep = function () {
    const stepsArray = [t('step_photo'), t('step_creation'), t('step_share')];
    
    // 마지막 단계(발표 준비)에서 공개/비공개 선택 안 했을 경우 알림
    if (state.currentStep === 2 && !state.data.privacy) {
        alert(t('alert_privacy') || '공개 여부를 먼저 선택해주세요.');
        return;
    }

    if (state.currentStep < stepsArray.length - 1) {
        state.currentStep++;
        render();
    } else {
        // 프리미엄 갤러리에 저장 (Supabase DB Write)
        saveToSupabase();
    }
};

window.saveToSupabase = async function(callback) {
    if (!state.user) {
        alert(t('alert_login_required') || '저장하려면 로그인이 필요합니다. 상단 로그인 버튼을 이용해주세요.');
        return;
    }
    
    // DB 테이블 'records'에 기록 저장 시도 (미리 생성 필요)
    try {
        const { error } = await supabase.from('records').insert([
            {
                user_id: state.user.id,
                email: state.user.email,
                poem_text: state.data.poemText,
                music_style: state.data.musicStyle,
                subtitle_effect: state.data.subtitleEffect,
                flow_type: state.flow,
                privacy: state.data.privacy
            }
        ]);
        
        if (error) throw error;

        alert('작성하신 내용은 보관함에 안전하게 저장되었습니다.');
        
        if (typeof callback === 'function') {
            callback();
        } else {
            state.currentView = 'home';
            state.currentStep = 0;
            render();
        }
    } catch (e) {
        console.error('DB 저장 에러:', e);
        alert('저장 중 오류가 발생했습니다: ' + e.message);
    }
};

window.goToPublicGallery = function() {
    window.saveToSupabase(() => {
        state.currentView = 'public-gallery';
        render();
    });
};

window.exportToSNS = function() {
    window.saveToSupabase(() => {
        alert('내보내기 옵션 모달 활성화 : YouTube, Facebook 등 다양한 SNS로 뷰를 공유합니다.');
    });
};

window.saveAndGoToStudio = function() {
    window.saveToSupabase(() => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        const studioNav = document.querySelector('.nav-item[data-view="studio"]');
        if(studioNav) studioNav.classList.add('active');
        state.currentView = 'studio';
        render();
    });
};

window.startRecitation = function() {
    window.saveToSupabase(() => {
        state.currentView = 'recitation';
        render();
    });
};

window.prevStep = function () {
    if (state.currentStep > 0) {
        state.currentStep--;
    } else {
        state.currentView = 'home';
    }
    render();
};

// --- Poetry & Music Creation Event Handlers ---
window.startCreation = function() {
    state.creationState = 'tools';
    render();
};

window.goToCreation = function(type) {
    state.creationState = type;
    render();
};

window.updatePoem = function(val) {
    state.data.poemText = val;
};

window.selectEffect = function(effect) {
    state.data.subtitleEffect = effect;
    render();
};

window.finishPoetry = function(action) {
    const poemInput = document.getElementById('poem-input');
    if (poemInput) state.data.poemText = poemInput.value;
    
    if (action === 'tools' || action === 'later') {
        goToCreation('tools');
    } else if (action === 'music') {
        goToCreation('music');
    } else {
        checkCreationDone();
    }
};

window.selectMusicStyle = function(style) {
    if (state.data.musicStyle !== style) {
        state.data.musicTrack = '';
    }
    state.data.musicStyle = style;
    render();
};

window.selectMusicTrack = function(track) {
    state.data.musicTrack = track;
    render();
};

window.setPrivacy = function(type) {
    state.data.privacy = type;
    render();
};

window.generateResponse = function() {
    checkCreationDone();
};

window.finishMusic = function() {
    checkCreationDone();
};

window.checkCreationDone = function() {
    const hasPoem = state.data.poemText && state.data.poemText.trim() !== '';
    const hasMusic = state.data.musicStyle && state.data.musicStyle !== '' && state.data.musicTrack && state.data.musicTrack !== '';
    
    if (hasPoem && hasMusic) {
        state.creationState = 'done';
    } else {
        state.creationState = 'tools';
        if (!hasPoem) alert('시 작성을 완료해주세요.');
        else if (!state.data.musicStyle) alert('음악 스타일을 선택해주세요.');
        else if (!state.data.musicTrack) alert('세부 음악 트랙을 선택해주세요.');
    }
    render();
};

window.previewWork = function() {
    const poemSafe = state.data.poemText ? state.data.poemText.replace(/\\n/g, ' ') : '';
    alert(`[작품 미리보기]\n자막 효과: ${state.data.subtitleEffect || '기본'}\n배경 음악: ${state.data.musicStyle}\n\n내용:\n${poemSafe}`);
};

window.saveWork = function() {
    alert('작품이 보관함에 저장되었습니다.');
};

window.shareWork = function() {
    alert('작품 공유 링크가 복사되었습니다!');
};

// 기프트 세트 제작 연결
window.goToGiftSet = function() {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const studioNav = document.querySelector('.nav-item[data-view="studio"]');
    if(studioNav) studioNav.classList.add('active');
    
    state.currentView = 'studio';
    render();
};

window.startGiftSet = function() {
    alert('기프트 세트 제작 프로세스를 시작합니다!\\n사진, 시, 음악이 결합된 맞춤 패키지를 준비하세요.');
};

// Event Listeners for Bottom Nav
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        state.currentView = item.dataset.view;
        render();
    });
});

document.getElementById('admin-toggle').addEventListener('click', () => {
    state.currentView = 'admin';
    render();
});

// Gallery selection handler
window.selectPhoto = function (el) {
    document.querySelectorAll('.gallery-item').forEach(item => item.classList.remove('selected'));
    el.classList.add('selected');
};

window.toggleMyWorksPublic = function(id, isPublic) {
    if (isPublic) {
        alert('이 작품이 공개 갤러리에 노출됩니다.');
    } else {
        alert('이 작품이 비공개로 전환되었습니다.');
    }
};

window.saveMyWorksMemo = function(id, text) {
    console.log('Memo saved for ' + id + ':', text);
    alert('메모가 저장되었습니다.');
};

// --- Supabase DB Read Example ---
window.loadRecords = async function() {
    const container = document.getElementById('records-container');
    if (!container) return;
    
    container.innerHTML = '로딩 중...';
    
    try {
        // records 테이블에서 데이터 조회
        const { data, error } = await supabase.from('records').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        
        if (!data || data.length === 0) {
            container.innerHTML = '저장된 기록이 없습니다.';
            return;
        }
        
        container.innerHTML = data.map(item => `
            <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                <strong>작성자:</strong> ${item.email || '익명'} <br>
                <strong>시(Poem):</strong> ${item.poem_text || item.intent || '없음'} <br>
                <strong>음악:</strong> ${item.music_style || '없음'} <br>
                <strong>효과:</strong> ${item.subtitle_effect || '기본'}
            </div>
        `).join('');
    } catch(e) {
        container.innerHTML = '에러 발생: ' + e.message;
        console.error('DB 조회 에러:', e);
    }
};

// --- Auth Initialization ---
// 사용자의 로그인 상태를 감지하여 UI를 업데이트합니다.
supabase.auth.onAuthStateChange((event, session) => {
    state.user = session?.user || null;
    const loginBtn = document.getElementById('login-btn');
    const authStatus = document.getElementById('auth-status');
    
    const loginModal = document.getElementById('login-modal');
    
    if (state.user && loginModal) {
        loginModal.classList.add('hidden');
    }
    
    if (loginBtn && authStatus) {
        if (state.user) {
            authStatus.textContent = state.user.email + ' 님';
            loginBtn.dataset.i18n = 'logout';
            loginBtn.textContent = i18n[state.locale]['logout'] || '로그아웃';
            loginBtn.onclick = async () => await supabase.auth.signOut();
        } else {
            authStatus.textContent = '';
            loginBtn.dataset.i18n = 'login';
            loginBtn.textContent = i18n[state.locale]['login'] || '로그인';
            loginBtn.onclick = () => {
                const loginModal = document.getElementById('login-modal');
                if (loginModal) loginModal.classList.remove('hidden');
            };
        }
    }
});

// Modal Events & Login Actions
setTimeout(() => {
    const loginModal = document.getElementById('login-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const facebookLoginBtn = document.getElementById('facebook-login-btn');
    const kakaoLoginBtn = document.getElementById('kakao-login-btn');
    const emailLoginBtn = document.getElementById('email-login-btn');
    const emailInput = document.getElementById('email-input');

    if (closeModalBtn && loginModal) {
        closeModalBtn.onclick = () => loginModal.classList.add('hidden');
    }

    if (googleLoginBtn) {
        googleLoginBtn.onclick = async () => {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
            if (error) alert('Google 로그인 에러: ' + error.message);
        };
    }

    if (facebookLoginBtn) {
        facebookLoginBtn.onclick = async () => {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' });
            if (error) alert('Facebook 로그인 에러: ' + error.message);
        };
    }
    
    if (kakaoLoginBtn) {
        kakaoLoginBtn.onclick = async () => {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'kakao' });
            if (error) alert('Kakao 로그인 에러: ' + error.message);
        };
    }

    if (emailLoginBtn && emailInput) {
        emailLoginBtn.onclick = async () => {
            const email = emailInput.value.trim();
            if (!email) {
                alert('이메일 주소를 입력해주세요.');
                return;
            }
            emailLoginBtn.textContent = '전송 중...';
            // Magic link (OTP) 전송
            const { error } = await supabase.auth.signInWithOtp({ 
                email,
                options: { emailRedirectTo: window.location.origin }
            });
            
            if (error) {
                alert('이메일 로그인 에러: ' + error.message);
            } else {
                alert('입력하신 이메일로 로그인 링크가 전송되었습니다. 이메일함을 확인해주세요!');
                if (loginModal) loginModal.classList.add('hidden');
            }
            emailLoginBtn.textContent = '이메일로 계속하기';
        };
    }
}, 100);

// Language Selection Handling
const langSelector = document.getElementById('lang-selector');
if (langSelector) {
    langSelector.addEventListener('change', (e) => {
        state.locale = e.target.value;
        render(); // Re-render to update the view
    });
}

// Initial Render
render();
