/**
 * Shelley Event - App Logic
 */

const state = {
    currentView: 'home',
    flow: null, // 'A' or 'B'
    currentStep: 0,
    selectedPhotos: [],
    data: {
        intent: '',
        story: '',
        resonance: '',
        poemMusic: null
    }
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
        <button class="btn-primary" style="margin-top:20px;">기프트 세트 제작하기</button>
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
            return `
                <div class="card artwork-gen" style="border: 2px dashed var(--primary); text-align:center; padding:30px 20px;">
                    <div style="display:flex; justify-content:center; gap:20px; margin-bottom:20px;">
                        <i data-lucide="pen-tool" style="width:32px; height:32px; color:var(--accent);"></i>
                        <i data-lucide="music" style="width:32px; height:32px; color:var(--primary);"></i>
                    </div>
                    <h4>나만의 시와 음악 만들기</h4>
                    <p style="font-size:0.8rem; margin-top:8px; color:var(--text-muted);">사진의 감성을 '시'와 '음악'으로 승화시킵니다.</p>
                    <button class="btn-primary" style="margin-top:20px; width:auto; padding:12px 24px;">작품 생성 및 공유하기</button>
                    ${state.data.poemMusic ? '<p style="margin-top:10px; color:var(--accent);">✓ 작품이 생성되었습니다.</p>' : ''}
                </div>
            `;
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
        alert('축하합니다! 모든 과정이 완료되었습니다.\n작성하신 내용은 프리미엄 갤러리에 안전하게 저장되었습니다.');
        state.currentView = 'home';
        state.currentStep = 0;
        render();
    }
};

window.prevStep = function () {
    if (state.currentStep > 0) {
        state.currentStep--;
        render();
    }
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

// Initial Render
render();
