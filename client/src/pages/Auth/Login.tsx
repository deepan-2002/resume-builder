import { useState } from 'react';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const { signIn, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await signIn({ username, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500">
            Sign in to access your dashboard.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="user">
            Username
          </label>
          <input
            id="user"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="pass">
            Password
          </label>
          <input
            id="pass"
            type="password"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <Button type="submit" className="w-full justify-center" isLoading={loading}>
          Sign in
        </Button>
      </form>
    </div>
  );
};

export default Login;

