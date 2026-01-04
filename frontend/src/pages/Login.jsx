export default function Login() {
  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input className="w-full p-2 border rounded mb-3" placeholder="Email" />
      <input className="w-full p-2 border rounded mb-3" type="password" placeholder="Password" />
      <button className="w-full py-2 bg-[var(--color-primary)] text-white rounded">
        Login
      </button>
    </div>
  )
}