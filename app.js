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
        musicStyle: ''
    },
    creationState: 'initial'
};

const i18n = {
    ko: {
        login: '로그인', logout: '로그아웃',
        nav_home: '홈', nav_flow: '촬영/조회', nav_studio: '스튜디오', nav_store: '스토어',
        modal_title: '회원가입 / 로그인', modal_email_desc: '이메일 인증을 통해 간편하게 가입 및 로그인하세요.', modal_email_btn: '이메일로 계속하기',
        home_greetings: '안녕하세요, 작가님.',
        home_subtitle: '오늘의 순간을 특별한 기록으로 남겨보세요.',
        home_start: '작업 시작하기',
        flow_a_title: 'A. 방금 촬영한 사진으로',
        flow_a_desc: '방금 찍은 소중한 순간들을 바로 공유하고 이야기를 담아보세요.',
        flow_b_title: 'B. 기존 사진 찾아보기',
        flow_b_desc: '보관함 속 잊고 있던 추억을 꺼내어 새로운 의미를 부여합니다.',
        home_news: '최근 소식'
    },
    en: {
        login: 'Login', logout: 'Logout',
        nav_home: 'Home', nav_flow: 'Capture/View', nav_studio: 'Studio', nav_store: 'Store',
        modal_title: 'Sign Up / Login', modal_email_desc: 'Easily sign up and login via email verification.', modal_email_btn: 'Continue with Email',
        home_greetings: 'Hello, Creator.',
        home_subtitle: 'Make today\'s moments a special record.',
        home_start: 'Start Working',
        flow_a_title: 'A. With just taken photos',
        flow_a_desc: 'Share the precious moments you just captured and tell a story.',
        flow_b_title: 'B. Browse existing photos',
        flow_b_desc: 'Bring out forgotten memories from the archive and give them new meaning.',
        home_news: 'Recent News'
    },
    zh: {
        login: '登录', logout: '登出',
        nav_home: '首页', nav_flow: '拍摄/查看', nav_studio: '工作室', nav_store: '商店',
        modal_title: '注册 / 登录', modal_email_desc: '通过电子邮件验证轻松注册和登录。', modal_email_btn: '使用电子邮件继续',
        home_greetings: '你好，创作者。',
        home_subtitle: '把今天的瞬间变成特别的记录。',
        home_start: '开始工作',
        flow_a_title: 'A. 使用刚刚拍摄的照片',
        flow_a_desc: '分享刚刚捕捉的珍贵瞬间并讲述背后的故事。',
        flow_b_title: 'B. 浏览现有照片',
        flow_b_desc: '从档案中唤醒被遗忘的记忆并赋予新意。',
        home_news: '最新消息'
    },
    es: {
        login: 'Iniciar sesión', logout: 'Cerrar sesión',
        nav_home: 'Inicio', nav_flow: 'Captura/Vista', nav_studio: 'Estudio', nav_store: 'Tienda',
        modal_title: 'Regístrate / Iniciar sesión', modal_email_desc: 'Regístrate e inicia sesión fácilmente mediante verificación por correo.', modal_email_btn: 'Continuar con correo',
        home_greetings: 'Hola, Creador.',
        home_subtitle: 'Haz de los momentos de hoy un registro especial.',
        home_start: 'Comenzar a trabajar',
        flow_a_title: 'A. Con fotos recién tomadas',
        flow_a_desc: 'Comparte los momentos preciosos que acabas de capturar y cuenta una historia.',
        flow_b_title: 'B. Explorar fotos existentes',
        flow_b_desc: 'Saca a la luz recuerdos olvidados del archivo y dales un nuevo significado.',
        home_news: 'Noticias recientes'
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
                    <h4>Shelley 리트리트 이벤트</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted);">지금 바로 참여 신청을 확인하세요.</p>
                </div>
            </div>
        </div>
    `,

    'flow-selection': () => `
        <h2 class="section-title">모드 선택</h2>
        <div class="card" onclick="navigateToFlow('A')">
            <h3>촬영 후 기록 (Flow A)</h3>
            <ul style="margin-left: 1.2rem; margin-top: 8px; font-size: 0.85rem; color: var(--text-muted);">
                <li>공유 사진 결정</li>
                <li>촬영 의도 설명</li>
                <li>음악/시 결합</li>
            </ul>
            <button class="btn-primary" style="margin-top:16px;">시작하기</button>
        </div>
        <div class="card" onclick="navigateToFlow('B')">
            <h3>기존 사진 조회 (Flow B)</h3>
            <ul style="margin-left: 1.2rem; margin-top: 8px; font-size: 0.85rem; color: var(--text-muted);">
                <li>사진 아카이브 검색</li>
                <li>선택 의도 기록</li>
                <li>프리젠테이션 준비</li>
            </ul>
            <button class="btn-secondary" style="margin-top:16px;">시작하기</button>
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
                <button class="btn-secondary" style="flex:1;" onclick="prevStep()">이전</button>
                <button class="btn-primary" style="flex:1;" onclick="nextStep()">${state.currentStep === steps.length - 1 ? '완료' : '다음'}</button>
            </div>
        `;
    },

    studio: () => `
    <h2 class="section-title">스튜디오 & 수익화</h2>
    <div class="card">
        <h3>디지털 자산 관리 (Photo + Poem + Music)</h3>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">사진에 감성을 더해 가치를 창출하세요.</p>
        
        <div style="display:flex; gap:10px; margin-bottom:20px; overflow-x:auto; padding-bottom:10px;">
            <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; font-size:0.85rem;">날짜순</button>
            <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; font-size:0.85rem;">인물별</button>
            <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; font-size:0.85rem;">위치별</button>
        </div>

        <div class="revenue-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:12px;">
            <div class="card" style="margin:0; text-align:center;">
                <i data-lucide="edit-3"></i><br>고급 편집
            </div>
            <div class="card" style="margin:0; text-align:center;">
                <i data-lucide="layout"></i><br>디지털 프레임
            </div>
            <div class="card" style="margin:0; text-align:center;">
                <i data-lucide="printer"></i><br>인화 서비스
            </div>
            <div class="card" style="margin:0; text-align:center;">
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
                    <div class="gallery-item selected" onclick="selectPhoto(this)"><img src="sample_photo_1.png" alt="Nature" onerror="this.src='https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400'"></div>
                    <div class="gallery-item" onclick="selectPhoto(this)"><img src="sample_photo_2.png" alt="Camera" onerror="this.src='https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400'"></div>
                </div>
            `;
        case 1: // 시/음악 제작
            if (state.creationState === 'initial') {
                return `
                    <div class="card artwork-gen" style="border: 2px dashed var(--primary); text-align:center; padding:30px 20px;">
                        <div style="display:flex; justify-content:center; gap:20px; margin-bottom:20px;">
                            <i data-lucide="pen-tool" style="width:32px; height:32px; color:var(--accent);"></i>
                            <i data-lucide="music" style="width:32px; height:32px; color:var(--primary);"></i>
                        </div>
                        <h4>나만의 시와 음악 만들기</h4>
                        <p style="font-size:0.8rem; margin-top:8px; color:var(--text-muted);">사진의 감성을 '시'와 '음악'으로 승화시킵니다.</p>
                        <button class="btn-primary" style="margin-top:20px; width:auto; padding:12px 24px;" onclick="startCreation()">작품 생성 시작하기</button>
                    </div>
                `;
            } else if (state.creationState === 'tools') {
               return `
                    <h4 style="text-align:center; margin-bottom:20px;">무엇을 먼저 만드시겠어요?</h4>
                    <div style="display:flex; gap:12px; justify-content:center;">
                        <button class="card clickable" style="flex:1; padding:20px; display:flex; flex-direction:column; align-items:center; gap:12px; margin:0; background:var(--secondary);" onclick="goToCreation('poetry')">
                            <i data-lucide="pen-tool" style="width:32px; height:32px; color:var(--accent);"></i>
                            <span style="color:var(--text); font-weight:bold; text-shadow:0 1px 2px rgba(0,0,0,0.5);">'시' 쓰기</span>
                        </button>
                        <button class="card clickable" style="flex:1; padding:20px; display:flex; flex-direction:column; align-items:center; gap:12px; margin:0; background:var(--secondary);" onclick="goToCreation('music')">
                            <i data-lucide="music" style="width:32px; height:32px; color:var(--primary);"></i>
                            <span style="color:var(--text); font-weight:bold; text-shadow:0 1px 2px rgba(0,0,0,0.5);">음악 만들기</span>
                        </button>
                    </div>
                `;
            } else if (state.creationState === 'poetry') {
                return `
                    <div style="display:flex; align-items:center; margin-bottom:12px;">
                        <button class="icon-btn" onclick="goToCreation('tools')" style="background:none; border:none; color:var(--text-muted);"><i data-lucide="arrow-left"></i></button>
                        <h4 style="margin-left:8px;">'시' 쓰기 공간</h4>
                    </div>
                    <textarea id="poem-input" class="card" style="width:100%; height:120px; border:1px solid var(--primary); ${state.data.poemFont? `font-family:${state.data.poemFont};` : ''} ${state.data.poemSize? `font-size:${state.data.poemSize};` : ''} color:${state.data.poemColor||'#ffffff'}; background:rgba(0,0,0,0.2);" placeholder="당신의 감성을 시로 표현해보세요..." oninput="updatePoem(this.value)">${state.data.poemText || ''}</textarea>
                    
                    <h5 style="margin-top:20px; margin-bottom:10px;">고급 편집 (글자체/크기/색상)</h5>
                    <div style="display:flex; gap:10px; margin-bottom:20px;">
                        <select onchange="state.data.poemFont=this.value; render();" style="flex:1; padding:8px; border-radius:8px; background:var(--secondary); color:var(--text); border:1px solid var(--glass-border);">
                            <option value="">글꼴 선택</option>
                            <option value="serif" ${state.data.poemFont==='serif'?'selected':''}>명조체</option>
                            <option value="sans-serif" ${state.data.poemFont==='sans-serif'?'selected':''}>고딕체</option>
                        </select>
                        <select onchange="state.data.poemSize=this.value; render();" style="flex:1; padding:8px; border-radius:8px; background:var(--secondary); color:var(--text); border:1px solid var(--glass-border);">
                            <option value="">글자 크기</option>
                            <option value="1.2rem" ${state.data.poemSize==='1.2rem'?'selected':''}>크게</option>
                            <option value="0.8rem" ${state.data.poemSize==='0.8rem'?'selected':''}>작게</option>
                        </select>
                        <input type="color" onchange="state.data.poemColor=this.value; render();" value="${state.data.poemColor||'#ffffff'}" style="width:40px; height:36px; padding:0; border:none; border-radius:8px; background:transparent;">
                    </div>

                    <h5 style="margin-top:20px; margin-bottom:10px;">자막 효과 선택</h5>
                    <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:10px; margin-bottom:20px;">
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'fade' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('fade')">페이드</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'typewriter' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('typewriter')">타자방식</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'slide' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('slide')">슬라이드</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'zoom' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('zoom')">줌인</button>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:20px;">
                        <button class="btn-secondary" style="padding:12px;" onclick="finishPoetry('tools')">이전</button>
                        <button class="btn-secondary" style="padding:12px;" onclick="finishPoetry('later')">시 나중에 쓰기</button>
                        <button class="btn-primary" style="grid-column: span 2; padding:12px;" onclick="finishPoetry('music')">음악 만들기</button>
                    </div>
                `;
            } else if (state.creationState === 'music') {
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
            return `
                <div class="card" style="text-align:center;">
                    <i data-lucide="presentation" style="width:40px; height:40px; margin-bottom:12px;"></i>
                    <h4>발표회 진행 및 공유</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">지금 이 순간의 감성을 대중 앞에 선보입니다.</p>
                    <div style="margin-top:20px; padding:12px; background:var(--secondary); border-radius:12px;">
                        <p>📍 발표 장소: 메인 스테이지</p>
                        <p>⏰ 시간: 14:00 - 15:30</p>
                    </div>
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
    state.flow = flowType;
    state.currentStep = 0;
    state.currentView = 'flow-wizard';
    state.creationState = 'initial'; // 초기화
    render();
};

window.nextStep = function () {
    const stepsArray = [t('step_photo'), t('step_creation'), t('step_share')];
    if (state.currentStep < stepsArray.length - 1) {
        state.currentStep++;
        render();
    } else {
        // 프리미엄 갤러리에 저장 (Supabase DB Write)
        saveToSupabase();
    }
};

window.saveToSupabase = async function() {
    if (!state.user) {
        alert('저장하려면 로그인이 필요합니다. 상단 로그인 버튼을 이용해주세요.');
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
                flow_type: state.flow
            }
        ]);
        
        if (error) throw error;

        alert('축하합니다! 모든 과정이 완료되었습니다.\n작성하신 내용은 프리미엄 갤러리에 안전하게 저장되었습니다.');
        state.currentView = 'home';
        state.currentStep = 0;
        render();
    } catch (e) {
        console.error('DB 저장 에러:', e);
        alert('저장 중 오류가 발생했습니다: ' + e.message);
    }
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
    state.data.musicStyle = style;
    render();
};

window.finishMusic = function() {
    checkCreationDone();
};

window.checkCreationDone = function() {
    const hasPoem = state.data.poemText && state.data.poemText.trim() !== '';
    const hasMusic = state.data.musicStyle && state.data.musicStyle !== '';
    
    if (hasPoem && hasMusic) {
        state.creationState = 'done';
    } else {
        state.creationState = 'tools';
        if (!hasPoem) alert('시 작성을 완료해주세요.');
        else if (!hasMusic) alert('음악 스타일을 선택해주세요.');
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
