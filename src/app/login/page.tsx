'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Email ou senha incorretos.');
      setLoading(false);
      return;
    }

    // Salva a sessão em cookie pra o middleware conseguir ler
    const session = data.session;
    if (session) {
      const expires = new Date(session.expires_at! * 1000).toUTCString();
      const value = encodeURIComponent(JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      }));
      document.cookie = `sb-auth-token=${value}; expires=${expires}; path=/; SameSite=Lax`;
    }

    const role = data.user?.user_metadata?.role;
    if (role === 'admin') {
      router.push('/adminpage');
    } else {
      router.push('/player');
    }
  };

  return (
    <main className={styles.container}>
      {/* Efeito de fundo */}
      <div className={styles.bgGlow} />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoArea}>
          <div className={styles.seal}>忍</div>
          <h1 className={styles.title}>Naruto RPG</h1>
          <p className={styles.subtitle}>Acesse o sistema ninja</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label>Senha</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPass ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.errorMsg}>
              {error}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 size={18} className={styles.spinner} /> : null}
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}