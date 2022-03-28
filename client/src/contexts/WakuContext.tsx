import React, { useEffect, useState, createContext } from "react";
import { Waku } from "js-waku";

const WakuContext = createContext({
  waku: {} as Waku,
  ready: false,
});

type Props = {
  children: React.ReactNode;
};

export function WakuContextProvider({ children }: Props) {
  const [waku, setWaku] = useState<Waku>({} as Waku);
  const [ready, setReady] = useState(false);

  const context = {
    waku: waku,
    ready: ready,
  };

  useEffect(() => {
    Waku.create({
      libp2p: {
        config: {
          pubsub: {
            enabled: true,
            emitSelf: true,
          },
        },
      },
      bootstrap: { default: true },
    }).then(async (waku) => {
      await waku.waitForRemotePeer();
      setWaku(waku);
      setReady(true);
      console.log(`Status ~ Ready`);
    });
  }, []);

  return (
    <WakuContext.Provider value={context}>{children}</WakuContext.Provider>
  );
}

export default WakuContext;
