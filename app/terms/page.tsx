import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '서비스 약관 · Threads Search',
  description: 'Threads Search 서비스 이용 약관',
}

const EFFECTIVE_DATE = '2026년 5월 15일'

export default function TermsPage() {
  return (
    <main className="max-w-[760px] mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">서비스 약관</h1>
        <p className="text-sm text-muted-foreground">시행일: {EFFECTIVE_DATE}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. 목적</h2>
        <p>
          본 약관은 Threads-insight팀(이하 &ldquo;운영자&rdquo;)이 제공하는 Threads
          Search(이하 &ldquo;본 서비스&rdquo;)의 이용 조건 및 절차, 운영자와 이용자의
          권리·의무·책임을 정함을 목적으로 합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. 서비스 설명</h2>
        <p>
          본 서비스는 이용자가 Meta Platforms, Inc.이 제공하는 Threads 플랫폼에서
          본인이 작성한 게시물을 검색하고, 본인 게시물의 통계 인사이트를 시각화하여
          확인할 수 있도록 돕는 도구입니다. 본 서비스는 Meta 사의 공식 제품이 아니며,
          Meta 사와 어떠한 협력·제휴 관계도 갖지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. 이용 조건</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>본 서비스를 이용하려면 본인의 Threads 계정으로 OAuth 인증이 필요합니다.</li>
          <li>이용자는 Threads 및 Meta 사의 이용 약관을 준수해야 하며, 본 서비스 이용으로 인해 해당 약관 위반이 면제되지 않습니다.</li>
          <li>본 서비스는 만 14세 미만의 이용을 권장하지 않습니다.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. 이용자의 의무</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>본인의 계정으로만 본 서비스를 이용해야 합니다.</li>
          <li>자동화 도구·스크립트·크롤러 등을 이용해 본 서비스 또는 Meta API에 비정상적인 부하를 주는 행위를 금지합니다.</li>
          <li>본 서비스를 통해 얻은 데이터를 Meta 약관에 반하는 방식으로 재배포하거나 가공하지 않습니다.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. 면책</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>본 서비스는 베타 단계이며, 운영자는 데이터 정확성·가용성을 보장하지 않습니다.</li>
          <li>본 서비스가 사용하는 Threads API의 정책·기능 변경으로 인해 일부 기능이 동작하지 않을 수 있습니다.</li>
          <li>본 서비스 이용으로 발생한 직·간접적 손해에 대해 운영자는 책임을 부담하지 않습니다(단, 운영자의 고의·중과실이 입증된 경우는 제외).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6. 서비스 변경·중단</h2>
        <p>
          운영자는 사전 고지 없이 본 서비스의 일부 또는 전부를 변경·중단할 수 있습니다.
          중단이 결정되는 경우 합리적인 사전 안내를 위해 노력합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">7. 약관 변경</h2>
        <p>
          본 약관이 변경되는 경우 시행일을 갱신하고 본 페이지에 공지합니다.
          이용자가 변경 후에도 본 서비스를 계속 이용하는 경우 변경에 동의한 것으로
          간주합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">8. 분쟁 해결</h2>
        <p>
          본 약관 및 본 서비스 이용에 관한 분쟁은 대한민국 법령에 따라 해석되며,
          관할 법원은 민사소송법에 따른 법원으로 합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">9. 연락처</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>운영: Threads-insight팀</li>
          <li>이메일: <a href="mailto:ssomething.maker@gmail.com" className="underline">ssomething.maker@gmail.com</a></li>
        </ul>
      </section>
    </main>
  )
}
