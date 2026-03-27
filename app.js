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

const views = {
    home: () => `
        <div class="hero-card card">
            <h1>안녕하세요, 작가님.</h1>
            <p>오늘의 순간을 특별한 기록으로 남겨보세요.</p>
        </div>
        
        <h2 class="section-title">작업 시작하기</h2>
        <div class="card clickable" onclick="navigateToFlow('A')">
            <div class="card-icon"><i data-lucide="camera-off"></i></div>
            <h3>A. 방금 촬영한 사진으로</h3>
            <p>방금 찍은 소중한 순간들을 바로 공유하고 이야기를 담아보세요.</p>
        </div>

        <div class="card clickable" onclick="navigateToFlow('B')">
            <div class="card-icon"><i data-lucide="image"></i></div>
            <h3>B. 기존 사진 찾아보기</h3>
            <p>보관함 속 잊고 있던 추억을 꺼내어 새로운 의미를 부여합니다.</p>
        </div>

        <h2 class="section-title">최근 소식</h2>
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
        const steps = state.flow === 'A' ?
            ['사진 선택', '의도 설명', '이야기 공유', '의견 나눔', '시/음악 제작', '발표 준비'] :
            ['사진 아카이브', '선택 이유', '기억 더듬기', '공감 토크', '예술적 변환', '최종 공유'];

        return `
            <div class="step-indicator">
                ${steps.map((s, i) => `<div class="step-dot ${i <= state.currentStep ? 'active' : ''}"></div>`).join('')}
            </div>
            <h2 class="section-title">${steps[state.currentStep]}</h2>
            
            <div id="step-content">
                ${renderStepContent()}
            </div>

            <div style="display:flex; gap:12px; margin-top:30px;">
                ${state.currentStep > 0 ? `<button class="btn-secondary" onclick="prevStep()">이전</button>` : ''}
                <button class="btn-primary" onclick="nextStep()">${state.currentStep === steps.length - 1 ? '완료' : '다음'}</button>
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

function renderStepContent() {
    const isFlowA = state.flow === 'A';

    switch (state.currentStep) {
        case 0: // 사진 선택
            return `
                <p style="margin-bottom:12px; color:var(--text-muted);">${isFlowA ? '방금 찍은 사진 중 공유할 사진을 골라보세요.' : '보관된 사진 중 다시 보고 싶은 사진을 선택하세요.'}</p>
                <div class="gallery-grid">
                    <div class="gallery-item selected" onclick="selectPhoto(this)"><img src="sample_photo_1.png" alt="Nature"></div>
                    <div class="gallery-item" onclick="selectPhoto(this)"><img src="sample_photo_2.png" alt="Camera"></div>
                    <div class="gallery-item" onclick="selectPhoto(this)"><img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400" alt="Lake"></div>
                    <div class="gallery-item" onclick="selectPhoto(this)"><img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400" alt="Forest"></div>
                </div>
            `;
        case 1: // 의도 설명
            return `
                <p style="margin-bottom:12px; color:var(--text-muted);">${isFlowA ? '이 사진을 찍게 된 특별한 의도가 무엇인가요?' : '이 사진을 다시 선택하게 된 의도를 설명해주세요.'}</p>
                <textarea id="intent-input" class="card" style="width:100%; height:120px; color:white; border:1px solid var(--primary);" placeholder="의도를 입력하세요...">${state.data.intent}</textarea>
            `;
        case 2: // 이야기 공유
            return `
                <p style="margin-bottom:12px; color:var(--text-muted);">${isFlowA ? '함께 나누고 싶은 이야기가 있나요?' : '이 사진을 보며 떠오르는 추억이나 이야기가 있나요?'}</p>
                <textarea id="story-input" class="card" style="width:100%; height:120px; color:white;" placeholder="이야기를 적어보세요...">${state.data.story}</textarea>
            `;
        case 3: // 의견 나눔/공감
            return `
                <p style="margin-bottom:12px; color:var(--text-muted);">함께 공유하고 공감할 수 있는 의견을 남겨주세요.</p>
                <div class="card" style="background:rgba(255,255,255,0.05);">
                    <p style="font-size:0.9rem; font-style:italic;">"때로는 한 장의 사진이 수만 마디 말보다 큰 울림을 줍니다."</p>
                </div>
                <textarea id="resonance-input" class="card" style="width:100%; height:80px; color:white; margin-top:12px;" placeholder="공감되는 의견을 남겨주세요..."></textarea>
            `;
        case 4: // 시/음악 제작
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
                        <button class="card clickable" style="flex:1; padding:20px; display:flex; flex-direction:column; align-items:center; gap:12px; margin:0;" onclick="goToCreation('poetry')">
                            <i data-lucide="pen-tool" style="width:32px; height:32px; color:var(--accent);"></i>
                            <span>'시' 쓰기</span>
                        </button>
                        <button class="card clickable" style="flex:1; padding:20px; display:flex; flex-direction:column; align-items:center; gap:12px; margin:0;" onclick="goToCreation('music')">
                            <i data-lucide="music" style="width:32px; height:32px; color:var(--primary);"></i>
                            <span>음악 만들기</span>
                        </button>
                    </div>
                    ${state.data.poemText || state.data.musicStyle ? `
                        <div style="text-align:center; margin-top:20px;">
                            <button class="btn-primary" onclick="checkCreationDone()">완료 확인하기</button>
                        </div>
                    ` : ''}
                `;
            } else if (state.creationState === 'poetry') {
                return `
                    <div style="display:flex; align-items:center; margin-bottom:12px;">
                        <button class="icon-btn" onclick="goToCreation('tools')" style="background:none; border:none; color:var(--text-muted);"><i data-lucide="arrow-left"></i></button>
                        <h4 style="margin-left:8px;">'시' 쓰기 공간</h4>
                    </div>
                    <textarea id="poem-input" class="card" style="width:100%; height:120px; color:white; border:1px solid var(--primary);" placeholder="당신의 감성을 시로 표현해보세요..." onchange="updatePoem(this.value)">${state.data.poemText}</textarea>
                    
                    <h5 style="margin-top:20px; margin-bottom:10px;">자막 효과 선택</h5>
                    <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:10px; margin-bottom:20px;">
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'fade' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('fade')">페이드</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'typewriter' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('typewriter')">타자방식</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'slide' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('slide')">슬라이드</button>
                        <button class="btn-secondary" style="width:auto; padding:8px 16px; margin:0; ${state.data.subtitleEffect === 'zoom' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('zoom')">줌인</button>
                    </div>

                    <div style="display:flex; gap:12px; justify-content:center; margin-top:20px;">
                        <button class="btn-primary" onclick="finishPoetry()">시 작성 완료</button>
                    </div>
                `;
            } else if (state.creationState === 'music') {
                return `
                    <div style="display:flex; align-items:center; margin-bottom:12px;">
                        <button class="icon-btn" onclick="goToCreation('tools')" style="background:none; border:none; color:var(--text-muted);"><i data-lucide="arrow-left"></i></button>
                        <h4 style="margin-left:8px;">음악 작곡 과정</h4>
                    </div>
                    <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:16px;">사진과 시에 어울리는 음악 스타일을 선택하세요.</p>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                        <button class="btn-secondary" style="padding:16px; ${state.data.musicStyle === 'piano' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('piano')">잔잔한 피아노</button>
                        <button class="btn-secondary" style="padding:16px; ${state.data.musicStyle === 'acoustic' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('acoustic')">어쿠스틱 기타</button>
                        <button class="btn-secondary" style="padding:16px; ${state.data.musicStyle === 'synth' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('synth')">몽환적인 신스</button>
                        <button class="btn-secondary" style="padding:16px; ${state.data.musicStyle === 'orchestra' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('orchestra')">웅장한 오케스트라</button>
                    </div>

                    <div style="display:flex; gap:12px; justify-content:center; margin-top:24px;">
                        <button class="btn-primary" onclick="finishMusic()">음악 생성 완료</button>
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
        case 5: // 발표
            return `
                <div class="card" style="text-align:center;">
                    <i data-lucide="presentation" style="width:40px; height:40px; margin-bottom:12px;"></i>
                    <h4>발표회 진행</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">지금 이 순간의 감성을 대중 앞에 선보입니다.</p>
                    <div style="margin-top:20px; padding:12px; background:var(--secondary); border-radius:12px;">
                        <p>📍 발표 장소: 메인 스테이지</p>
                        <p>⏰ 시간: 14:00 - 15:30</p>
                    </div>
                </div>
            `;
        case 6: // 업로더 의견
            return `
                <h4 style="margin-bottom:12px;">원본 제작자의 생각</h4>
                <div class="card" style="border-left:4px solid var(--primary);">
                    <p style="font-size:0.9rem;">"이 사진은 작년에 우연히 발견한 길목에서 촬영되었습니다. 그때의 고요함을 전달하고 싶었어요."</p>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin-top:8px;">- 익명의 작가</p>
                </div>
                <p style="font-size:0.85rem; margin-top:12px;">제작자의 의도를 다시 한 번 생각해보는 시간입니다.</p>
            `;
        case 7: // 공감 포인트 공유
            return `
                <h4 style="margin-bottom:12px;">종합 의견 및 공감</h4>
                <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:16px;">'사진'과 '시/음악'에 대해 우리 모두가 나눈 공감 리스트입니다.</p>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div class="card" style="padding:12px; margin:0;">✨ 고요함 속에 숨겨진 힘</div>
                    <div class="card" style="padding:12px; margin:0;">🎵 선율로 전하는 위로</div>
                    <div class="card" style="padding:12px; margin:0;">📸 찰나의 소중함</div>
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
};

window.navigateToFlow = function (flowType) {
    state.flow = flowType;
    state.currentStep = 0;
    state.currentView = 'flow-wizard';
    state.creationState = 'initial'; // 초기화
    render();
};

window.nextStep = function () {
    // Save current step data
    const intent = document.getElementById('intent-input');
    const story = document.getElementById('story-input');
    const resonance = document.getElementById('resonance-input');

    if (intent) state.data.intent = intent.value;
    if (story) state.data.story = story.value;
    if (resonance) state.data.resonance = resonance.value;

    const steps = 8;
    if (state.currentStep < steps - 1) {
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
                intent: state.data.intent,
                story: state.data.story,
                resonance: state.data.resonance,
                flow_type: state.flow
            }
        ]);
        
        if (error) throw error;

        alert('축하합니다! 모든 과정이 완료되었습니다.\\n작성하신 내용은 프리미엄 갤러리에 안전하게 저장되었습니다.');
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
        render();
    }
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

window.finishPoetry = function() {
    const poemInput = document.getElementById('poem-input');
    if (poemInput) state.data.poemText = poemInput.value;
    checkCreationDone();
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
                <strong>의도:</strong> ${item.intent || '없음'} <br>
                <strong>이야기:</strong> ${item.story || '없음'}
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
            loginBtn.textContent = '로그아웃';
            loginBtn.onclick = async () => await supabase.auth.signOut();
        } else {
            authStatus.textContent = '';
            loginBtn.textContent = '로그인';
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

// Initial Render
render();
