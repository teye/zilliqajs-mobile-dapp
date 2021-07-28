# React Native - ZilliqaJS

## ZilliqaJS 3.0.0 on React Native.

![image](https://user-images.githubusercontent.com/6906654/127317857-38f19260-ec5e-4f7c-81b5-8a154afde082.png)


### Problem
By default, react native doesn't recognize internal node modules such as `crypto`, `fs` etc. This becomes an issue if a react-native project has added a dependencies which itself require node modules to be used in the "normal expected" manner. See https://gist.github.com/parshap/e3063d9bf6058041b34b26b7166fd6bd for more information.

### Solution
To use "native" NodeJS packages in react-native, we need to replace the packages with "react-native" implementations.


Hence to resolve it, we need to first install "react-native" replacements:
```
yarn add rn-nodeify
yarn add asyncstorage-down
yarn add levelup
```
There are many methods to replace but `rn-nodeify` seems to be more compatible for `ZilliqaJS`.

Next, import `shim.js`  before the app is initialized, e.g. in `index.js`:
```
import './shim.js';    <-- add this
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

Lastly, add the following to `package.json`:
```
"start": "react-native start",
"postinstall": "rn-nodeify --install --hack",  <-- add this
```

Perform a `yarn install`.

The above steps utilizes `rn-nodeify` to install react-native replacements and edit other packages that may contain NodeJS functions and convert them to use react-native compatible modules.

### How to use ZilliqaJS on React-Native
Now that we have replaced the NodeJS modules, we can start using `zilliqaJS`.

Refer to [screen.tsx](src/components/screen.tsx) for the actual usecase.

### How to run the project
1. Install Android SDK
2. Go to Tools, AVD manager.
3. May need to perform `sudo chown $USER /dev/kvm` if permission denied.
4. Create `.bash_profile`
```
export PATH="$PATH:$HOME/npm/bin"
export NODE_PATH="$NODE_PATH:$HOME/npm/lib/node_modules"
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/tools"
export PATH="$PATH:$ANDROID_HOME/tools/bin"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
```
5. `source $HOME/.bash_profile`
6. `yarn install`
7. open terminal 1: `npm run start`
8. open terminal 2: `npm run android`
9. If gradle access denied during `npm run android`, execute the following:
```
cd android
sudo chmod 765 gradlew
```
