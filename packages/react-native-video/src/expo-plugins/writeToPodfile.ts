import fs from 'fs';
import path from 'path';
import {mergeContents} from '@expo/config-plugins/build/utils/generateCode';

export const writeToPodfile = (
  projectRoot: string,
  key: string,
  value: string,
  testApp: boolean = false,
) => {
  const podfilePath = path.join(projectRoot, 'ios', 'Podfile');
  const podfileContent = fs.readFileSync(podfilePath, 'utf8');

  // This is for internal purposes only. We are removing the ENV checks from the Podfile.
  // If this conflicts with your project's setup, please let report it to us.
  const regex =
    /if ENV\['RNV_SAMPLE_ENABLE_ADS'\]\s*\n\s*\$RNVideoUseGoogleIMA\s*=\s*(true|false)\s*\nend\n*|if ENV\['RNV_SAMPLE_VIDEO_CACHING'\]\s*\n\s*\$RNVideoUseVideoCaching\s*=\s*(true|false)\s*\nend\n*/g;

  const podfileContentWithoutEnv = `{${podfileContent}}`.replace(regex, '');

  if (podfileContentWithoutEnv.includes(`$${key} =`)) {
    console.warn(
      `RNV - Podfile already contains a definition for "$${key}". Skipping...`,
    );
    return;
  }

  if (testApp) {
    console.log('RNV - Writing to Test App Podfile');
    mergeTestAppPodfile(podfileContent, podfilePath, key, value);
  } else {
    console.log('RNV - Writing to Expo Podfile');
    mergeExpoPodfile(podfileContent, podfilePath, key, value);
  }
};

const mergeTestAppPodfile = (
  podfileContent: string,
  podfilePath: string,
  key: string,
  value: string,
) => {
  // We will try to inject the variable definition above the `use_test_app!` call in the Podfile.
  const newPodfileContent = mergeContents({
    tag: `rn-video-set-${key.toLowerCase()}`,
    src: podfileContent,
    newSrc: `$${key} = ${value}`,
    anchor: /use_test_app!/,
    offset: -1, // Insert the key-value pair just above the `use_test_app!` call.
    comment: '#',
  });

  // Write to Podfile only if the merge was successful
  if (newPodfileContent.didMerge) {
    fs.writeFileSync(podfilePath, newPodfileContent.contents);
  } else {
    console.warn(
      `RNV - Failed to write "$${key} = ${value}" to Test App Podfile`,
    );
  }
};

const mergeExpoPodfile = (
  podfileContent: string,
  podfilePath: string,
  key: string,
  value: string,
) => {
  const newPodfileContent = mergeContents({
    tag: `rn-video-set-${key.toLowerCase()}`,
    src: podfileContent,
    newSrc: `$${key} = ${value}`,
    anchor: /platform :ios/,
    offset: 0,
    comment: '#',
  });

  if (newPodfileContent.didMerge) {
    fs.writeFileSync(podfilePath, newPodfileContent.contents);
  } else {
    console.warn(`RNV - Failed to write "$${key} = ${value}" to Podfile`);
  }
};
