import AvatarScene from '../components/AvatarScene';
import styles from './page.module.css';

export default function Page() {
  return (
    <main className={styles.main}>
      <header className={styles.heroHeader}>
        <div className={styles.badge}>AI Productivity Spotlight</div>
        <h1 className={styles.title}>Meet your high-energy AI host</h1>
        <p className={styles.subtitle}>
          Cinematic B-roll, confident narration, and a future-facing aesthetic designed for instant impact.
        </p>
      </header>
      <AvatarScene />
      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Optimized for a cinematic, tech-forward reveal. Ready for your next launch.
        </span>
      </footer>
    </main>
  );
}
