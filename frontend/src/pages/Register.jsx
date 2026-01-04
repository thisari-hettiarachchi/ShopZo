export default function Register() {
  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <input className="w-full p-2 border rounded mb-3" placeholder="Full Name" />
      <input className="w-full p-2 border rounded mb-3" placeholder="Email" />
      <input className="w-full p-2 border rounded mb-3" type="password" placeholder="Password" />
      <input className="w-full p-2 border rounded mb-3" type="password" placeholder="Confirm Password" />
      <button className="w-full py-2 bg-[var(--color-primary)] text-white rounded">
        Register
      </button>
    </div>
  )
}