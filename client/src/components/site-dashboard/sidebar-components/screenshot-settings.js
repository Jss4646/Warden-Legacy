import React, { useEffect } from "react";
import { Button, InputNumber } from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { JSHINT } from "jshint";

const ScreenshotSettings = (props) => {
  const { siteData, setFailingPercentage, setInjectedJS, setValidJS } = props;
  const { failingPercentage, sitePath, injectedJS, validJS } = siteData;

  const validateJS = (value, setValidJS) => {
    JSHINT(value, {}, {});
    const data = JSHINT.data();

    if (data.errors) {
      setValidJS(false);
      return;
    }

    setValidJS(true);
  };

  const updateInjectedJS = (value) => {
    localStorage.setItem(`${sitePath}-injectedJS`, value);
    setInjectedJS(value);
    validateJS(value, setValidJS);
  };

  const saveSettings = () => {
    const body = {
      sitePath,
      failingPercentage,
    };

    fetch("/api/set-site-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).catch((err) => {
      console.error(err);
    });
  };

  useEffect(() => {
    const localInjectedJS =
      localStorage.getItem(`${sitePath}-injectedJS`) ?? "";
    setInjectedJS(localInjectedJS);
    validateJS(localInjectedJS, setValidJS);
  }, [setInjectedJS, sitePath, setValidJS]);

  return (
    <div className="screenshot-settings">
      <div className="screenshot-settings__failing-threshold">
        <label>Failing Threshold: </label>
        <InputNumber
          className="screenshot-settings__failing-threshold-input"
          min={0}
          max={100}
          defaultValue={failingPercentage}
          value={failingPercentage}
          addonAfter="%"
          onChange={(value) => setFailingPercentage(value)}
        />
      </div>
      <div
        className={`screenshot-settings__injected-js${
          !validJS ? " screenshot-settings__injected-js--invalid-js" : ""
        }`}
      >
        <label>Injected JS: </label>
        <CodeMirror
          value={injectedJS}
          height="200px"
          extensions={[javascript()]}
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            syntaxHighlighting: true,
          }}
          onChange={(value) => updateInjectedJS(value)}
        />
      </div>
      <Button onClick={saveSettings}>Save</Button>
    </div>
  );
};

export default ScreenshotSettings;