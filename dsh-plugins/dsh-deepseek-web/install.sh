#!/usr/bin/env sh
# Install dsh-deepseek-web into the DSH Desktop profile.
#
# Works on macOS and on Windows through Git Bash. The profile is linked to this
# folder, so updating the repository (git pull) updates the plugin after a DSH
# restart without reinstalling.
set -eu

say() { printf '%s\n' "$*"; }
die() { printf 'error: %s\n' "$*" >&2; exit 1; }

SCRIPT_DIR=$(CDPATH= cd "$(dirname "$0")" && pwd)
PROFILE_DIR=${DSH_PROFILE_DIR:-"$HOME/.dsh/profiles/desktop"}
PROFILE_JSON="$PROFILE_DIR/package.json"
PLUGIN_ID="dsh-deepseek-web"

[ -f "$PROFILE_JSON" ] || die "DSH Desktop 프로필을 찾지 못했습니다: $PROFILE_JSON
DSH 데스크톱을 한 번 실행해 프로필을 초기화한 뒤 다시 시도하세요."

# A link: spec must use a path spelling the local pnpm understands. Git Bash
# exposes /c/... paths; pnpm on Windows expects C:/... .
PLUGIN_LINK_DIR="$SCRIPT_DIR"
case "$(uname -s 2>/dev/null || printf unknown)" in
  MINGW* | MSYS* | CYGWIN*)
    if command -v cygpath >/dev/null 2>&1; then
      PLUGIN_LINK_DIR=$(cygpath -m "$SCRIPT_DIR")
    fi
    ;;
esac

find_node() {
  for candidate in \
    "/Applications/DeepSeek Harness.app/Contents/Resources/runtime/primary-runtime/dependencies/node/bin/node" \
    "$HOME/Applications/DeepSeek Harness.app/Contents/Resources/runtime/primary-runtime/dependencies/node/bin/node" \
    "$HOME/.dsh/dsh-runtimes/dsh-primary-runtime/dependencies/node/bin/node" \
    "$HOME/.dsh/dsh-runtimes/dsh-primary-runtime/dependencies/node/bin/node.exe" \
    "${LOCALAPPDATA:-}/Programs/DeepSeek Harness/resources/runtime/primary-runtime/dependencies/node/bin/node.exe"
  do
    if [ -n "$candidate" ] && [ -x "$candidate" ]; then
      printf '%s' "$candidate"
      return 0
    fi
  done
  command -v node 2>/dev/null || true
}

NODE_BIN=$(find_node)
[ -n "$NODE_BIN" ] || die "Node를 찾지 못했습니다. DSH 데스크톱 앱이 설치되어 있는지 확인하세요."

find_pnpm() {
  local node_dir
  node_dir=$(CDPATH= cd "$(dirname "$NODE_BIN")" 2>/dev/null && pwd)
  for candidate in \
    "$node_dir/../../pnpm/bin/pnpm.mjs" \
    "$HOME/.dsh/dsh-runtimes/dsh-primary-runtime/dependencies/pnpm/bin/pnpm.mjs" \
    "/Applications/DeepSeek Harness.app/Contents/Resources/runtime/primary-runtime/dependencies/pnpm/bin/pnpm.mjs"
  do
    if [ -n "$candidate" ] && [ -f "$candidate" ]; then
      printf '%s' "$candidate"
      return 0
    fi
  done
  command -v pnpm 2>/dev/null || true
}

PNPM_BIN=$(find_pnpm)
[ -n "$PNPM_BIN" ] || die "pnpm을 찾지 못했습니다. DSH 데스크톱 앱의 런타임을 확인하세요."

update_profile() {
  local mode=$1
  "$NODE_BIN" - "$PROFILE_JSON" "$PLUGIN_LINK_DIR" "$mode" <<'NODE'
const fs = require('fs');
const [profilePath, pluginDir, mode] = process.argv.slice(2);
const data = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
data.dependencies = data.dependencies || {};
data.dsh = data.dsh || {};
data.dsh.profile = data.dsh.profile || {};
data.dsh.profile.bundles = Array.isArray(data.dsh.profile.bundles) ? data.dsh.profile.bundles : [];
if (mode === 'dependency') {
  data.dependencies['dsh-deepseek-web'] = 'link:' + pluginDir;
} else if (mode === 'bundle') {
  if (!data.dsh.profile.bundles.includes('dsh-deepseek-web')) {
    data.dsh.profile.bundles.push('dsh-deepseek-web');
  }
}
fs.writeFileSync(profilePath, JSON.stringify(data, null, 2) + '\n');
NODE
}

run_pnpm_install() {
  if [ -f "$PNPM_BIN" ]; then
    (cd "$PROFILE_DIR" && "$NODE_BIN" "$PNPM_BIN" install --ignore-scripts)
  else
    (cd "$PROFILE_DIR" && "$PNPM_BIN" install --ignore-scripts)
  fi
}

say "DSH 프로필: $PROFILE_DIR"
say "플러그인 경로: $PLUGIN_LINK_DIR"
say "Node: $NODE_BIN"
say "pnpm: $PNPM_BIN"
say ""

say "1/3 프로필에 링크 의존성을 추가하는 중…"
update_profile dependency

say "2/3 프로필 의존성을 설치하는 중…"
run_pnpm_install

say "3/3 번들을 활성화하는 중…"
update_profile bundle

say ""
say "설치 완료: $PLUGIN_ID"
say "DSH 데스크톱을 재시작한 뒤 왼쪽 LNB의 'DeepSeek Chat'을 여세요."
say "오른쪽 사이드바를 쓰려면 + → 'DeepSeek Chat' 카드를 선택하세요."
