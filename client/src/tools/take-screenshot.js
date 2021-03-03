import devices from "../data/devices.json";
import { v1 as uuidv1 } from "uuid";

const takeScreenshot = async (url, props) => {
  const { addScreenshot, addScreenshotImage, addActivityLogLine } = props;
  const { selectedDevices } = props.appState;

  for (const deviceKey of selectedDevices) {
    const { width, height, userAgent, name } = devices[deviceKey];

    const screenshotId = uuidv1();

    const parsedUrl = new URL(url);

    const screenshotData = {
      deviceName: name,
      image: "",
      id: screenshotId,
      url: parsedUrl,
      state: "running",
    };

    addScreenshot(screenshotData);

    const params = {
      url: parsedUrl,
      userAgent: userAgent,
      resolution: { width, height },
      id: screenshotId,
    };

    /** Use for actual api call **/
    fetchScreenshot(params, addActivityLogLine).then((screenshotImage) =>
      addScreenshotImage(screenshotData, screenshotImage)
    );
  }
};

const fetchScreenshot = async (params, addActivityLogLine) => {
  console.log("Taking screenshot");
  const fetchUrl = new URL(`${window.location.origin}/api/take-screenshot`);

  return await fetch(fetchUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then(async (res) => {
      if (res.ok) {
        return res.arrayBuffer();
      } else {
        console.log(res);
        throw new Error(`Screenshot request not ok: ${await res.text()}`);
      }
    })
    .then(async (image) => {
      console.log("Creating image");
      const imageBlob = new Blob([image], { type: "image/jpeg" });

      return URL.createObjectURL(imageBlob);
    })
    .catch((err) => {
      addActivityLogLine(
        <>
          Couldn't fetch screenshot: <code>{err.toString()}</code>
        </>
      );
    });
};

export default takeScreenshot;
