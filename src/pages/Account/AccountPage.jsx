import { CstButton, CstInput } from "../../components/common/ui-components";
import { useEffect, useState } from "react";
import { ArrowUpRight, User } from "lucide-react";
import { authRequest, clearAuthToken } from "../../auth";
import { PageHero } from "../../components/common/PageRuntime";

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let mounted = true;
    authRequest("/api/auth/me")
      .then(({ user: currentUser }) => mounted && setUser(currentUser))
      .catch((requestError) => {
        if (mounted && requestError.status !== 401) setError(requestError.message);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  async function authenticate(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const fields = new FormData(event.currentTarget);
    const isSignup = mode === "signup";
    if (isSignup && fields.get("password") !== fields.get("confirmPassword")) {
      setError("Your passwords do not match.");
      setBusy(false);
      return;
    }
    try {
      const result = await authRequest(`/api/auth/member/${isSignup ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify({
          fullName: fields.get("name"),
          email: fields.get("email"),
          password: fields.get("password")
        })
      });
      if (result.token) setUser(result.user);
      setNotice(isSignup
        ? "Frontend preview account created for this session only. No account data was saved."
        : "Demo sign-in complete. No credentials were verified or saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    clearAuthToken();
    setUser(null);
    setNotice("You have signed out.");
  }

  if (loading) {
    return <><PageHero kicker="ACCOUNT" title="Your Humans of EV account" desc="Checking your account..." /><section className="section"><div className="container account-box"><span className="admin-spinner" /></div></section></>;
  }

  if (user) {
    return <><PageHero kicker="ACCOUNT" title={`Welcome, ${user.fullName || user.email}.`} desc="Frontend-only account preview. Your details are kept in memory only for this session." /><section className="section"><div className="container member-account">
      {notice && <div className="member-alert success" role="status">{notice}</div>}
      <div className="member-dashboard"><div className="member-profile"><div className="member-profile-icon"><User size={24} /></div><div><span className="eyebrow">YOUR ACCOUNT</span><h2>{user.fullName || user.email}</h2><p>{user.email}</p></div><CstButton className="outline" onClick={signOut}>Sign out</CstButton></div></div>
    </div></section></>;
  }

  return <><PageHero kicker="ACCOUNT" title="Your Humans of EV account" desc="Sign in or create an account. No payment or membership plan is required." /><section className="section"><div className="container member-auth-layout">
    <div className="member-auth-card"><div className="member-auth-tabs"><CstButton className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign in</CstButton><CstButton className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</CstButton></div>
      <form className="member-auth-form" onSubmit={authenticate}><span className="eyebrow">ACCOUNT AUTHENTICATION</span><h2>{mode === "signup" ? "Create your account." : "Welcome back."}</h2>
        {error && <div className="member-alert error" role="alert">{error}</div>}{notice && <div className="member-alert success" role="status">{notice}</div>}
        {mode === "signup" && <CstInput label="Full name" name="name" type="text" autoComplete="name" minLength="2" required />}
        <CstInput label="Email address" name="email" type="email" autoComplete="email" required />
        <CstInput label="Password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={mode === "signup" ? 8 : 1} required />
        {mode === "signup" && <CstInput label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" minLength="8" required />}
        <CstButton className="primary member-auth-submit" type="submit" disabled={busy}>{busy ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"} <ArrowUpRight size={16} /></CstButton>
      </form>
    </div>
  </div></section></>;
}
