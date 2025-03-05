# Expo

## Expo Plugin

Starting from version `6.3.1`, `react-native-video` supports an Expo plugin. You can configure `react-native-video` properties in the `app.json`, `app.config.json`, or `app.config.js` file.

This is particularly useful when using the `Expo` managed workflow (`expo prebuild`), as it automatically sets up `react-native-video` properties in the native part of the Expo project.

### Example Configuration

```json
// app.json
{
  "name": "my app",
  "plugins": [
    [
      "react-native-video",
      {
        "enableNotificationControls": true,
        "androidExtensions": {
          "useExoplayerRtsp": false,
          "useExoplayerSmoothStreaming": false,
          "useExoplayerHls": false,
          "useExoplayerDash": false
        }
      }
    ]
  ]
}
```

## Expo Plugin Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| enableNotificationControls | boolean | false | Adds required changes on Android to use notification controls for the video player. |
| enableBackgroundAudio | boolean | false | Adds required changes to allow video playback in the background on iOS. |
| enableADSExtension | boolean | false | Adds required changes to enable the ads extension for the video player. |
| enableCacheExtension | boolean | false | Adds required changes to use the cache extension for the video player on iOS. |
| androidExtensions | object | {} | Enables/disables Android extensions as needed, helping to reduce library size. |
| enableAndroidPictureInPicture | boolean | false | Applies the necessary configurations to enable Picture-in-Picture mode on Android. |
