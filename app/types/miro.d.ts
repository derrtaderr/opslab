interface MiroIconClickEvent {
  type: string;
  data: {
    type: string;
    [key: string]: any;
  };
}

interface MiroSDK {
  board: {
    ui: {
      on: (event: 'icon:click', callback: (event: MiroIconClickEvent) => void) => void;
    };
  };
}

declare global {
  interface Window {
    miro?: MiroSDK;
  }
} 