# `urbitswap` #

A peer-to-peer NFT trading platform native to [Urbit]

## Build/Develop ##

All commands assume that the current working directory is this repository's
base directory and use [durploy] to streamline various Urbit development
workflows.

### First-time Setup ###

The following commands should be executed after each fresh clone of the project
to set up the [Vite] and the UI development environment:

```bash
nvm install 16
nvm use 16
cd ./ui
yarn install
echo "VITE_SHIP_URL=http://127.0.0.1:8080" > .env.local
echo "VITE_RARIBLE_MAINNET_KEY=$RARIBLE_MAINNET_APIKEY" >> .env.local
echo "VITE_RARIBLE_TESTNET_KEY=$RARIBLE_TESTNET_APIKEY" >> .env.local
# Optional: To eliminate rate limiting for ETH requests.
echo "VITE_ALCHEMY_KEY=$ALCHEMY_APIKEY" >> .env.local
# Optional: To enable Arcade loan/staking features.
echo "VITE_ARCADE_KEY=$ARCADE_APIKEY" >> .env.local
```

Subsequently, run the following commands to download [durploy] create a new
[fake `~zod`][fakezod] with the `%urbitswap` desk:

```bash
curl -LO https://raw.githubusercontent.com/sidnym-ladrut/durploy/release/durploy
chmod u+x ./durploy
./durploy ship zod
# In a different terminal:
./durploy desk zod urbitswap ./desk/full/
```

### Development Workflows ###

#### Back-end Workflows ####

In order to continuously test back-end code changes as they're made, run the
following commands:

```bash
./durploy desk -w zod urbitswap ./desk/full/
```

#### Front-end Workflows ####

In order to continuously test front-end code changes as they're made, run the
following commands:

```bash
cd ./ui
npm run dev
```

Also, be sure to authenticate via both the NPM web portal (default:
`127.0.0.1:3000`) and the development ship's web portal ([fake `~zod`][fakezod]
default: `127.0.0.1:8080`) using the output of the Urbit `+code` command as
the password.

### Deployment Workflow ###

#### Back-end Workflows ####

To generate a new full desk from the existing base desk, run all
of the following commands:

```bash
cd ./desk
rm -rI full/
find bare -type f | while read f; do { d=$(dirname "$f" | sed "s/^bare/full/"); mkdir -p "$d"; ln -sr -t "$d" "$f"; }; done
ln -sr ../LICENSE.txt full/license.txt
git clone -b 412k-rc2 --depth 1 https://github.com/urbit/urbit.git urb
cp urb/pkg/arvo/mar/{bill*,hoon*,json*,kelvin*,mime*,noun*,ship*,txt*} full/mar/
cp urb/pkg/arvo/lib/{agentio*,dbug*,default-agent*,skeleton*,verb*,naive*,tiny*,ethereum*} full/lib/
cp urb/pkg/arvo/sur/verb.hoon full/sur/
cp urb/pkg/base-dev/lib/mip.hoon full/lib/
git clone -b v1.16.0 --depth 1 https://github.com/tloncorp/landscape.git lan
cp lan/desk/mar/docket* full/mar/
cp lan/desk/lib/docket* full/lib/
cp lan/desk/sur/docket* full/sur/
git clone -b sl/fix-scry-request-agent-wire --depth 1 https://github.com/sidnym-ladrut/sss.git sss
cp sss/urbit/lib/sss.hoon full/lib/
cp sss/urbit/sur/sss.hoon full/sur/
```

#### Front-end Workflows ####

In order to test the web package deployment process for the current
front-end build, run the following commands:

```bash
cd ./ui
npm run build
cd ..
./durploy desk -g zod urbitswap ./ui/dist/
cp "$(ls -dtr1 "${XDG_CACHE_HOME:-$HOME/.cache}/durploy/glob"/* | tail -1)" ./meta/glob
./meta/exec/release -l 1.2.3 "$(ls -dtr1 ./meta/glob/* | tail -1)"
./durploy desk zod urbitswap ./desk/full/
# run this in zod's dojo to make sure the new glob is being used
# :docket [%kick %urbitswap]
```


[urbit]: https://urbit.org
[durploy]: https://github.com/sidnym-ladrut/durploy

[fakezod]: https://developers.urbit.org/guides/core/environment#development-ships
[react]: https://reactjs.org/
[tailwind css]: https://tailwindcss.com/
[vite]: https://vitejs.dev/
