import React, { useState } from "react";
import { GoogleAuthProvider, signInWithRedirect, getAuth } from "firebase/auth";

const AuthForm = ({ onSignIn, loading }) => {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      alert(error.message);
    }
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn(email, password, isSignUp);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full mt-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 flex items-center justify-center gap-2 shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24"
            height="24"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.36 2.69 30.55 0 24 0 14.61 0 6.44 5.74 2.44 14.09l7.98 6.21C12.13 13.13 17.61 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.59c0-1.56-.14-3.06-.39-4.5H24v9.02h12.44c-.54 2.91-2.18 5.38-4.64 7.04l7.19 5.59C43.98 37.36 46.1 31.44 46.1 24.59z"
            />
            <path
              fill="#FBBC05"
              d="M10.42 28.3c-.48-1.44-.76-2.97-.76-4.55s.28-3.11.76-4.55l-7.98-6.21C.86 16.36 0 20.04 0 24c0 3.96.86 7.64 2.44 10.99l7.98-6.21z"
            />
            <path
              fill="#EA4335"
              d="M24 48c6.55 0 12.36-2.16 16.94-5.89l-7.19-5.59c-2.01 1.35-4.59 2.15-7.75 2.15-6.39 0-11.87-3.63-14.58-8.8l-7.98 6.21C6.44 42.26 14.61 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Sign in with Google
        </button>
      </form>
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => setIsSignUp((prev) => !prev)}
          className="text-purple-600 hover:underline"
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
