# ic-react-starter

Starter project for building a dApp on the Internet Computer with Motoko and React.js.

## Developer Setup (macOS)

These instructions assume that you are using macOS with a fresh factory build and that you're using the zsh terminal to run commands.

### Install Brew

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Add Brew path

Add line to ~/.zshrc file. (Create file if it doesn't exist.)

```
export PATH="/opt/homebrew/bin:$PATH" >> ~/.zshrc
```

### Install Git

```
git --version
```

Follow install prompts.

### Install GitHub CLI

```
brew install gh
```

### Login to GitHub

```
gh auth login
```

Follow prompts to login using a browser.

### Install nvm.

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

More info: https://github.com/nvm-sh/nvm#installing-and-updating

### Install node version 16.

```
nvm install 16
```

Add the following two lines to your ~/.zshrc file.

```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

### Install Rust

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

More info: https://www.rust-lang.org/tools/install

### Install CMake

Download and install:
https://github.com/Kitware/CMake/releases/download/v3.22.1/cmake-3.22.1-macos-universal.dmg

More info: https://cmake.org/install

Create symlinks to cmake:

```
sudo "/Applications/CMake.app/Contents/bin/cmake-gui" --install
```

### Install Dfx

#### Apple Silicon Chips (M1/M2)

```
Softwareupdate --install-rosetta
```

#### Pentium and Silicon Chips

```
DFX_VERSION=0.10.0 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

### Install Vessel

#### Download latest vessel-macos into usr/local/bin

https://github.com/dfinity/vessel/releases

#### Rename to vessel

```
mv vessel-linux64 vessel
```

#### Grant Permission for vessel to run

```
sudo chmod +x vessel

sudo spctl --add "/usr/local/bin"
```

### Clone the Internet Identity project in developer mode.

In a the directory of your choice:

```
git clone https://github.com/dfinity/internet-identity.git
```

### Start a local instance of Internet Computer

IMPORTANT: This step will need to be repeated whenever you are developing.

Open a separate terminal and change the directory to the root of the internet-identity project.

After running the following command, leave the terminal window open to view debug output.

```
dfx start
```

### Deploy a local debug build of the Internet Identity canister

Open a separate terminal and change the directory to the root of the internet-identity project.

```
export II_FETCH_ROOT_KEY=1 II_DUMMY_CAPTCHA=1 II_DUMMY_AUTH=1 II_DUMMY_POW=1

npm ci

dfx deploy --argument '(null)'
```

### Clone the ic-react-starter project locally

```
git clone https://github.com/VerifiedGiveaways/ic-react-starter
```

#### Install npm modules

```
cd ic-react-starter

npm ci
```

### Create .env.local file

Copy the /frontend/portal/.env file and rename the copy to .env.local.

Modify the II_PROVIDER_URL value as follows, but replace the canister id with the id of your local Internet Identity canister:

http://rrkah-fqaaa-aaaaa-aaaaq-cai.localhost:8000/#authorize

The canister id can be found in the Internet Identity project in the .dfx/local/canister_ids.json file.

### Install specific esbuild (M1 or M2 processor only)

```
npm i -f  esbuild-darwin-64
```

### Build and deploy the ic-react-starter project

```
cd backend-mo/accounts
dfx deploy

cd ../content
dfx deploy

cd ../../frontend/portal
dfx deploy
```

### Run the ic-react-starter portal

```
npm start
```
