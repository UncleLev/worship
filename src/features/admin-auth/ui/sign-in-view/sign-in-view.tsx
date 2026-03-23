'use client';

import { FormEvent, useState } from 'react';
import styles from './sign-in-view.module.scss';

interface SignInViewProps {
  onSignIn: (email: string, password: string) => void;
  error: string | null;
}

export default function SignInView({ onSignIn, error }: SignInViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <p className={styles.title}>Увійти</p>
        <label className={styles.field}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </label>
        <label className={styles.field}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} type="submit">
          Увійти
        </button>
      </form>
    </div>
  );
}
