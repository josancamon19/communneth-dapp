import React, { useEffect, useState, createContext } from "react";
import { Waku } from "js-waku";

const WakuContext = createContext({});

export function WakuContextProvider(props) {
  const [waku, setWaku] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Waku.create({ bootstrap: { default: true } }).then(async (waku) => {
      setWaku(waku);
      await waku.waitForRemotePeer();
      setReady(true);
      console.log(`Status ~ Ready`);
      // this.wakuListenNewMessages();
      // this.wakuHistoryMessages();
    });
  }, []);

  return <WakuContext.Provider>{props.children}</WakuContext.Provider>;
}

export default WakuContext;
