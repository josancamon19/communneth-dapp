import React, { useEffect, useState, createContext } from "react";
import { Waku } from "js-waku";

const WakuContext = createContext({
  waku: null,
  ready: false,
});

export function WakuContextProvider(props) {
  const [waku, setWaku] = useState(null);
  const [ready, setReady] = useState(false);

  const context = {
    waku: waku,
    ready: ready,
  };

  useEffect(() => {
    Waku.create({ bootstrap: { default: true } }).then(async (waku) => {
      setWaku(waku);
      await waku.waitForRemotePeer();
      setReady(true);
      console.log(`Status ~ Ready`);
    });
  }, []);

  return (
    <WakuContext.Provider value={context}>
      {props.children}
    </WakuContext.Provider>
  );
}

export default WakuContext;
