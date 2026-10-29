# 찌부씰 · Subway Seal

> 지하철에서 마주친 사람을 사진 대신 그림으로, 띠부씰처럼 남기는 웹앱

KAIST ID304 UX Design (2026 Fall) 팀 프로젝트.

## 컨셉

출퇴근·통학길 지하철에서 흘려보내던 이동 시간에, 주의를 잠깐 주변 사람에게 머물게 합니다.
눈에 들어온 사람의 옷차림과 인상을 짧게 그려 스티커(씰)로 만들고, 스티커북에 모아 나만의 지하철을 꾸밉니다.

- **사진 대신 그림** — 도촬 없이 관찰하는 방식
- **결과보다 과정 (Slowness)** — 잘 그리는 것보다 그 순간 머무는 것이 목적
- **기억은 부산물** — 모인 스티커를 돌아보며 "내 관심은 이런 거였네"를 발견

## 핵심 경험

1. **기억에 남는 이동** — 의미 없이 지나가던 이동 시간을 기억할 만한 순간으로
2. **사진으로 못 남긴 스타일을 쉽게** — 그림 실력 부담 없이 빠르게 그려 씰로
3. **타인에 대한 관심** — 무관심 대신 다정한 관심, 그리고 내 취향에 대한 회고

## 대상 사용자

**김하나 (23, 대학생)** — 대중교통으로 20분 이상 통학하며, 마주친 사람들의 옷 색 조합·아이템·핏을 눈여겨보는 "고개 드는 관찰자".
들키지 않게, 짧게, 못 그려도 본 옷을 남기고 싶어 합니다.

## 상태

컨셉 설계 단계. 웹앱 프로토타입 개발 예정. 첫 목표는 아이폰에서 손가락으로 그리는 캔버스.

- 기술: Vite + React + TypeScript + Tailwind CSS
- 대상: iPhone Safari만
- 개발 흐름 설계: [docs/superpowers/specs/2026-10-29-dev-pipeline-design.md](docs/superpowers/specs/2026-10-29-dev-pipeline-design.md)

---

## 개발 환경 세팅 (처음 한 번)

맥 기준. 개발이 처음이어도 위에서부터 순서대로 따라 하면 됩니다.
아래 `코드 블록` 안의 내용은 **터미널**에 복사해 붙여넣고 엔터를 누르세요.

> 터미널 여는 법: `⌘ + Space` → "터미널" 입력 → 엔터

### 1. 개발자 도구 (Git 포함)

```bash
xcode-select --install
```

창이 뜨면 "설치"를 누르세요. 이미 설치돼 있다는 메시지가 나오면 다음 단계로 넘어가면 됩니다.

### 2. Homebrew (맥용 프로그램 설치 도구)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

- 맥 로그인 비밀번호를 물어보면 입력하세요 (입력해도 화면에 안 보이는 게 정상).
- 설치가 끝나면 터미널에 **"Next steps"** 아래 명령어 2줄이 나옵니다. 그 2줄을 그대로 복사해 실행하세요.
- 확인: `brew --version` → 버전 숫자가 나오면 성공

### 3. Node.js와 GitHub CLI

```bash
brew install node gh
```

확인:

```bash
node -v
npm -v
```

숫자가 나오면 성공. (`node -v`가 `v20.19` 이상이어야 합니다.)

### 4. GitHub 로그인

[GitHub](https://github.com) 계정이 필요합니다. 레포 관리자에게 계정 아이디를 알려주고 **collaborator 초대**를 수락하세요 (초대는 이메일로 옴).

```bash
gh auth login
```

질문에 이렇게 답하세요:

1. `GitHub.com`
2. `HTTPS`
3. Authenticate Git with your GitHub credentials? → `Yes`
4. `Login with a web browser` → 화면에 나온 8자리 코드를 복사 → 엔터 → 브라우저에서 코드 붙여넣고 승인

그다음 커밋에 표시될 이름과 이메일을 설정하세요 (GitHub 계정 이메일 권장):

```bash
git config --global user.name "내이름"
git config --global user.email "내이메일@example.com"
```

### 5. 코드 받기

원하는 폴더로 이동한 뒤 받습니다. 예: 문서 폴더

```bash
cd ~/Documents
git clone https://github.com/WooeeKim/subwayseal.git
cd subwayseal
```

### 6. 의존성 설치

```bash
npm install
```

`node_modules` 폴더가 생기면 성공. `package.json`이 바뀌었을 때(누가 새 패키지를 추가했을 때)도 다시 실행하세요.

### 7. 아이폰에서 열기

```bash
npm run dev -- --host
```

터미널에 이런 줄이 나옵니다:

```
➜  Network: http://192.168.0.12:5173/
```

1. 아이폰을 **맥과 같은 Wi-Fi**에 연결
2. 아이폰 Safari에서 `Network:` 옆 주소 입력
3. 코드를 저장하면 아이폰 화면이 자동으로 바뀝니다
4. 끝내려면 터미널에서 `Ctrl + C`

**아이폰에서 안 열릴 때**

- 학교 Wi-Fi는 기기끼리 연결을 막는 경우가 많습니다. → 아이폰 **설정 → 개인용 핫스팟** 켜기 → 맥을 그 핫스팟에 연결 → `npm run dev -- --host` 다시 실행 → 새로 나온 `Network:` 주소로 접속
- 맥에서 "들어오는 연결을 허용하시겠습니까?" 창이 뜨면 **허용**

---

## 매일 작업하는 법

모두 `main` 브랜치에서 작업합니다. 충돌을 줄이려면 아래 순서를 지켜주세요.

```bash
# 1. 작업 시작 전: 최신 코드 받기
git pull --rebase

# 2. 코드 수정 후, 올리기 전: 빌드가 깨지지 않는지 확인
npm run build

# 3. 저장(커밋)
git add .
git commit -m "무엇을 바꿨는지 한 줄로"

# 4. 올리기 직전에 한 번 더 최신 코드 받기 → 올리기
git pull --rebase
git push
```

**규칙**

- 한 사람이 한 컴포넌트 파일을 맡습니다. 같은 파일을 동시에 고치면 충돌이 납니다.
- `npm run build`가 에러로 끝나면 올리지 마세요. 다른 팀원 모두가 막힙니다.
- `git pull --rebase` 중 "CONFLICT"가 나오면 혼자 해결하려 하지 말고 팀 채팅에 공유하세요.
