import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 · Threads Search',
  description: 'Threads Search 서비스의 개인정보 수집·이용·보관·파기 정책',
}

const EFFECTIVE_DATE = '2026년 5월 15일'

export default function PrivacyPage() {
  return (
    <main className="max-w-[760px] mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">개인정보처리방침</h1>
        <p className="text-sm text-muted-foreground">시행일: {EFFECTIVE_DATE}</p>
      </header>

      <section className="space-y-3">
        <p className="text-foreground leading-relaxed">
          Threads-insight팀(이하 &ldquo;운영자&rdquo;)은 Threads Search(이하
          &ldquo;본 서비스&rdquo;) 이용자의 개인정보를 중요하게 생각하며, 관련
          법령을 준수하기 위해 다음과 같이 처리방침을 수립·공개합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. 수집하는 개인정보 항목</h2>
        <p>
          본 서비스는 Meta 사의 Threads API를 통해 다음 정보를 일시적으로 수집·열람합니다.
        </p>
        <ul className="list-disc pl-6 space-y-1 text-foreground">
          <li>Threads 사용자 ID, 사용자명(username), 표시 이름(name)</li>
          <li>프로필 사진 URL</li>
          <li>이용자가 작성한 Threads 게시물의 텍스트·작성일시·미디어 타입·원문 링크</li>
          <li>게시물별 인사이트 메트릭 (조회수, 좋아요, 댓글, 리포스트, 인용)</li>
          <li>OAuth 액세스 토큰 (브라우저 쿠키에 저장)</li>
        </ul>
        <p>운영자는 별도의 회원가입을 받지 않으며, 비밀번호 등 인증 자격 정보는 일절 보관하지 않습니다.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. 수집·이용 목적</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>본인 게시물 검색 기능 제공</li>
          <li>본인 게시물 통계 대시보드 제공</li>
          <li>로그인 상태 유지 및 본인 확인</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. 보관 위치 및 보관 기간</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>액세스 토큰·사용자 식별 정보</strong>는 이용자의 브라우저 쿠키에
            저장되며, 만료 기간은 발급일로부터 60일입니다. 이용자가 로그아웃하면
            즉시 삭제됩니다.
          </li>
          <li>
            <strong>게시물·인사이트 데이터</strong>는 영구 저장하지 않으며,
            서버 메모리에 최대 5분간만 캐시됩니다. 캐시는 자동 만료되거나
            새로고침 시 즉시 갱신됩니다.
          </li>
          <li>이용자의 데이터를 별도 데이터베이스에 영구 저장하지 않습니다.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. 제3자 제공 및 처리위탁</h2>
        <p>
          본 서비스는 수집한 개인정보를 어떠한 제3자에게도 제공하지 않으며, 처리
          위탁도 하지 않습니다. 다만 본 서비스 자체가 Meta Platforms, Inc.이 제공하는
          Threads API와의 통신을 전제로 동작하므로, Meta 사의 정책에 따른 데이터 처리는
          별도로 적용될 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. 이용자의 권리</h2>
        <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>본 서비스의 로그아웃 기능을 통한 토큰·식별 정보 즉시 삭제</li>
          <li>Threads 앱의 &ldquo;설정 → 계정 → 웹사이트 권한&rdquo;에서 본 서비스의 접근 권한 회수</li>
          <li>아래 연락처로 데이터 삭제·열람 요청</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6. 쿠키 정책</h2>
        <p>
          본 서비스는 로그인 상태 유지 목적으로 다음 쿠키를 사용합니다.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><code>threads_token</code> · OAuth 액세스 토큰 (HttpOnly, 60일)</li>
          <li><code>threads_user_id</code> · 사용자 식별자 (60일)</li>
          <li><code>threads_username</code>, <code>threads_name</code>, <code>threads_profile_pic</code> · 화면 표시용 프로필 정보 (60일)</li>
        </ul>
        <p>브라우저 설정에서 쿠키를 차단할 수 있으나, 차단 시 본 서비스 이용이 불가합니다.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">7. 보안 조치</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>모든 통신은 HTTPS로 암호화됩니다.</li>
          <li>액세스 토큰은 HttpOnly 쿠키로 저장되어 클라이언트 스크립트로 접근할 수 없습니다.</li>
          <li>인사이트 캐시는 사용자별로 격리되며 5분 후 자동 만료됩니다.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">8. 정책 변경</h2>
        <p>
          본 방침이 변경되는 경우 시행일을 갱신하고 본 페이지에 공지합니다.
          중대한 변경이 있을 때에는 이용자가 다음 로그인 시 인지할 수 있는 방식으로
          별도 고지합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">9. 연락처</h2>
        <p>
          개인정보 관련 문의·열람·삭제 요청은 아래로 보내주시기 바랍니다.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>운영: Threads-insight팀</li>
          <li>이메일: <a href="mailto:ssomething.maker@gmail.com" className="underline">ssomething.maker@gmail.com</a></li>
        </ul>
      </section>
    </main>
  )
}
