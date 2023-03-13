# Changelog

## [1.6.0](https://github.com/new-order-network/new-order-app-ui/compare/v1.5.0...v1.6.0) (2023-03-13)


### Features

* integrate Youtube channel with the Videos tab on the home page ([575ddf4](https://github.com/new-order-network/new-order-app-ui/commit/575ddf45a829f2bcf950393993c8c3a7dbe72c14))


### Bug Fixes

* missing earned rewards on single side vault ([aea954a](https://github.com/new-order-network/new-order-app-ui/commit/aea954a8664ee75f630efa6fc0bc9e1810da5b97))
* remove console warnings about non-existing contracts ([ad70523](https://github.com/new-order-network/new-order-app-ui/commit/ad7052386cccc41feaca5532b05f34ad630e5fb2))


### Miscellaneous

* add data checks on the select functions to remove errors ([6f225de](https://github.com/new-order-network/new-order-app-ui/commit/6f225dee2bde12e23146ab64eefd7cc9240c1a5d))
* add env variables for youtube integration ([c869ec0](https://github.com/new-order-network/new-order-app-ui/commit/c869ec050384c5a11c2377d47a720139a11ca590))
* remove unnecessary useEffect functions ([3ec5619](https://github.com/new-order-network/new-order-app-ui/commit/3ec5619e12ce12c38f983d5e33586f8d3336f19b))

## [1.5.0](https://github.com/new-order-network/new-order-app-ui/compare/v1.4.1...v1.5.0) (2023-03-02)


### Features

* add balance loaders ([cd617b0](https://github.com/new-order-network/new-order-app-ui/commit/cd617b0dd008ff136a98a3e64c93b77f84ba718c))
* add geoblocking for US countries ([fe12729](https://github.com/new-order-network/new-order-app-ui/commit/fe1272977fcd469177b7bb7f61986dba7bb32575))


### Bug Fixes

* app crash when trying to access the app with the wrong chain ([96f6d95](https://github.com/new-order-network/new-order-app-ui/commit/96f6d9581fca3e240d08f43678a1b0e07069649b))
* incorrect vaults showing on the venewo page ([f891d85](https://github.com/new-order-network/new-order-app-ui/commit/f891d8555478deed6729e9bd548d8fa68027899c))
* non-testnet chains not showing on change network modal ([2af3d14](https://github.com/new-order-network/new-order-app-ui/commit/2af3d142fd9bc3bfb4a5761bd51c613f3fc2d3d5))
* unlock date not updating after wallet change ([c4ec6bc](https://github.com/new-order-network/new-order-app-ui/commit/c4ec6bcb2585e3bbd60a412b36659cd49ba15ccd))
* value of multiplier not updating after wallet change ([bac8e52](https://github.com/new-order-network/new-order-app-ui/commit/bac8e5232b4c892ccc8399732058c45f88a4c7a0))


### Miscellaneous

* add dependabot on github actions ([#59](https://github.com/new-order-network/new-order-app-ui/issues/59)) ([1b4568c](https://github.com/new-order-network/new-order-app-ui/commit/1b4568c72902344e22febf484a1020d820060a9d))
* change community button link to academy ([b1a144b](https://github.com/new-order-network/new-order-app-ui/commit/b1a144bb63f2d75f925955483f39138241689381))
* force zero apr on the avax lp vault ([c8227f1](https://github.com/new-order-network/new-order-app-ui/commit/c8227f11a842c2f32713e8f8e8986e5e1c0e37fa))
* force zero apr on the eth lp vault ([ce75114](https://github.com/new-order-network/new-order-app-ui/commit/ce75114d1de432d626437928ee80463956a6d4f9))
* remove governance staking button and modal ([6d28f89](https://github.com/new-order-network/new-order-app-ui/commit/6d28f891f7270be8b5e2f3a2f4ae9aae1ca4deb9))
* update wagmi dependency to latest version ([f0aa949](https://github.com/new-order-network/new-order-app-ui/commit/f0aa949459e19848d2df6ad36c6a1b5fa9f3df65))

## [1.4.1](https://github.com/new-order-network/new-order-app-ui/compare/v1.4.0...v1.4.1) (2023-01-17)


### Bug Fixes

* incorrect voting completion date ([cdf6185](https://github.com/new-order-network/new-order-app-ui/commit/cdf6185e3afeb367917d8101606d2e4ec27f25c0))
* typos ([93e3f80](https://github.com/new-order-network/new-order-app-ui/commit/93e3f806b74b41db756b3f17d8929885a92393a0))
* typos ([93e3f80](https://github.com/new-order-network/new-order-app-ui/commit/93e3f806b74b41db756b3f17d8929885a92393a0))

## [1.4.0](https://github.com/new-order-network/new-order-app-ui/compare/v1.3.1...v1.4.0) (2023-01-17)


### Features

* add tooltip on voting power to show details of block number of snapshot ([6429ab7](https://github.com/new-order-network/new-order-app-ui/commit/6429ab7873d8b70ca32eaca141cee0efe0c0597f))
* show voting power on voting page ([9b8653d](https://github.com/new-order-network/new-order-app-ui/commit/9b8653d7f864bfb1d7d914eac799e0eda6191d45))


### Bug Fixes

* voting power not showing on the proposal ([f079653](https://github.com/new-order-network/new-order-app-ui/commit/f079653dda3164ecb2274ebb665208ecafc0380a))


### Miscellaneous

* **deps:** bump loader-utils from 1.4.0 to 1.4.2 ([20a0b49](https://github.com/new-order-network/new-order-app-ui/commit/20a0b4955b5a508fe4c51a836e8fa48ccdde1e0e))

## [1.3.1](https://github.com/new-order-network/new-order-app-ui/compare/v1.3.0...v1.3.1) (2023-01-16)


### Bug Fixes

* disable button when no venewo is on the wallet ([8cd24ed](https://github.com/new-order-network/new-order-app-ui/commit/8cd24ed9e6de9acfe9c79e32c479d5a49a48495f))
* hydration message on header components ([1b5c133](https://github.com/new-order-network/new-order-app-ui/commit/1b5c1339f5dea908cdb2585e67e43f71cf627215))
* hydration message on invest page ([98d6b91](https://github.com/new-order-network/new-order-app-ui/commit/98d6b91f6f56f6e7a3e88c341fa4afbab1c31601))
* register button is disabled on lp when boost is 1 ([8758a8f](https://github.com/new-order-network/new-order-app-ui/commit/8758a8f47aac374cc6a6f680a7de7c2aae3c8d6d))
* registered detection failing on first visit ([6c131d5](https://github.com/new-order-network/new-order-app-ui/commit/6c131d5ca26a0a9551ea3211bb9abd4d3762da32))


### Miscellaneous

* add tooltip on the venewo register button to inform users to re-register ([7b56bef](https://github.com/new-order-network/new-order-app-ui/commit/7b56befe387bcde625c461b5a7ccb662d8f3c9fd))
* update the tooltip message ([137f185](https://github.com/new-order-network/new-order-app-ui/commit/137f185543805ba1ffecee281b50b5169b7e4fba))

## [1.3.0](https://github.com/new-order-network/new-order-app-ui/compare/v1.2.1...v1.3.0) (2022-11-08)


### Features

* add the api endpoint to return latest locked newo ([6cd5740](https://github.com/new-order-network/new-order-app-ui/commit/6cd574049f8123a38685f50b4abd1c747857c358))
* update contract addresses to goerli contracts ([76858ea](https://github.com/new-order-network/new-order-app-ui/commit/76858ea9942170784f5ec1c2905d145331513070))


### Bug Fixes

* disable venewo button after approval function ([48aa59f](https://github.com/new-order-network/new-order-app-ui/commit/48aa59f0cb8408eefff53e588b459e74678ba6dc))

## [1.2.1](https://github.com/new-order-network/new-order-app-ui/compare/v1.2.0...v1.2.1) (2022-11-02)


### Bug Fixes

* claim function on venewo rewards and vaults ([024af9a](https://github.com/new-order-network/new-order-app-ui/commit/024af9a54009e6e5c5b9b3f8745f78fe57859664))


### Miscellaneous

* reconfigure setup of contract hooks ([4b307a4](https://github.com/new-order-network/new-order-app-ui/commit/4b307a44698ea5c9a6be93771fa1d01a1466afbb))

## [1.2.0](https://github.com/new-order-network/new-order-app-ui/compare/v1.1.1...v1.2.0) (2022-11-01)


### Features

* update wagmi and refactor code ([8fd24e8](https://github.com/new-order-network/new-order-app-ui/commit/8fd24e8851e038d4a51cca3466509f7504a54dc9))


### Bug Fixes

* add the fucntion to withdraw all locked tokens ([9964fa4](https://github.com/new-order-network/new-order-app-ui/commit/9964fa420b42e7fbadc022c949f0567022c4b558))
* app crash when trying to change network ([760d829](https://github.com/new-order-network/new-order-app-ui/commit/760d829e6e350389fd6c61559cfe8acc86503e18))
* image not showing on voting detail page ([25b718e](https://github.com/new-order-network/new-order-app-ui/commit/25b718ee4b9aa3c92bc3a6926731cbf9393b8f5a))
* linting issues on sidebar constants ([53761b5](https://github.com/new-order-network/new-order-app-ui/commit/53761b5c857b51fb10a4ec33c6396ca12d1e3618))
* next config warnings ([6b9f9f9](https://github.com/new-order-network/new-order-app-ui/commit/6b9f9f9ba488e8cb2dc31c3ea92230a711a9224f))
* white background on the twitter timeline embed ([96eb672](https://github.com/new-order-network/new-order-app-ui/commit/96eb672acb12b8c63f401e2524971ed1236a7f2c))

## [1.1.1](https://github.com/new-order-network/new-order-app-ui/compare/v1.1.0...v1.1.1) (2022-08-11)


### Bug Fixes

* fixed import ([5f7e56c](https://github.com/new-order-network/new-order-app-ui/commit/5f7e56c88e19e82ced9c48d2c18730b447e16f22))
* fixed incorrect counting of proposals with outcome ([708eea9](https://github.com/new-order-network/new-order-app-ui/commit/708eea939f7f95d5a5d637155cf2389a24c4a8fa))
* forgotten import ([38956aa](https://github.com/new-order-network/new-order-app-ui/commit/38956aae99d3a7ba12c8d0fd13a10c90b0a7941a))
* issue with type/enum ([5b18431](https://github.com/new-order-network/new-order-app-ui/commit/5b184312d89d3a28741e3763d104b27045230006))
* passed filter doesn't display active proposals anymore ([d7bcdd1](https://github.com/new-order-network/new-order-app-ui/commit/d7bcdd121204108e7ad1c90586100f554ffa915b))


### Miscellaneous

* cleaned up a condition ([5b377b3](https://github.com/new-order-network/new-order-app-ui/commit/5b377b37d5068bd5cd9709c1171b56acea9c9a85))
* code cleanup ([dacaebd](https://github.com/new-order-network/new-order-app-ui/commit/dacaebda8fd3ec8b5a01a9f6f0260bbb7f29b245))
* reworked state setting ([2d9c24b](https://github.com/new-order-network/new-order-app-ui/commit/2d9c24b776c5a5692d9bb64057a05dbe44883cbc))

## [1.1.0](https://github.com/new-order-network/new-order-app-ui/compare/v1.0.5...v1.1.0) (2022-08-08)


### Features

* update withdraw disabled logic for LP Vaults ([b5ade6f](https://github.com/new-order-network/new-order-app-ui/commit/b5ade6f8babc19b8bb96008387362592ff745a88))


### Bug Fixes

* enable withdraw button for legacy LP Vaults ([020fc47](https://github.com/new-order-network/new-order-app-ui/commit/020fc47438f99ca11d2b75989a60754a8242808c))

## [1.0.5](https://github.com/new-order-network/new-order-app-ui/compare/v1.0.4...v1.0.5) (2022-08-04)


### Bug Fixes

* invalid discord link ([869da57](https://github.com/new-order-network/new-order-app-ui/commit/869da573e6d6bd072f24c97be30da20b1018b31c))

## [1.0.4](https://github.com/new-order-network/new-order-app-ui/compare/v1.0.3...v1.0.4) (2022-08-04)


### Miscellaneous

* remove legacy app link ([dc26f0e](https://github.com/new-order-network/new-order-app-ui/commit/dc26f0e8c316c85a51f616edc1e86af462129a21))
* update links on the ui ([5c5fcf8](https://github.com/new-order-network/new-order-app-ui/commit/5c5fcf85625d4b30f802cfc502f88f5420df3eba))

## [1.0.3](https://github.com/new-order-network/new-order-app-ui/compare/v1.0.2...v1.0.3) (2022-08-01)


### Bug Fixes

* consolidate avax and eth supplies ([34eab06](https://github.com/new-order-network/new-order-app-ui/commit/34eab062a1f470b3adf69bfddae757d8862ae773))

## [1.0.2](https://github.com/new-order-network/new-order-app-ui/compare/v1.0.1...v1.0.2) (2022-07-28)


### Miscellaneous

* update issue templates ([bbdba84](https://github.com/new-order-network/new-order-app-ui/commit/bbdba84d043f2a48fc6383920328ddc362417e10))

## [1.0.1](https://github.com/new-order-network/new-order-app-ui/compare/v1.0.0...v1.0.1) (2022-07-28)


### Miscellaneous

* add CHANGELOG.md to prettierignore ([3136a54](https://github.com/new-order-network/new-order-app-ui/commit/3136a54f36d811c2e2042afbfd1a4dae8e084d8f))
* update migration link and alt of logo ([573a9d4](https://github.com/new-order-network/new-order-app-ui/commit/573a9d4c46403394d34f4b563dcac980e1029c4c))

## 1.0.0 (2022-07-27)


### Features

* new order app ui v1 ([f9862b9](https://github.com/new-order-network/new-order-app-ui/commit/f9862b94e955c92527ab924c557f47ada87cd73e))
