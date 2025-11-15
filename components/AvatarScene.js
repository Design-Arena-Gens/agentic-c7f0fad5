'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './AvatarScene.module.css';

const SEGMENTS = [
  {
    id: 'time',
    text: 'People are saving HOURS every week',
    duration: 3700
  },
  {
    id: 'futuristic',
    text: 'using new free AI tools...',
    duration: 3100
  },
  {
    id: 'discovery',
    text: "but most people still don't know they exist.",
    duration: 3200
  },
  {
    id: 'countdown',
    text: "Today, I'll show you 5 powerful AI tools that can boost your productivity instantly --",
    duration: 4200
  },
  {
    id: 'free',
    text: 'and every one of them is completely free.',
    duration: 3600
  }
];

const FULL_SCRIPT =
  "People are saving HOURS every week using new free AI tools... but most people still don't know they exist. Today, I'll show you 5 powerful AI tools that can boost your productivity instantly -- and every one of them is completely free.";

const VOICE_PREFERENCES = [
  'Google UK English Male',
  'Google US English',
  'Microsoft Guy24',
  'Daniel',
  'Samantha'
];

export default function AvatarScene() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const hasSpokenRef = useRef(false);
  const loopDuration = useMemo(
    () => SEGMENTS.reduce((total, segment) => total + segment.duration, 0),
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const start = performance.now();
    let animationFrameId = 0;

    const update = (timestamp) => {
      const elapsed = (timestamp - start) % loopDuration;
      let accumulator = 0;
      for (let idx = 0; idx < SEGMENTS.length; idx += 1) {
        accumulator += SEGMENTS[idx].duration;
        if (elapsed <= accumulator) {
          setActiveIndex(idx);
          break;
        }
      }
      setProgress(elapsed / loopDuration);
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [loopDuration]);

  useEffect(() => {
    if (typeof window === 'undefined' || hasSpokenRef.current) {
      return undefined;
    }

    const { speechSynthesis } = window;
    if (!speechSynthesis) {
      return undefined;
    }

    hasSpokenRef.current = true;
    let utterance;

    const speak = () => {
      speechSynthesis.cancel();
      utterance = new SpeechSynthesisUtterance(FULL_SCRIPT);
      utterance.pitch = 1;
      utterance.rate = 1.03;
      utterance.volume = 0.95;

      const availableVoices = speechSynthesis.getVoices();
      const chosenVoice = VOICE_PREFERENCES.map((name) =>
        availableVoices.find((voice) => voice.name.toLowerCase().includes(name.toLowerCase()))
      ).find(Boolean);

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      speechSynthesis.speak(utterance);
    };

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', speak, { once: true });
    } else {
      speak();
    }

    return () => {
      if (utterance) {
        utterance.onend = null;
      }
      speechSynthesis.cancel();
    };
  }, []);

  return (
    <section className={styles.scene}>
      <div className={styles.videoFrame}>
        <div className={styles.glow} />
        <DynamicBroll activeIndex={activeIndex} />
        <div className={styles.avatarWrapper}>
          <AvatarFace isSpeaking />
          <SpeechWaveform activeIndex={activeIndex} />
        </div>
        <div className={styles.subtitleBar}>
          <span className={styles.subtitleText}>{SEGMENTS[activeIndex].text}</span>
        </div>
        <Timeline progress={progress} segments={SEGMENTS} activeIndex={activeIndex} />
      </div>
    </section>
  );
}

function DynamicBroll({ activeIndex }) {
  return (
    <div className={styles.brollStack}>
      {SEGMENTS.map((segment, idx) => (
        <BrollLayer key={segment.id} variant={segment.id} isActive={idx === activeIndex} />
      ))}
    </div>
  );
}

function BrollLayer({ variant, isActive }) {
  return (
    <div className={`${styles.brollLayer} ${isActive ? styles.brollActive : ''}`} data-variant={variant}>
      <div className={styles.brollBackdrop} />
      <div className={styles.brollContent}>
        {variant === 'time' && <TimeBroll />}
        {variant === 'futuristic' && <FuturisticBroll />}
        {variant === 'discovery' && <DiscoveryBroll />}
        {variant === 'countdown' && <CountdownBroll />}
        {variant === 'free' && <FreeBroll />}
      </div>
    </div>
  );
}

function TimeBroll() {
  return (
    <div className={styles.timeCluster}>
      {[0, 1, 2].map((idx) => (
        <div key={`clock-${idx}`} className={`${styles.clock} ${styles[`floatDelay${idx}`]}`}>
          <div className={styles.clockFace}>
            <span className={styles.clockHandHour} />
            <span className={styles.clockHandMinute} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FuturisticBroll() {
  return (
    <div className={styles.futuristicGrid}>
      {[...Array(6).keys()].map((idx) => (
        <div key={`module-${idx}`} className={`${styles.uiTile} ${styles[`pulseDelay${idx % 3}`]}`}>
          <div className={styles.uiTileHeader} />
          <div className={styles.uiTileBody} />
          <div className={styles.uiTileFooter} />
        </div>
      ))}
    </div>
  );
}

function DiscoveryBroll() {
  return (
    <div className={styles.discoveryField}>
      {[...Array(4).keys()].map((idx) => (
        <div key={`beacon-${idx}`} className={`${styles.discoveryBeacon} ${styles[`orbitDelay${idx}`]}`}>
          <div className={styles.discoveryInner} />
        </div>
      ))}
    </div>
  );
}

function CountdownBroll() {
  return (
    <div className={styles.countdownStrip}>
      {[5, 4, 3, 2, 1].map((num, idx) => (
        <span key={`count-${num}`} className={`${styles.countNumber} ${styles[`slideDelay${idx}`]}`}>
          {num}
        </span>
      ))}
    </div>
  );
}

function FreeBroll() {
  return (
    <div className={styles.freeBanner}>
      <span className={styles.freeStamp}>100% FREE</span>
      <span className={`${styles.freeStamp} ${styles.alt}`}>ZERO COST</span>
      <span className={`${styles.freeStamp} ${styles.tilted}`}>UNLOCKED</span>
    </div>
  );
}

function AvatarFace({ isSpeaking }) {
  return (
    <div className={`${styles.avatar} ${isSpeaking ? styles.avatarSpeaking : ''}`}>
      <div className={styles.avatarGlow} />
      <div className={styles.avatarCore}>
        <div className={styles.eyeLeft} />
        <div className={styles.eyeRight} />
        <div className={styles.mouth} />
      </div>
    </div>
  );
}

function SpeechWaveform({ activeIndex }) {
  return (
    <div className={styles.waveform}>
      {[...Array(24).keys()].map((idx) => (
        <span
          key={`bar-${idx}`}
          className={`${styles.waveBar} ${styles[`waveVariant${(activeIndex + idx) % 4}`]}`}
          style={{ animationDelay: `${(idx % 6) * 80}ms` }}
        />
      ))}
    </div>
  );
}

function Timeline({ progress, segments, activeIndex }) {
  return (
    <div className={styles.timeline}>
      <div className={styles.timelineProgress} style={{ transform: `scaleX(${progress})` }} />
      <div className={styles.timelineTicks}>
        {segments.map((segment, idx) => (
          <div key={segment.id} className={styles.timelineTick}>
            <div className={`${styles.tickDot} ${idx <= activeIndex ? styles.tickDotActive : ''}`} />
            <span className={styles.tickLabel}>{segment.id.replace(/^[a-z]/, (c) => c.toUpperCase())}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
