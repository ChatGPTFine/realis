import { signIn, signUp } from "./actions";

export default function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14">
      <div className="mb-8">
        <p className="text-sm font-semibold text-[#7b927f]">私密账号</p>
        <h1 className="mt-2 text-4xl font-semibold">登录或注册 Realis</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#65706d]">
          你的记录默认只对你自己可见。登录后，AI 觉察、时光画廊和人际罗盘都会保存到你的账号里。
        </p>
      </div>
      <AuthMessage searchParams={searchParams} />
      <section className="grid gap-5 md:grid-cols-2">
        <AuthForm action={signIn} buttonText="登录" title="已有账号" />
        <AuthForm action={signUp} buttonText="注册" title="创建账号" />
      </section>
    </main>
  );
}

async function AuthMessage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  if (!params.message) return null;

  const text =
    params.message === "login_failed"
      ? "登录失败，请检查邮箱和密码。"
      : "注册失败，请确认邮箱格式和密码长度。";

  return <p className="mb-5 rounded-md border border-[#e6d2c8] bg-[#fff7f3] p-3 text-sm text-[#8a4b39]">{text}</p>;
}

function AuthForm({
  action,
  buttonText,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  buttonText: string;
  title: string;
}) {
  return (
    <form action={action} className="rounded-lg border border-[#d9e1dc] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <label className="mt-6 block text-sm font-medium text-[#65706d]" htmlFor={`${buttonText}-email`}>
        邮箱
      </label>
      <input
        className="mt-2 w-full rounded-md border border-[#d9e1dc] px-3 py-3 outline-none focus:border-[#7b927f]"
        id={`${buttonText}-email`}
        name="email"
        required
        type="email"
      />
      <label className="mt-4 block text-sm font-medium text-[#65706d]" htmlFor={`${buttonText}-password`}>
        密码
      </label>
      <input
        className="mt-2 w-full rounded-md border border-[#d9e1dc] px-3 py-3 outline-none focus:border-[#7b927f]"
        id={`${buttonText}-password`}
        minLength={6}
        name="password"
        required
        type="password"
      />
      <button className="mt-6 w-full rounded-md bg-[#7b927f] px-4 py-3 font-medium text-white" type="submit">
        {buttonText}
      </button>
    </form>
  );
}
