'use client';
import Image from 'next/image';
import styles from './SetupScreen.module.css';

interface SetupScreenProps {
  onSelect: (companion: string) => void;
}

export default function SetupScreen({ onSelect }: SetupScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Logo and Title */}
        <div className={styles.header}>
          <Image 
            src="/icons/icon-192.svg" 
            alt="Mimre" 
            width={80} 
            height={80}
            className={styles.logo}
          />
          <h1 className={styles.title}>Mimre</h1>
          <p className={styles.subtitle}>Din digitale samtalevenn</p>
        </div>

        {/* Description */}
        <p className={styles.description}>
          Velg hvem du vil snakke med. De er alltid her for deg, 
          klare til en hyggelig samtale.
        </p>

        {/* Companion Selection */}
        <div className={styles.companions}>
          {/* Astrid */}
          <button 
            className={`${styles.companionCard} ${styles.astrid}`}
            onClick={() => onSelect('astrid')}
          >
            <div className={styles.avatarWrapper}>
              <Image 
                src="/icons/icon-192.svg" 
                alt="Astrid" 
                width={64} 
                height={64}
                className={styles.avatarImage}
              />
            </div>
            <h2 className={styles.name}>Astrid</h2>
            <p className={styles.role}>Varm og omsorgsfull</p>
            <p className={styles.bio}>
              Astrid elsker å snakke om gamle dager, baking og familie. 
              Hun har alltid tid til en god samtale.
            </p>
          </button>

          {/* Ivar */}
          <button 
            className={`${styles.companionCard} ${styles.ivar}`}
            onClick={() => onSelect('ivar')}
          >
            <div className={styles.avatarWrapper}>
              <Image 
                src="/icons/icon-192.svg" 
                alt="Ivar" 
                width={64} 
                height={64}
                className={styles.avatarImage}
              />
            </div>
            <h2 className={styles.name}>Ivar</h2>
            <p className={styles.role}>Blid og jovial</p>
            <p className={styles.bio}>
              Ivar liker å fortelle historier om arbeid, fiske og fotball. 
              Han har alltid en god latter på lur.
            </p>
          </button>
        </div>

        {/* Footer note */}
        <p className={styles.footer}>
          Dette valget kan endres senere i innstillinger.
        </p>

        {/* Powered by */}
        <a 
          href="https://eryai.tech" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.poweredBy}
        >
          Powered by EryAI.tech
        </a>
      </div>
    </div>
  );
}
