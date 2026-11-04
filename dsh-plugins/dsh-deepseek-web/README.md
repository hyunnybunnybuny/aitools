# dsh-deepseek-web

DSH 데스크톱 앱의 **왼쪽 LNB에 `DeepSeek Chat` 패널**을 추가하고, `https://chat.deepseek.com`을 웹뷰로 엽니다.
웹채팅에서 드래그해 선택한 질문·답변을 **Markdown으로 클립보드에 복사**해 DSH 세션에 붙여넣을 수 있습니다.

- 왼쪽 LNB의 **DeepSeek Chat**을 누르면 메인 영역에 웹뷰가 열립니다.
- 같은 웹뷰를 오른쪽 사이드바 탭으로도 열 수 있습니다(대화 옆에 두고 싶을 때).
- 웹뷰 안에서 직접 로그인하고 대화합니다. API 키가 필요 없습니다.
- 선택한 영역을 제목·목록·표·코드 블록·링크·수식(KaTeX)이 살아 있는 Markdown으로 변환합니다.
- 로그인 세션(`localStorage`의 `userToken`)을 DSH 앱 로컬 저장소에 백업하고, 앱을 다시 열면 자동 복원합니다.

macOS(Mac Studio 포함)와 Windows의 DSH 데스크톱 앱에서 사용할 수 있습니다.

## 요구 사항

- DSH 데스크톱 앱 (테스트: `0.2.1-rc.5`)
- 인터넷 연결과 DeepSeek 웹 계정
- 왼쪽 LNB에 **Plugins(플러그인)** 항목이 보이는 일반 데스크톱 프로필

## 설치

아래 두 방법 중 하나를 사용하세요. 저장소를 먼저 클론합니다.

```bash
git clone https://github.com/hyunnybunnybuny/aitools.git
```

### 방법 1 — 설치 스크립트

플러그인 폴더에서 스크립트를 실행합니다.

```bash
git clone https://github.com/hyunnybunnybuny/aitools.git
cd aitools/dsh-plugins/dsh-deepseek-web
sh install.sh
```

스크립트는 프로필의 `package.json`에 `link:` 의존성과 `dsh-deepseek-web` 번들을 추가하고,
DSH 앱에 번들된 Node/pnpm으로 `pnpm install`을 실행합니다.
프로필 위치를 바꾸려면 `DSH_PROFILE_DIR`를 지정하세요.

```bash
DSH_PROFILE_DIR="$HOME/.dsh/profiles/desktop" sh install.sh
```

설치 후 **DSH 데스크톱을 재시작**하면 왼쪽 LNB에 `DeepSeek Chat`이 나타납니다.

### 방법 2 — DSH Plugins 페이지에서 로컬 경로 설치 (권장)

1. 이 저장소를 클론합니다.
2. DSH 데스크톱 왼쪽 LNB에서 **Plugins(플러그인)** 를 엽니다.
3. **Install a third-party plugin** 입력란에 이 플러그인 폴더의 **절대 경로**를 넣습니다.
   - macOS: `/Users/<사용자>/aitools/dsh-plugins/dsh-deepseek-web`
   - Windows: `C:/Users/<사용자>/aitools/dsh-plugins/dsh-deepseek-web`
4. 설치 후 플러그인을 활성화하고 DSH를 재시작합니다.

### 방법 3 — 수동 설치

`~/.dsh/profiles/desktop/package.json`을 열어 의존성과 번들을 추가합니다.

```json
{
  "dependencies": {
    "dsh-deepseek-web": "link:/Users/<사용자>/aitools/dsh-plugins/dsh-deepseek-web"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "dsh-deepseek-web"
      ]
    }
  }
}
```

그다음 프로필 디렉터리에서 앱에 번들된 pnpm으로 설치합니다.

```bash
cd ~/.dsh/profiles/desktop
NODE="/Applications/DeepSeek Harness.app/Contents/Resources/runtime/primary-runtime/dependencies/node/bin/node"
"$NODE" "$(dirname "$NODE")/../../pnpm/bin/pnpm.mjs" install --ignore-scripts
```

Windows에서는 `DSH_PROFILE_DIR`를 `%USERPROFILE%\.dsh\profiles\desktop`으로,
Node는 `<DSH 설치 경로>\resources\runtime\primary-runtime\dependencies\node\bin\node.exe`로 바꿉니다.
`install.sh`가 이 경로들을 자동으로 찾습니다.

## 사용법

1. 왼쪽 LNB에서 **DeepSeek Chat**을 누릅니다.
2. 웹뷰에서 DeepSeek에 로그인합니다.
3. 평소처럼 질문하고 답변을 받습니다.
4. DSH로 가져오고 싶은 **질문과 답변을 마우스로 드래그해 선택**합니다.
5. 툴바의 **[선택 복사]** 를 누릅니다.
6. 원하는 DSH 세션 입력창에 붙여넣습니다.

툴바 버튼:

| 버튼 | 동작 |
|---|---|
| 선택 복사 | 웹뷰에서 선택한 영역을 Markdown으로 변환해 클립보드에 복사 |
| 새로고침 | 웹뷰 새로고침 |
| 저장 | 현재 로그인 세션을 DSH 로컬 저장소에 즉시 백업 |
| 복원 | 저장된 로그인 세션을 웹뷰에 다시 적용하고 새로고침 |
| 외부 | 시스템 기본 브라우저에서 `chat.deepseek.com` 열기 |

오른쪽 사이드바에서도 같은 웹뷰를 열 수 있습니다.
오른쪽 사이드바를 열고 **+** → **DeepSeek Chat** 카드를 선택하세요.
왼쪽 패널과 오른쪽 탭은 같은 로그인 파티션을 공유합니다.

## 로그인 세션 유지 방식

DeepSeek 웹은 로그인 토큰을 쿠키가 아니라 `localStorage`의 `userToken`에 저장합니다.
DSH 데스크톱의 웹뷰 파티션은 앱이 실행되는 동안만 유지되므로, 플러그인이 다음을 수행합니다.

1. 웹뷰가 열릴 때마다 `localStorage`(토큰 포함)와 읽을 수 있는 쿠키를 DSH 앱 로컬 저장소에 백업합니다.
2. 앱을 다시 열어 웹뷰가 비어 있으면, 백업을 `localStorage`에 복원한 뒤 한 번 새로고침합니다.
3. 서버가 토큰을 만료시키면 DeepSeek 로그인 화면이 다시 나타납니다. 다시 로그인하면 새 토큰이 백업됩니다.

백업 키는 `dsh.deepseek-web.session.v1`이며 DSH 앱 페이지의 `localStorage`에만 저장됩니다.
외부로 전송하지 않습니다.

## 보안과 범위

- 웹뷰는 DSH 데스크톱이 제공하는 샌드박스 게스트(전용 파티션, `nodeIntegration` 없음, `contextIsolation`)로 열립니다.
- 플러그인은 ① 로그인 세션 백업/복원, ② 사용자가 [선택 복사]를 누를 때 선택 영역 읽기, ③ 로그인 상태 확인에만
  웹뷰 안에서 스크립트를 실행합니다. 대화를 자동 전송하거나 읽어 오지 않습니다.
- 웹채팅의 자동화·대량 크롤링은 하지 않습니다. 일반 사용자 조작 범위입니다.
- DeepSeek 웹 UI가 바뀌면 선택 영역 변환 결과가 달라질 수 있습니다. 변환은 HTML→Markdown 규칙 기반입니다.
- 로그인 세션은 서버가 허용하는 기간까지만 유효합니다. 백업은 그 기간을 늘리지 않습니다.
- DSH 앱 로컬 저장소를 지우면 백업도 사라집니다. 다시 로그인해야 합니다.
- 데스크톱 앱에서만 웹뷰가 동작합니다. 웹 브라우저로 접속한 DSH에서는 안내 문구만 표시됩니다.

## 제거

```bash
cd ~/.dsh/profiles/desktop
```

`package.json`에서 `dsh-deepseek-web` 의존성과 `dsh.profile.bundles`의 항목을 지운 뒤:

```bash
NODE="/Applications/DeepSeek Harness.app/Contents/Resources/runtime/primary-runtime/dependencies/node/bin/node"
"$NODE" "$(dirname "$NODE")/../../pnpm/bin/pnpm.mjs" install --ignore-scripts
```

DSH를 재시작합니다. 플러그인 폴더를 지워도 됩니다.

## 문제 해결

- **왼쪽 LNB에 `DeepSeek Chat`이 안 보임** — DSH를 완전히 재시작합니다. Plugins 페이지에서 `dsh-deepseek-web` 번들이 활성화됐는지 확인합니다.
- **웹뷰가 “이 화면에서는 웹뷰를 열 수 없습니다”로 표시됨** — 데스크톱 앱이 아닌 브라우저에서 DSH를 열었거나, DSH 데스크톱 버전이 웹뷰 게스트 API를 제공하지 않는 경우입니다.
- **로그인이 복원되지 않음** — 툴바의 **[복원]** 을 누르거나 다시 로그인합니다. 토큰이 만료됐다면 재로그인 후 **[저장]** 을 누릅니다.
- **저장소를 옮긴 뒤 플러그인이 사라짐** — 프로필의 `link:` 경로가 예전 경로를 가리킵니다. `install.sh`를 새 경로에서 다시 실행합니다.
- **DSH 업데이트 후 웹뷰가 깨짐** — 이 플러그인은 DSH 데스크톱의 웹뷰 게스트 API를 사용합니다. DSH 업데이트로 내부 API가 바뀌면 플러그인 수정이 필요할 수 있습니다.

## 패키지 구조

```
dsh-deepseek-web/
  package.json        # dsh.bundle.patch, dsh.client(platform: web), exports
  cordis.patch.yml    # ui-deepseek-web 엔트리를 insert
  install.sh          # 데스크톱 프로필에 링크 설치
  lib/index.js        # 호스트 반쪽(동작 없음: Loader 엔트리용)
  lib/client.js       # LNB 패널/사이드바 탭, 웹뷰, 세션 백업, Markdown 변환
  README.md
  LICENSE
```

## 개발 메모

- 왼쪽 LNB 항목은 `sidebar.panellist` 슬롯에, 메인 영역 페이지는 `main` 키드 슬롯에 같은 id(`dsh-deepseek-web`)로 등록합니다.
- 오른쪽 탭은 `sidebarRightTabs`의 페이지 타입(`deepseek-web`)입니다.
- 웹뷰는 `globalThis.dshDesktop.browser`의 게스트 리스(lease)를 사용합니다. Electron `<webview>`는 DSH 데스크톱 메인 프로세스의 승인을 받아야 합니다.
- 데스크톱 웹뷰 파티션은 프로세스 수명이므로, 로그인은 `localStorage` 백업/복원으로 유지합니다.
