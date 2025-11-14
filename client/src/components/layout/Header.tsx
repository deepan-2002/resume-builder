import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

const Header = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const displayName =
    typeof user?.fullName === 'string'
      ? (user.fullName as string)
      : typeof user?.username === 'string'
        ? (user.username as string)
        : 'Guest';
  const email =
    typeof user?.email === 'string' ? (user.email as string) : undefined;

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Resume Builder
        </h1>
        <p className="text-sm text-slate-500">
          Craft professional resumes with live preview and auto-save.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{displayName}</p>
          {email && <p className="text-xs text-slate-500">{email}</p>}
          </div>
        )}
        {isAuthenticated && (
          <Button variant="ghost" onClick={signOut}>
            Sign out
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;

