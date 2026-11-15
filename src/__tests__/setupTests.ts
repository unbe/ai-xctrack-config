import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  // Mock window.AudioContext for acoustic vario preview tests
  if (!window.AudioContext) {
    (window as any).AudioContext = class MockAudioContext {
      state = 'running';
      currentTime = 0;
      destination = {};
      createOscillator() {
        return {
          type: 'sine',
          frequency: { setValueAtTime: () => {} },
          connect: () => {},
          start: () => {},
          stop: () => {},
        };
      }
      createGain() {
        return {
          gain: {
            setValueAtTime: () => {},
            linearRampToValueAtTime: () => {},
          },
          connect: () => {},
        };
      }
      close() {
        this.state = 'closed';
        return Promise.resolve();
      }
    };
  }

  // Mock navigator.clipboard
  if (!navigator.clipboard) {
    Object.assign(navigator, {
      clipboard: {
        writeText: () => Promise.resolve(),
      },
    });
  }
}
