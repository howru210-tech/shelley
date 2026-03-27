const fs = require('fs');

const targetFile = 'c:/OneDrive/문서/Shelley Event/shelley-event-app/app.js';
let content = fs.readFileSync(targetFile, 'utf8');

// Normalize line endings to \n for easier replacement
content = content.replace(/\r\n/g, '\n');

const replacements = [
    {
        target: `    data: {
        intent: '',
        story: '',
        resonance: '',
        poemMusic: null
    }
};`,
        replacement: `    data: {
        intent: '',
        story: '',
        resonance: '',
        poemMusic: null,
        poemText: '',
        subtitleEffect: '',
        musicStyle: ''
    },
    creationState: 'initial' // 'initial', 'tools', 'poetry', 'music', 'done'
};`
    },
    {
        target: `        case 4: // 시/음악 제작
            return \`
                <div class="card artwork-gen" style="border: 2px dashed var(--primary); text-align:center; padding:30px 20px;">
                    <div style="display:flex; justify-content:center; gap:20px; margin-bottom:20px;">
                        <i data-lucide="pen-tool" style="width:32px; height:32px; color:var(--accent);"></i>
                        <i data-lucide="music" style="width:32px; height:32px; color:var(--primary);"></i>
                    </div>
                    <h4>나만의 시와 음악 만들기</h4>
                    <p style="font-size:0.8rem; margin-top:8px; color:var(--text-muted);">사진의 감성을 '시'와 '음악'으로 승화시킵니다.</p>
                    <button class="btn-primary" style="margin-top:20px; width:auto; padding:12px 24px;">작품 생성 및 공유하기</button>
                    \${state.data.poemMusic ? '<p style="margin-top:10px; color:var(--accent);">✓ 작품이 생성되었습니다.</p>' : ''}
                </div>
            \`;`,
        replacement: `        case 4: // 시/음악 제작
            if (state.creationState === 'initial') {
                return \`
                    <div class="card artwork-gen" style="border: 2px dashed var(--primary); text-align:center; padding:30px 20px;">
                        <div style="display:flex; justify-content:center; gap:20px; margin-bottom:20px;">
                            <i data-lucide="pen-tool" style="width:32px; height:32px; color:var(--accent);"></i>
                            <i data-lucide="music" style="width:32px; height:32px; color:var(--primary);"></i>
                        </div>
                        <h4>나만의 시와 음악 만들기</h4>
                        <p style="font-size:0.8rem; margin-top:8px; color:var(--text-muted);">사진의 감성을 '시'와 '음악'으로 승화시킵니다.</p>
                        <button class="btn-primary" style="margin-top:20px; width:auto; padding:12px 24px;" onclick="startCreation()">작품 생성 시작하기</button>
                    </div>
                \`;
            } else if (state.creationState === 'tools') {
                return \`
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
                    \${state.data.poemText || state.data.musicStyle ? \`
                        <div style="text-align:center; margin-top:20px;">
                            <button class="btn-primary" onclick="checkCreationDone()">완료 확인하기</button>
                        </div>
                    \` : ''}
                \`;
            } else if (state.creationState === 'poetry') {
                return \`
                    <div style="display:flex; align-items:center; margin-bottom:12px;">
                        <button class="icon-btn" onclick="goToCreation('tools')" style="background:none; border:none; color:var(--text-muted);"><i data-lucide="arrow-left"></i></button>
                        <h4 style="margin-left:8px;">'시' 쓰기 공간</h4>
                    </div>
                    <textarea id="poem-input" class="card" style="width:100%; height:120px; color:white; border:1px solid var(--primary);" placeholder="당신의 감성을 시로 표현해보세요..." onchange="updatePoem(this.value)">\${state.data.poemText}</textarea>
                    
                    <h5 style="margin-top:20px; margin-bottom:10px;">자막 효과 선택</h5>
                    <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:10px; margin-bottom:20px;">
                        <button class="btn-secondary \${state.data.subtitleEffect === 'fade' ? 'active-effect' : ''}" style="width:auto; padding:8px 16px; margin:0; \${state.data.subtitleEffect === 'fade' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('fade')">페이드</button>
                        <button class="btn-secondary \${state.data.subtitleEffect === 'typewriter' ? 'active-effect' : ''}" style="width:auto; padding:8px 16px; margin:0; \${state.data.subtitleEffect === 'typewriter' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('typewriter')">타자방식</button>
                        <button class="btn-secondary \${state.data.subtitleEffect === 'slide' ? 'active-effect' : ''}" style="width:auto; padding:8px 16px; margin:0; \${state.data.subtitleEffect === 'slide' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('slide')">슬라이드</button>
                        <button class="btn-secondary \${state.data.subtitleEffect === 'zoom' ? 'active-effect' : ''}" style="width:auto; padding:8px 16px; margin:0; \${state.data.subtitleEffect === 'zoom' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectEffect('zoom')">줌인</button>
                    </div>
                    
                    \${state.data.subtitleEffect ? \`
                        <div class="card" style="text-align:center; padding:20px; border:1px dashed var(--glass-border);">
                            <p style="font-size:0.9rem; color:var(--accent);">효과 적용 미리보기: [\${state.data.subtitleEffect} 효과]</p>
                        </div>
                    \` : ''}

                    <div style="display:flex; gap:12px; justify-content:center; margin-top:20px;">
                        <button class="btn-primary" onclick="finishPoetry()">시 작성 완료</button>
                    </div>
                \`;
            } else if (state.creationState === 'music') {
                return \`
                    <div style="display:flex; align-items:center; margin-bottom:12px;">
                        <button class="icon-btn" onclick="goToCreation('tools')" style="background:none; border:none; color:var(--text-muted);"><i data-lucide="arrow-left"></i></button>
                        <h4 style="margin-left:8px;">음악 작곡 과정</h4>
                    </div>
                    <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:16px;">사진과 시에 어울리는 음악 스타일을 선택하세요.</p>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                        <button class="btn-secondary" style="padding:16px; \${state.data.musicStyle === 'piano' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('piano')">잔잔한 피아노</button>
                        <button class="btn-secondary" style="padding:16px; \${state.data.musicStyle === 'acoustic' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('acoustic')">어쿠스틱 기타</button>
                        <button class="btn-secondary" style="padding:16px; \${state.data.musicStyle === 'synth' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('synth')">몽환적인 신스</button>
                        <button class="btn-secondary" style="padding:16px; \${state.data.musicStyle === 'orchestra' ? 'background:var(--primary); border-color:var(--primary);' : ''}" onclick="selectMusicStyle('orchestra')">웅장한 오케스트라</button>
                    </div>

                    <div style="display:flex; gap:12px; justify-content:center; margin-top:24px;">
                        <button class="btn-primary" onclick="finishMusic()">음악 생성 완료</button>
                    </div>
                \`;
            } else if (state.creationState === 'done') {
                return \`
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
                        </div>
                        <button class="btn-secondary" style="margin-top:20px; font-size:0.8rem; border:none; background:none; text-decoration:underline;" onclick="goToCreation('tools')">다시 만들기</button>
                    </div>
                \`;
            }`
    },
    {
        target: `window.navigateToFlow = function (flowType) {
    state.flow = flowType;
    state.currentStep = 0;
    state.currentView = 'flow-wizard';
    render();
};`,
        replacement: `window.navigateToFlow = function (flowType) {
    state.flow = flowType;
    state.currentStep = 0;
    state.currentView = 'flow-wizard';
    state.creationState = 'initial';
    render();
};`
    },
    {
        target: `window.prevStep = function () {
    if (state.currentStep > 0) {
        state.currentStep--;
        render();
    }
};`,
        replacement: `window.prevStep = function () {
    if (state.currentStep > 0) {
        state.currentStep--;
        render();
    }
};

// Poetry & Music Creation Event Handlers
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
    alert(\`[작품 미리보기]\\n자막 효과: \${state.data.subtitleEffect || '기본'}\\n배경 음악: \${state.data.musicStyle}\\n\\n내용:\\n\${poemSafe}\`);
};

window.saveWork = function() {
    alert('작품이 내 보관함에 저장되었습니다.');
};

window.shareWork = function() {
    alert('작품 공유 링크가 복사되었습니다!');
};`
    }
];

let failed = false;
for (let i = 0; i < replacements.length; i++) {
    const { target, replacement } = replacements[i];
    if (content.includes(target)) {
        content = content.replace(target, replacement);
        console.log(\`Successfully replaced chunk \${i}\`);
    } else {
        console.error(\`Failed to find chunk \${i}\`);
        failed = true;
    }
}

if (!failed) {
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log("Successfully wrote to app.js");
} else {
    process.exit(1);
}
